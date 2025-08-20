
export type LabStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Stuck';
export type LabDifficulty = 'Easy' | 'Medium' | 'Hard';

export type LabCategory = {
  id: string; // e.g., 'wtcn', 'cpp'
  title: string;
  description: string | null;
  icon: string | null; // lucide-react icon name
};

export type LabCodeSnippet = {
  id: string;
  experimentId: string;
  language: string;
  code: string;
  description: string | null;
}

export type LabLink = {
  id: string;
  experimentId: string;
  name: string;
  url: string;
}

export type LabExperiment = {
  id: string; // e.g., 'cpp-01', 'wtcn-01'
  categoryId: string;
  title: string;
  description: string | null;
  status: LabStatus;
  difficulty: LabDifficulty;
  duration: string; // e.g., '1 hr', '30 mins'
  createdAt: Date;
  updatedAt: Date;
  codes?: LabCodeSnippet[];
  links?: LabLink[];
};
