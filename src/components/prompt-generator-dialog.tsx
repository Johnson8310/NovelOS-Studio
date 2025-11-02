"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from "@/hooks/use-toast";
import { generatePrompt } from '@/ai/flows/ai-prompt-generator';
import { Loader2 } from 'lucide-react';

interface PromptGeneratorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PromptGeneratorDialog({ open, onOpenChange }: PromptGeneratorDialogProps) {
    const [genre, setGenre] = useState('Fantasy');
    const [theme, setTheme] = useState('Betrayal');
    const [keywords, setKeywords] = useState('magic, ancient ruins, lost artifact');
    const [generatedPrompt, setGeneratedPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleGenerate = async () => {
        setIsLoading(true);
        setGeneratedPrompt('');
        try {
            const result = await generatePrompt({ genre, theme, keywords });
            if (result.prompt) {
                setGeneratedPrompt(result.prompt);
            } else {
                 toast({
                    variant: "destructive",
                    title: "Prompt Generation Failed",
                    description: "Could not get a response from the AI.",
                });
            }
        } catch (error) {
            console.error("Prompt generation failed:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "An error occurred during prompt generation.",
            });
        } finally {
            setIsLoading(false);
        }
    }


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>AI Prompt Generator</DialogTitle>
          <DialogDescription>
            Spark your creativity with a custom writing prompt.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="genre">Genre</Label>
                <Input id="genre" value={genre} onChange={(e) => setGenre(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Input id="theme" value={theme} onChange={(e) => setTheme(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="keywords">Keywords</Label>
                <Input id="keywords" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="e.g., magic, ancient ruins"/>
            </div>
        </div>

        {isLoading && (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )}
        
        {generatedPrompt && (
            <div className="p-4 bg-muted rounded-md border">
                <p className="text-sm text-foreground">{generatedPrompt}</p>
            </div>
        )}

        <DialogFooter>
          <Button onClick={handleGenerate} disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Prompt'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}