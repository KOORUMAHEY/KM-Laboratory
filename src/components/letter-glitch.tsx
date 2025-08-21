
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface LetterGlitchProps extends React.HTMLAttributes<HTMLHeadingElement> {
  text: string;
}

export const LetterGlitch: React.FC<LetterGlitchProps> = ({ className, text, ...props }) => {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<NodeJS.Timeout>();

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  useEffect(() => {
    const scramble = () => {
      let iteration = 0;
      clearInterval(intervalRef.current as NodeJS.Timeout);

      intervalRef.current = setInterval(() => {
        setDisplayText(
          text
            .split('')
            .map((_letter, index) => {
              if (index < iteration) {
                return text[index];
              }
              return letters[Math.floor(Math.random() * 26)];
            })
            .join('')
        );

        if (iteration >= text.length) {
          clearInterval(intervalRef.current as NodeJS.Timeout);
        }
        iteration += 1 / 3;
      }, 30);
    };

    scramble();

    return () => {
      clearInterval(intervalRef.current as NodeJS.Timeout);
    };
  }, [text]);

  return (
    <h1 className={cn('font-headline tracking-tight', className)} {...props}>
      {displayText}
    </h1>
  );
};

LetterGlitch.displayName = 'LetterGlitch';
