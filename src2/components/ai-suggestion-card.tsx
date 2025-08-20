
'use client';

import { useState, useEffect, useTransition } from 'react';
import { suggestCodeSnippets } from '@/ai/flows/suggest-code-snippets';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CodeBlock } from './code-block';
import { Button } from './ui/button';
import { Wand2, AlertTriangle, PlusCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface AISuggestionCardProps {
  labStatus: string;
  relevantCodes: string;
}

export function AISuggestionCard({ labStatus, relevantCodes }: AISuggestionCardProps) {
  const [loading, setLoading] = useState(true);
  const [suggestion, setSuggestion] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function getSuggestion() {
      setLoading(true);
      setError(null);
      try {
        const result = await suggestCodeSnippets({ labStatus, relevantCodes });
        setSuggestion(result);
      } catch (e) {
        setError('Failed to get AI suggestion. Please try again.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    getSuggestion();
  }, [labStatus, relevantCodes]);

  const handleAddToSnippets = () => {
      startTransition(async () => {
          // In a real app, you would call an action here to add the snippet.
          // For now, we'll just simulate it.
          await new Promise(resolve => setTimeout(resolve, 1000));
      });
  }
  
  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      );
    }

    if (error) {
        return (
            <Alert variant="destructive" className="animate-fade-in">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }
    
    if (suggestion && suggestion.isRelevant) {
      return (
        <div className="space-y-4 animate-fade-in">
            <p className="text-sm text-muted-foreground">{suggestion.reasoning}</p>
            <CodeBlock language="bash" code={suggestion.suggestedCode} description="AI Suggested Snippet" />
        </div>
      );
    }
    
    return (
        <p className="text-sm text-muted-foreground animate-fade-in">{suggestion?.reasoning || "No relevant suggestion found for the current status."}</p>
    );
  };

  return (
    <Card className="bg-card-gradient">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Wand2 className="mr-2 h-5 w-5 text-primary" />
          AI Code Suggestion
        </CardTitle>
        <CardDescription>Based on the new status &quot;{labStatus}&quot;, here is a suggested code snippet.</CardDescription>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
      {suggestion && suggestion.isRelevant && !loading && !error && (
        <CardFooter className="animate-fade-in">
            <Button variant="outline" onClick={handleAddToSnippets} disabled={isPending}>
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                Add to Snippets
            </Button>
        </CardFooter>
      )}
    </Card>
  );
}
