
import type { LabCategory, LabExperiment, LabCodeSnippet, LabLink } from './types';

export const labCategories: LabCategory[] = [
  {
    id: 'wtcn',
    title: 'Web Tech & CN',
    description: 'Experiments related to web technologies and computer networks.',
    icon: 'Globe2',
  },
  {
    id: 'cpp',
    title: 'C++ Lab',
    description: 'Core and advanced C++ programming assignments.',
    icon: 'FileCode',
  },
  {
    id: 'ds',
    title: 'Data Structures',
    description: 'Labs focused on fundamental data structures.',
    icon: 'Binary',
  },
];

export const experiments: Omit<LabExperiment, 'codes' | 'links'>[] = [
  {
    id: 'wtcn-01',
    categoryId: 'wtcn',
    title: 'Static Website Hosting',
    description: 'Deploy a simple HTML/CSS static website.',
    status: 'Completed',
    difficulty: 'Easy',
    duration: '1 hr',
    createdAt: new Date('2024-01-10T09:00:00Z'),
    updatedAt: new Date('2024-01-10T10:00:00Z'),
  },
  {
    id: 'cpp-01',
    categoryId: 'cpp',
    title: 'Armstrong Number',
    description: 'Write a C++ program to check if a number is an Armstrong number.',
    status: 'In Progress',
    difficulty: 'Medium',
    duration: '2 hr',
    createdAt: new Date('2024-02-15T14:00:00Z'),
    updatedAt: new Date('2024-02-15T15:30:00Z'),
  },
  {
    id: 'ds-01',
    categoryId: 'ds',
    title: 'Implement a Linked List',
    description: 'Create a singly linked list with basic operations (add, remove, find).',
    status: 'Not Started',
    difficulty: 'Medium',
    duration: '3 hr',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
   {
    id: 'wtcn-02',
    categoryId: 'wtcn',
    title: 'Simple REST API',
    description: 'Build a simple REST API with Node.js and Express.',
    status: 'Not Started',
    difficulty: 'Hard',
    duration: '4 hr',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const codeSnippets: LabCodeSnippet[] = [
    {
        id: 'wtcn-01-html',
        experimentId: 'wtcn-01',
        language: 'html',
        code: `<!DOCTYPE html>
<html>
<head>
    <title>My Static Site</title>
</head>
<body>
    <h1>Welcome!</h1>
</body>
</html>`,
        description: 'Basic HTML structure.'
    },
    {
        id: 'cpp-01-code',
        experimentId: 'cpp-01',
        language: 'cpp',
        code: `#include <iostream>
#include <cmath>

int main() {
    // ... implementation
    return 0;
}`,
        description: 'C++ boilerplate for the program.'
    }
];

export const links: LabLink[] = [];
