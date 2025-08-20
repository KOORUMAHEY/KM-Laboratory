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
  'Not Started': { 
    icon: PencilRuler, 
    className: 'bg-slate-50/60 text-slate-600 border-slate-100/60 hover:bg-slate-100/60 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800 dark:hover:bg-slate-800' 
  },
  'In Progress': { 
    icon: Zap, 
    className: 'bg-blue-50/60 text-blue-600 border-blue-100/60 hover:bg-blue-100/60 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-900 dark:hover:bg-blue-900' 
  },
  Completed: { 
    icon: CheckCircle2, 
    className: 'bg-green-50/60 text-green-600 border-green-100/60 hover:bg-green-100/60 dark:bg-green-950 dark:text-green-400 dark:border-green-900 dark:hover:bg-green-900' 
  },
  Stuck: { 
    icon: AlertTriangle, 
    className: 'bg-red-50/60 text-red-600 border-red-100/60 hover:bg-red-100/60 dark:bg-red-950 dark:text-red-400 dark:border-red-900 dark:hover:bg-red-900' 
  },
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
             <Badge className={cn('font-semibold', className)}>
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