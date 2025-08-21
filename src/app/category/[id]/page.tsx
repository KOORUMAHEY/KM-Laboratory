import { getLabCategoryById, getLabExperiments } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button'; // For styling a Link as a button
import { ArrowLeft, PlusCircle } from 'lucide-react';
import { LabExperimentCard } from '@/components/lab-card';
import { cn } from '@/lib/utils';

// CHANGE 3: Use the standard Next.js type for page params.
type CategoryPageProps = {
  params: { id: string };
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = params;

  // CHANGE 1: Fetch category and experiments in parallel for better performance.
  // This can significantly reduce the waterfall effect and speed up load times.
  const [category, experiments] = await Promise.all([
    getLabCategoryById(id),
    getLabExperiments(id),
  ]);

  if (!category) {
    notFound(); // This is perfect, correctly throws a 404.
  }

  return (
    // CHANGE 2: Add the standard container for consistent page layout.
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="space-y-8 animate-fade-in-up">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div>
            {/* CHANGE 4: Use a Link styled as a button for better accessibility & semantics. */}
            <Link 
              href="/" 
              className={cn(buttonVariants({ variant: 'outline' }), "mb-4")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Categories
            </Link>
            <h1 className="text-3xl font-bold font-headline tracking-tight">{category.title}</h1>
            <p className="mt-2 text-muted-foreground max-w-2xl">{category.description}</p>
          </div>
          {/* A potential spot for an "Add Experiment" button that's always visible */}
          {experiments.length > 0 && (
             <Link 
                href={`/admin/new-experiment?categoryId=${category.id}`} 
                className={buttonVariants({ variant: 'default' })}
             >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Experiment
            </Link>
          )}
        </div>

        {experiments.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {experiments.map((exp, index) => (
              <LabExperimentCard key={exp.id} lab={exp} animationDelay={index * 100} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/50 p-12 text-center animate-fade-in">
            <h3 className="text-xl font-medium font-headline">No Experiments Found</h3>
            <p className="mt-2 text-sm text-muted-foreground">Get started by adding a new experiment to this category.</p>
            {/* Make this link functional instead of disabled */}
            <Link 
              href={`/admin/new-experiment?categoryId=${category.id}`} 
              className={cn(buttonVariants({ variant: 'default' }), 'mt-4')}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Experiment
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}