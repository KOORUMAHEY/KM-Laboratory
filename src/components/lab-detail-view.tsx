
'use client';

import React, { useState, useOptimistic, useTransition, useCallback, useEffect } from 'react';
import type { LabExperiment, LabStatus, LabCodeSnippet, LabLink } from '@/data/types';
import { useAdmin } from '@/hooks/use-admin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CodeBlock } from './code-block';
import { AISuggestionCard } from './ai-suggestion-card';
import { PlusCircle, Trash2, UploadCloud, Pencil } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { updateLabDetails, addCodeSnippet, updateCodeSnippet, deleteCodeSnippet, addLink, updateLink, deleteLink } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';


// Debounce hook
function useDebounce<T extends (...args: any[]) => void>(callback: T, delay: number) {
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Cleanup the timeout on component unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  return debouncedCallback;
}

type OptimisticAction = 
    | { action: 'update', payload: Partial<LabExperiment> }
    | { action: 'add_snippet', payload: LabCodeSnippet }
    | { action: 'update_snippet', payload: LabCodeSnippet }
    | { action: 'delete_snippet', payload: string }
    | { action: 'add_link', payload: LabLink }
    | { action: 'update_link', payload: LabLink }
    | { action: 'delete_link', payload: string };


export function LabDetailView({ initialLab }: { initialLab: LabExperiment }) {
  const { isAdmin } = useAdmin();
  const { toast } = useToast();
  const [lab, setLab] = useState<LabExperiment>(initialLab);
  const [showAiSuggestion, setShowAiSuggestion] = useState(false);

  const [optimisticLab, setOptimisticLab] = useOptimistic(
    lab,
    (state, newContent: OptimisticAction) => {
        switch (newContent.action) {
            case 'update':
                return { ...state, ...newContent.payload };
            case 'add_snippet':
                return { ...state, codes: [...(state.codes || []), newContent.payload] };
            case 'update_snippet':
                return { ...state, codes: (state.codes || []).map(s => s.id === newContent.payload.id ? newContent.payload : s) };
            case 'delete_snippet':
                return { ...state, codes: (state.codes || []).filter(s => s.id !== newContent.payload) };
            case 'add_link':
                 return { ...state, links: [...(state.links || []), newContent.payload] };
            case 'update_link':
                return { ...state, links: (state.links || []).map(l => l.id === newContent.payload.id ? newContent.payload : s) };
            case 'delete_link':
                 return { ...state, links: (state.links || []).filter(l => l.id !== newContent.payload) };
            default:
                return state;
        }
    }
   );

   const [isPending, startTransition] = useTransition();

   const handleDetailsUpdate = async (updates: Partial<LabExperiment>) => {
        const originalLab = { ...lab };
        const newStatus = updates.status;

        startTransition(async () => {
            setOptimisticLab({ action: 'update', payload: updates });

            const formData = new FormData();
            formData.append('title', updates.title || lab.title);
            formData.append('description', updates.description || lab.description || '');
            formData.append('status', updates.status || lab.status);

            const result = await updateLabDetails(lab.id, formData);

            if (result.success) {
                toast({ title: "Success", description: "Lab details updated." });
                setLab(prev => ({...prev, ...updates}));

                if (newStatus && newStatus !== originalLab.status) {
                    setShowAiSuggestion(true);
                }
            } else {
                toast({ title: "Error", description: result.message, variant: "destructive" });
                setLab(originalLab); // Revert on failure
            }
        });
   };

  const debouncedUpdate = useDebounce((updates: Partial<LabExperiment>) => {
    handleDetailsUpdate(updates);
  }, 1000);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updates = { [name]: value };
    startTransition(() => {
        setOptimisticLab({ action: 'update', payload: updates});
    });
    setLab(prev => ({ ...prev, ...updates }));
    debouncedUpdate(updates);
  };

  const handleStatusChange = (value: LabStatus) => {
    const updates = { status: value };
    startTransition(() => {
        setOptimisticLab({ action: 'update', payload: updates});
    });
    setLab(prev => ({ ...prev, ...updates }));
    handleDetailsUpdate(updates);
  };

  const handleAddSnippet = async (formData: FormData) => {
    const newSnippet = {
      id: `temp-${Date.now()}`,
      experimentId: lab.id,
      language: formData.get('language') as string,
      code: formData.get('code') as string,
      description: formData.get('description') as string | null,
    };

    startTransition(async () => {
      setOptimisticLab({ action: 'add_snippet', payload: newSnippet });
      const result = await addCodeSnippet(lab.id, formData);
      if (result.success && result.newId) {
          toast({ title: "Success", description: "New snippet added." });
          setLab(prev => ({...prev, codes: [...(prev.codes || []).filter(c => c.id !== newSnippet.id), { ...newSnippet, id: result.newId }]}));
      } else {
          toast({ title: "Error", description: result.message, variant: "destructive" });
          setOptimisticLab({ action: 'delete_snippet', payload: newSnippet.id });
      }
    });
  }

  const handleUpdateSnippet = async (snippetId: string, formData: FormData) => {
      const originalSnippet = optimisticLab.codes?.find(s => s.id === snippetId);
      if (!originalSnippet) return;

      const updatedSnippet = {
          ...originalSnippet,
          language: formData.get('language') as string,
          code: formData.get('code') as string,
          description: formData.get('description') as string | null,
      };

      startTransition(async () => {
          setOptimisticLab({ action: 'update_snippet', payload: updatedSnippet });
          const result = await updateCodeSnippet(snippetId, lab.id, formData);
          if (result.success) {
              toast({ title: "Success", description: "Snippet updated." });
              setLab(prev => ({...prev, codes: (prev.codes || []).map(s => s.id === snippetId ? updatedSnippet : s)}));
          } else {
              toast({ title: "Error", description: result.message, variant: "destructive" });
              setOptimisticLab({ action: 'update_snippet', payload: originalSnippet });
          }
      });
  }

  const handleDeleteSnippet = async (snippetId: string) => {
    const originalSnippets = optimisticLab.codes;
    startTransition(async () => {
      setOptimisticLab({ action: 'delete_snippet', payload: snippetId });
      const result = await deleteCodeSnippet(snippetId, lab.id);
      if (result.success) {
         toast({ title: "Success", description: "Snippet deleted." });
         setLab(prev => ({ ...prev, codes: prev.codes?.filter(s => s.id !== snippetId) }));
      } else {
          toast({ title: "Error", description: result.message, variant: "destructive" });
          setOptimisticLab({ action: 'update_snippet', payload: originalSnippets?.find(s => s.id === snippetId)! });
      }
    });
  }

  const handleAddLink = async (formData: FormData) => {
      const newLink = {
          id: `temp-${Date.now()}`,
          experimentId: lab.id,
          name: formData.get('name') as string,
          url: formData.get('url') as string,
      };

      startTransition(async () => {
        setOptimisticLab({ action: 'add_link', payload: newLink });
        const result = await addLink(lab.id, formData);
        if (result.success && result.newId) {
            toast({ title: "Success", description: "New link added." });
            setLab(prev => ({...prev, links: [...(prev.links || []).filter(l => l.id !== newLink.id), { ...newLink, id: result.newId }]}));
        } else {
            toast({ title: "Error", description: result.message, variant: "destructive" });
            setOptimisticLab({ action: 'delete_link', payload: newLink.id });
        }
      });
  }

  const handleUpdateLink = async (linkId: string, formData: FormData) => {
      const originalLink = optimisticLab.links?.find(l => l.id === linkId);
      if (!originalLink) return;

      const updatedLink = {
          ...originalLink,
          name: formData.get('name') as string,
          url: formData.get('url') as string,
      };

      startTransition(async () => {
          setOptimisticLab({ action: 'update_link', payload: updatedLink });
          const result = await updateLink(linkId, lab.id, formData);
          if (result.success) {
              toast({ title: "Success", description: "Link updated." });
              setLab(prev => ({...prev, links: (prev.links || []).map(l => l.id === linkId ? updatedLink : l)}));
          } else {
              toast({ title: "Error", description: result.message, variant: "destructive" });
              setOptimisticLab({ action: 'update_link', payload: originalLink });
          }
      });
  }

  const handleDeleteLink = async (linkId: string) => {
    const originalLinks = optimisticLab.links;
    startTransition(async () => {
        setOptimisticLab({ action: 'delete_link', payload: linkId });
        const result = await deleteLink(linkId, lab.id);
         if (result.success) {
           toast({ title: "Success", description: "Link deleted." });
           setLab(prev => ({ ...prev, links: prev.links?.filter(l => l.id !== linkId) }));
        } else {
            toast({ title: "Error", description: result.message, variant: "destructive" });
            setOptimisticLab({ action: 'update_link', payload: originalLinks?.find(l => l.id === linkId)! });
        }
    });
  }

  const adminRingClass = "focus:ring-2 focus:ring-primary/80 dark:focus:ring-primary/80";

  return (
    <div className="grid gap-8 lg:grid-cols-3 animate-fade-in-up">
      <div className="space-y-8 lg:col-span-2">
        <Card className="animate-fade-in">
          <CardHeader>
            {isAdmin ? (
              <Input name="title" defaultValue={optimisticLab.title} onChange={handleInputChange} className={cn("text-2xl font-bold font-headline h-12", adminRingClass)} disabled={isPending} />
            ) : (
              <CardTitle className="text-3xl font-bold font-headline">{optimisticLab.title}</CardTitle>
            )}
            {isAdmin ? (
              <Textarea name="description" defaultValue={optimisticLab.description || ''} onChange={handleInputChange} rows={3} disabled={isPending} className={adminRingClass} />
            ) : (
              <CardDescription className="pt-2 text-base">{optimisticLab.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="font-semibold text-sm">Status:</span>
              {isAdmin ? (
                <Select value={optimisticLab.status} onValueChange={handleStatusChange} disabled={isPending}>
                  <SelectTrigger className={cn("w-[200px]", adminRingClass)}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Stuck">Stuck</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <span className="text-foreground">{optimisticLab.status}</span>
              )}
            </div>
          </CardContent>
        </Card>

        {showAiSuggestion && (
           <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
             <AISuggestionCard labStatus={optimisticLab.status} relevantCodes={optimisticLab.codes?.map(c => c.code).join('\n\n---\n\n') || ''} />
           </div>
        )}

        <Tabs defaultValue="code" className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <TabsList>
            <TabsTrigger value="code">Code Snippets</TabsTrigger>
            <TabsTrigger value="links">Links & Files</TabsTrigger>
          </TabsList>
          <TabsContent value="code" className="mt-4 animate-fade-in">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Relevant Code</CardTitle>
                    <CardDescription>Code snippets for completing this experiment.</CardDescription>
                </div>
                 {isAdmin && (
                    <Dialog>
                      <DialogTrigger asChild>
                         <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4"/>Add Snippet</Button>
                      </DialogTrigger>
                      <SnippetForm onFormSubmit={handleAddSnippet}/>
                    </Dialog>
                 )}
              </CardHeader>
              <CardContent className="space-y-4">
                {optimisticLab.codes && optimisticLab.codes.length > 0 ? (
                  optimisticLab.codes.map(snippet => (
                    <div key={snippet.id} className="relative group animate-fade-in-up">
                       <CodeBlock language={snippet.language} code={snippet.code} description={snippet.description} />
                       {isAdmin && (
                        <div className="absolute top-2 right-12 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="icon" className="h-7 w-7"><Pencil className="h-4 w-4"/></Button>
                                </DialogTrigger>
                                <SnippetForm
                                    snippet={snippet}
                                    onFormSubmit={(formData) => handleUpdateSnippet(snippet.id, formData)}
                                />
                            </Dialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="icon" className="h-7 w-7"><Trash2 className="h-4 w-4"/></Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the code snippet.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteSnippet(snippet.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                        </div>
                       )}
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No code snippets available.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="links" className="mt-4 animate-fade-in">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                 <div>
                    <CardTitle>Associated Links & Files</CardTitle>
                    <CardDescription>Documentation, data files, and other relevant resources.</CardDescription>
                 </div>
                 {isAdmin && (
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline"><UploadCloud className="mr-2 h-4 w-4"/>Add Link</Button>
                        </DialogTrigger>
                        <LinkForm onFormSubmit={handleAddLink}/>
                    </Dialog>
                 )}
              </CardHeader>
              <CardContent className="space-y-2">
                 {optimisticLab.links && optimisticLab.links.length > 0 ? (
                  <ul className="divide-y divide-border">
                    {optimisticLab.links.map(link => (
                      <li key={link.id} className="flex items-center justify-between py-2 group animate-fade-in-up">
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{link.name}</a>
                         {isAdmin && (
                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="icon" className="h-7 w-7"><Pencil className="h-4 w-4"/></Button>
                                    </DialogTrigger>
                                    <LinkForm
                                        link={link}
                                        onFormSubmit={(formData) => handleUpdateLink(link.id, formData)}
                                    />
                                </Dialog>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="icon" className="h-7 w-7"><Trash2 className="h-4 w-4"/></Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete this link.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDeleteLink(link.id)}>Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                            </div>
                         )}
                      </li>
                    ))}
                  </ul>
                 ) : (
                    <p className="text-muted-foreground text-sm">No links available.</p>
                 )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}


function SnippetForm({ snippet, onFormSubmit }: { snippet?: LabCodeSnippet, onFormSubmit: (formData: FormData) => void }) {
    const formRef = React.useRef<HTMLFormElement>(null);
    const closeButtonRef = React.useRef<HTMLButtonElement>(null);
    const isEditing = !!snippet;

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        onFormSubmit(formData);
        if (!isEditing) {
            formRef.current?.reset();
        }
        closeButtonRef.current?.click();
    };

    return (
        <DialogContent>
            <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit' : 'Add New'} Code Snippet</DialogTitle>
            <DialogDescription>
                {isEditing ? 'Update the details for this code snippet.' : 'Provide the details for the new code snippet.'}
            </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} ref={formRef} className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Input id="language" name="language" defaultValue={snippet?.language || "bash"} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" name="description" defaultValue={snippet?.description || ''} placeholder="e.g., Boilerplate setup" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="code">Code</Label>
                    <Textarea id="code" name="code" defaultValue={snippet?.code || ''} rows={10} required />
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary" ref={closeButtonRef}>Cancel</Button>
                    </DialogClose>
                    <Button type="submit" className="animate-button-pop">{isEditing ? 'Save Changes' : 'Add Snippet'}</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    );
}

function LinkForm({ link, onFormSubmit }: { link?: LabLink, onFormSubmit: (formData: FormData) => void }) {
    const formRef = React.useRef<HTMLFormElement>(null);
    const closeButtonRef = React.useRef<HTMLButtonElement>(null);
    const isEditing = !!link;

     const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        onFormSubmit(formData);
        if (!isEditing) {
            formRef.current?.reset();
        }
        closeButtonRef.current?.click();
    };

    return (
        <DialogContent>
            <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit' : 'Add New'} Link</DialogTitle>
            <DialogDescription>
                {isEditing ? 'Update the name and URL for this link.' : 'Provide the name and URL for the new link.'}
            </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} ref={formRef} className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" defaultValue={link?.name || ''} placeholder="e.g., Official Docs" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="url">URL</Label>
                    <Input id="url" name="url" type="url" defaultValue={link?.url || ''} placeholder="https://..." required />
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary" ref={closeButtonRef}>Cancel</Button>
                    </DialogClose>
                    <Button type="submit" className="animate-button-pop">{isEditing ? 'Save Changes' : 'Add Link'}</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    );
}
