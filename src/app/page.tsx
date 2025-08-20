
import { getLabCategories } from '@/lib/data';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowRight, BookOpenCheck } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { LetterGlitch } from '@/components/letter-glitch';

export default async function Home() {
  const categories = await getLabCategories();

  return (
    <>

    <div className="space-y-8 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <LetterGlitch text="Lab Experiment Dashboard" className="text-3xl font-bold" />
      </div>

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category, index) => {
            // @ts-ignore
            const Icon = (category.icon && LucideIcons[category.icon]) ? LucideIcons[category.icon] : BookOpenCheck;
            return (
              <Link key={category.id} href={`/category/${category.id}`} className="group block animate-fade-in-up" style={{ animationDelay: `${index * 100}ms`}}>
                <Card className="h-full transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 flex flex-col">
                  <CardHeader className="flex-grow">
                     <div className="flex items-start justify-between">
                        <div className="flex flex-col space-y-1.5">
                           <div className="p-2 bg-muted rounded-md w-fit">
                             <Icon className="h-6 w-6 text-primary" />
                           </div>
                           <CardTitle className="font-headline text-lg pt-4">{category.title}</CardTitle>
                        </div>
                       <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </div>
                    <CardDescription className="line-clamp-2 pt-1">{category.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/50 p-12 text-center animate-fade-in">
          <h3 className="text-xl font-medium font-headline">No Lab Categories Found</h3>
          <p className="mt-2 text-sm text-muted-foreground">Your lab categories will appear here.</p>
        </div>
      )}
    </div>
    </>
  );

}
