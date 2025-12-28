"use client";

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface NotesSectionProps {
    notes: Record<string, string>;
    onNotesChange: (section: string, content: string) => void;
}

export default function NotesSection({ notes, onNotesChange }: NotesSectionProps) {
  return (
    <Card className="max-w-4xl mx-auto w-full">
        <CardHeader>
            <CardTitle>World-Building & Notes</CardTitle>
        </CardHeader>
        <CardContent>
            <Accordion type="multiple" defaultValue={['characters', 'locations', 'plotPoints']} className="w-full">
                <AccordionItem value="characters">
                    <AccordionTrigger>Characters</AccordionTrigger>
                    <AccordionContent>
                    <Textarea
                        placeholder="Flesh out your characters, their backstories, motivations, and relationships..."
                        value={notes.characters}
                        onChange={(e) => onNotesChange('characters', e.target.value)}
                        className="min-h-[200px] text-base"
                    />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="locations">
                    <AccordionTrigger>Locations</AccordionTrigger>
                    <AccordionContent>
                    <Textarea
                        placeholder="Describe the cities, landscapes, and rooms where your story unfolds..."
                        value={notes.locations}
                        onChange={(e) => onNotesChange('locations', e.target.value)}
                        className="min-h-[200px] text-base"
                    />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="plotPoints">
                    <AccordionTrigger>Plot Points</AccordionTrigger>
                    <AccordionContent>
                    <Textarea
                        placeholder="Outline key plot points, twists, and the overall story arc..."
                        value={notes.plotPoints}
                        onChange={(e) => onNotesChange('plotPoints', e.target.value)}
                        className="min-h-[200px] text-base"
                    />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </CardContent>
    </Card>
  );
}
