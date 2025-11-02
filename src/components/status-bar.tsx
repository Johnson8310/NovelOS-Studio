"use client";

import React, { useMemo, useState, useEffect } from 'react';
import type { Chapter } from '@/lib/types';
import { Separator } from './ui/separator';
import { Lightbulb, Quote } from 'lucide-react';
import { Button } from './ui/button';
import PromptGeneratorDialog from './prompt-generator-dialog';

interface StatusBarProps {
  chapter: Chapter | undefined;
  totalWordCount: number;
}

const quotes = [
    "The first draft is just you telling yourself the story.",
    "You don’t start out writing good stuff. You start out writing crap and thinking it’s good stuff, and then gradually you get better at it.",
    "Start writing, no matter what. The water does not flow until the faucet is turned on.",
    "Every writer I know has trouble writing.",
];

export default function StatusBar({ chapter, totalWordCount }: StatusBarProps) {
  const [isPromptDialogOpen, setIsPromptDialogOpen] = useState(false);
  const [currentQuote, setCurrentQuote] = useState("");

  useEffect(() => {
    setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  const chapterWordCount = useMemo(() => {
    if (!chapter?.content) return 0;
    const text = new DOMParser().parseFromString(chapter.content, 'text/html').body.textContent || '';
    return text.trim().split(/\s+/).filter(Boolean).length;
  }, [chapter?.content]);

  return (
    <>
      <footer className="p-2 border-t text-sm text-muted-foreground flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <span>Chapter Words: {chapterWordCount}</span>
          <Separator orientation="vertical" className="h-4" />
          <span>Total Words: {totalWordCount}</span>
        </div>
        <div className="flex-grow text-center italic hidden md:flex items-center justify-center gap-2">
            <Quote className="h-4 w-4" /> 
            <span>{currentQuote}</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setIsPromptDialogOpen(true)}>
            <Lightbulb className="mr-2 h-4 w-4" />
            Prompt Generator
          </Button>
        </div>
      </footer>
      <PromptGeneratorDialog open={isPromptDialogOpen} onOpenChange={setIsPromptDialogOpen} />
    </>
  );
}