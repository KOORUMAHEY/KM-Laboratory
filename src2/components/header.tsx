
'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LogOut, ShieldCheck, Home, User, Loader2 } from 'lucide-react';
import { useAdmin } from '@/hooks/use-admin';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { LetterGlitch } from '@/components/letter-glitch';
import Logo from '@/assests/kmLogo.svg';


export function Header() {
  const { isAdmin, login, logout } = useAdmin();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [isPending, startTransition] = useTransition();

  const handleTitleClick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    if (e.detail > 1) {
      e.preventDefault();
    }
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);

    if (newClickCount >= 3) {
      setOpen(true);
      setClickCount(0);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
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
    });
  };

  const handleLogout = () => {
    startTransition(() => {
      logout();
      toast({
        title: 'Admin Mode Disabled',
        description: 'You are now in standard user mode.',
      });
    });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center px-4 sm:px-6 lg:px-8">
        {/* Left Section: Title and Nav */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative w-16 h-16">
              <Image
                src={Logo}
                alt="KM Logo"
                layout="fill"
                objectFit="contain"
                priority
                className="text-primary transition-transform duration-300 group-hover:scale-110"
              />
            </div>

            <span
              className="font-bold text-lg sm:text-xl font-headline cursor-pointer"
              onClick={handleTitleClick}
            >
              <LetterGlitch text="KM's Laboratory" />
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
          </nav>
        </div>

        {/* Mobile Navigation (Icons) */}
        <div className="flex md:hidden items-center space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/">
                    <Home className="h-5 w-5 text-muted-foreground" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Home</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/about">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>About</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Right Section: Actions */}
        <div className="flex flex-1 items-center justify-end space-x-3">
          <ThemeToggle />
          {isAdmin && (
            <>
              <Badge
                variant="outline"
                className={cn(
                  'hidden sm:flex border-primary/50 text-primary',
                  isAdmin && 'admin-pulse'
                )}
              >
                <ShieldCheck className="mr-2 h-4 w-4" />
                Admin Mode
              </Badge>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                      disabled={isPending}
                    >
                      {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4 sm:mr-2" />}
                      <span className="hidden sm:inline">Logout</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Logout</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}
        </div>

        {/* Admin Login Dialog */}
        {!isAdmin && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
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
                      disabled={isPending}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isPending}
                  >
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Login
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </header>
  );
}
