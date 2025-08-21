import { getLabExperimentById } from '@/lib/data';
import { LabDetailView } from '@/components/lab-detail-view';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button'; // For styling the Link
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils'; // For combining class names

// CHANGE 2: Use the standard Next.js type for page params.
type LabPageProps = {
  params: { id: string };
};

export default async function LabPage({ params }: LabPageProps) {
  // Now we can access id directly without `await`.
  const { id } = params;
  const lab = await getLabExperimentById(id);

  if (!lab) {
    notFound(); // Correctly handles the 404 case.
  }

  return (
    // CHANGE 1: Add the standard container for consistent page layout and spacing.
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="space-y-6 animate-fade-in-up">
        {/* CHANGE 3: Use a Link styled as a button for better semantics. */}
        <Link 
          href={`/category/${lab.categoryId}`}
          className={cn(buttonVariants({ variant: 'outline' }), "inline-flex items-center")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Experiments
        </Link>
        
        {/* The client component receives the server-fetched data to render the UI. */}
        <LabDetailView initialLab={lab} />
      </div>
    </div>
  );
}