
import Link from 'next/link';
import type { LabExperiment, LabStatus } from '@/data/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertTriangle, XCircle, Wrench, ArrowRight, Clock, Zap, PencilRuler } from 'lucide-react';

const statusConfig: Record<
  LabStatus,
  {
    icon: React.ElementType;
    className: string;
  }
> = {
  'Not Started': { icon: PencilRuler, className: 'border-slate-300/80 bg-slate-100 text-slate-600 dark:border-slate-700/80 dark:bg-slate-800/50 dark:text-slate-400' },
  'In Progress': { icon: Zap, className: 'border-blue-300/80 bg-blue-100 text-blue-600 dark:border-blue-700/80 dark:bg-blue-900/30 dark:text-blue-400' },
  Completed: { icon: CheckCircle2, className: 'border-green-300/80 bg-green-100 text-green-600 dark:border-green-700/80 dark:bg-green-900/30 dark:text-green-400' },
  Stuck: { icon: AlertTriangle, className: 'border-red-300/80 bg-red-100 text-red-600 dark:border-red-700/80 dark:bg-red-900/30 dark:text-red-400' },
};

export function LabExperimentCard({ lab, animationDelay }: { lab: LabExperiment, animationDelay?: number }) {
  const { icon: Icon, className } = statusConfig[lab.status];

  return (
    <Link href={`/lab/${lab.id}`} className="group block">
      <Card 
        className="h-full transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 flex flex-col animate-fade-in-up"
        style={{ animationDelay: `${animationDelay}ms` }}
      >
        <CardHeader className="flex-grow">
          <div className="flex items-center justify-between">
            <CardTitle className="font-headline text-lg">{lab.title}</CardTitle>
            <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </div>
          <CardDescription className="line-clamp-2 pt-1">{lab.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
             <Badge variant="outline" className={cn('font-semibold', className)}>
                <Icon className="mr-2 h-4 w-4" />
                {lab.status}
              </Badge>
          </div>
        </CardContent>
         <CardFooter className="flex justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
                <Clock className="h-3 w-3"/>
                <span>{lab.duration}</span>
            </div>
            <div className="flex items-center gap-1">
                <span>{lab.difficulty}</span>
            </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
