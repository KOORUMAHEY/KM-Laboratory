import { getLabExperimentById } from '@/lib/data';
import { LabDetailView } from '@/components/lab-detail-view';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

type LabPageProps = {
  params: Promise<{ id: string }>; // Update type to reflect params as a Promise
};

export default async function LabPage({ params }: LabPageProps) {
  const { id } = await params; // Await params to access id
  const lab = await getLabExperimentById(id);

  if (!lab) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Link href={`/category/${lab.categoryId}`}>
        <Button variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Experiments
        </Button>
      </Link>
      <LabDetailView initialLab={lab} />
    </div>
  );
}