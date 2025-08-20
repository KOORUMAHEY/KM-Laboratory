
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const skills = ['React', 'Next.js', 'TypeScript', 'Node.js', 'Genkit', 'Tailwind CSS', 'Firebase', 'UI/UX Design'];

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8 animate-fade-in-up">
      <div className="space-y-12">
        
        <Card className="w-full overflow-hidden rounded-2xl bg-card/80 backdrop-blur-sm shadow-lg transition-all hover:shadow-2xl border-primary/20 hover:-translate-y-1 duration-300 animate-fade-in">
           <div className="relative h-48 w-full bg-gradient-to-r from-violet-200/50 via-pink-200/50 to-orange-200/50 dark:from-violet-900/50 dark:via-pink-900/50 dark:to-orange-900/50">
             <Image
                src="https://placehold.co/1200x300.png"
                alt="Abstract background banner"
                layout="fill"
                objectFit="cover"
                className="opacity-50"
                data-ai-hint="abstract banner"
              />
          </div>
          <div className="flex flex-col items-center p-8 -mt-24 sm:flex-row sm:items-end sm:space-x-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <Avatar className="h-32 w-32 border-4 border-background shadow-md">
                <AvatarImage src="https://placehold.co/200x200.png" alt="Developer Avatar" data-ai-hint="person portrait" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="mt-4 text-center sm:mt-0 sm:text-left">
                <h1 className="text-4xl font-bold font-headline text-primary">Kooru Mahey v</h1>
                <p className="mt-1 text-lg text-muted-foreground">Full-Stack Developer & AI Enthusiast</p>
              </div>
          </div>
          <CardContent className="space-y-8 px-8 pb-8 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
             <div className="prose max-w-none text-foreground dark:prose-invert prose-p:text-muted-foreground prose-headings:text-primary">
                <p>
                  Hello! I'm a passionate developer with a love for creating beautiful, functional, and user-centric web applications. With a strong foundation in modern web technologies and a keen eye for design, I enjoy turning complex problems into elegant solutions. My journey into the world of AI has been incredibly exciting, and I'm always exploring new ways to integrate intelligent features into my projects.
                </p>
                <p>
                  This Lab Status Central project is a demonstration of my skills in building full-stack applications with Next.js, managing state with React hooks, and integrating generative AI with Genkit.
                </p>
             </div>

             <div>
                <h3 className="text-xl font-bold font-headline text-primary mb-4">My Skills</h3>
                <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                        <Badge 
                          key={skill} 
                          variant="secondary" 
                          className="text-sm font-medium animate-fade-in"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          {skill}
                        </Badge>
                    ))}
                </div>
             </div>

             <div>
                <h3 className="text-xl font-bold font-headline text-primary mb-4">Connect With Me</h3>
                <div className="flex space-x-2">
                    <Button variant="outline" size="icon" asChild className="animate-button-pop">
                        <Link href="#"><Github className="h-5 w-5"/></Link>
                    </Button>
                    <Button variant="outline" size="icon" asChild className="animate-button-pop" style={{ animationDelay: '50ms' }}>
                        <Link href="#"><Linkedin className="h-5 w-5"/></Link>
                    </Button>
                    <Button variant="outline" size="icon" asChild className="animate-button-pop" style={{ animationDelay: '100ms' }}>
                        <Link href="#"><Twitter className="h-5 w-5"/></Link>
                    </Button>
                     <Button variant="outline" size="icon" asChild className="animate-button-pop" style={{ animationDelay: '150ms' }}>
                        <Link href="#"><Mail className="h-5 w-5"/></Link>
                    </Button>
                </div>
             </div>

          </CardContent>
        </Card>
        
      </div>
    </div>
  );
}
