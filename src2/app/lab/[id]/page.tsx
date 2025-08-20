
import { getLabExperimentById } from '@/lib/data';
import { LabDetailView } from '@/components/lab-detail-view';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

type LabPageProps = {
  params: {
    id: string;
  };
};

export default async function LabPage({ params }: LabPageProps) {
  const lab = await getLabExperimentById(params.id);

  if (!lab) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Link href={`/category/${lab.categoryId}`}>
        <Button variant="outline" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Experiments
        </Button>
      </Link>
      <LabDetailView initialLab={lab} />
    </div>
  );
}
