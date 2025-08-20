import { getLabCategoryById, getLabExperiments } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import { LabExperimentCard } from '@/components/lab-card';

type CategoryPageProps = {
  params: Promise<{ id: string }>; // Update type to reflect params as a Promise
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params; // Await params to access id
  const category = await getLabCategoryById(id);
  const experiments = await getLabExperiments(id);

  if (!category) {
    notFound();
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex items-start justify-between">
        <div>
          <Link href="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Categories
            </Button>
          </Link>
          <h1 className="text-3xl font-bold font-headline tracking-tight">{category.title}</h1>
          <p className="mt-2 text-muted-foreground">{category.description}</p>
        </div>
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
          <Button className="mt-4" disabled>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Experiment
          </Button>
        </div>
      )}
    </div>
  );
}