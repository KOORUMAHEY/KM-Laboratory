'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CodeBlockProps {
  language: string;
  code: string;
  description?: string;
}

export function CodeBlock({ language, code, description }: CodeBlockProps) {
  const [hasCopied, setHasCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="space-y-2">
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      <div className="relative rounded-md border bg-muted/30">
        <div className="absolute top-2 right-2 flex items-center space-x-2">
          <Badge variant="secondary" className="select-none font-code">{language}</Badge>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCopy}>
            {hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <pre className="p-4 overflow-x-auto text-sm font-code">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
