
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Beaker, LogOut, ShieldCheck, User, Home, Menu } from 'lucide-react';
import { useAdmin } from '@/hooks/use-admin';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';


export function Header() {
  const { isAdmin, login, logout } = useAdmin();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const handleTitleClick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    // Prevent text selection on double/triple click
    if (e.detail > 1) {
      e.preventDefault();
    }
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);

    if (newClickCount >= 3) {
      setOpen(true);
      setClickCount(0); // Reset after opening
    }
  };


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      toast({
        title: 'Admin Mode Enabled',
        description: 'You can now edit page content.',
      });
      setOpen(false);
      setPassword('');
    } else {
      toast({
        title: 'Login Failed',
        description: 'The password you entered is incorrect.',
        variant: 'destructive',
      });
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: 'Admin Mode Disabled',
      description: 'You are now in standard user mode.',
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="grid gap-6 text-lg font-medium mt-8">
                <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                  <Beaker className="h-6 w-6" />
                  <span>Home</span>
                </Link>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  About
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="flex w-full items-center justify-center md:justify-center relative">
            <Dialog open={open} onOpenChange={setOpen}>
              <div className="absolute left-0 flex items-center space-x-2 md:hidden">
                 <Link href="/" className="flex items-center space-x-2 group">
                    <Beaker className="h-6 w-6 text-primary transition-transform duration-300 group-hover:rotate-12" />
                 </Link>
              </div>
              <div className="flex items-center space-x-2">
                 <Link href="/" className="flex items-center space-x-2 group">
                    <Beaker className="h-6 w-6 text-primary transition-transform duration-300 group-hover:rotate-12 hidden md:flex" />
                    <span 
                      className="font-bold font-headline sm:inline-block cursor-pointer" 
                      onClick={handleTitleClick}
                    >
                      Lab Status Central
                    </span>
                 </Link>
              </div>
              {!isAdmin && (
                  <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleLogin}>
                      <DialogHeader>
                        <DialogTitle>Admin Access</DialogTitle>
                        <DialogDescription>
                          Enter the password to enable admin mode. This will allow you to edit content.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="password-input" className="text-right">
                            Password
                          </Label>
                          <Input
                            id="password-input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="col-span-3"
                            autoFocus
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Login</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
              )}
            </Dialog>
        </div>

        <div className="flex items-center justify-end space-x-2 ml-auto">
            <nav className="hidden md:flex items-center space-x-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" asChild className="group">
                      <Link href="/">
                        <Home className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                        <span className="sr-only">Home</span>
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Home</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" asChild className="group">
                      <Link href="/about">
                        <User className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                        <span className="sr-only">About</span>
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>About</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </nav>
          <ThemeToggle />
          {isAdmin && (
            <>
              <Badge variant="outline" className={cn("hidden sm:flex border-primary/50 text-primary", isAdmin && "admin-pulse")}>
                <ShieldCheck className="mr-2 h-4 w-4" />
                Admin Mode
              </Badge>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4"/>
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
