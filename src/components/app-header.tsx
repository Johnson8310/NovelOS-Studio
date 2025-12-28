"use client";

import React from 'react';
import { SidebarTrigger } from './ui/sidebar';
import { Flame } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import type { Chapter, TemplateType, WritingFont } from '@/lib/types';
import { saveAs } from 'file-saver';
import { fonts } from '@/lib/fonts';
import { generatePdf } from '@/lib/pdf-export';
import { generateDocx } from '@/app/actions/export';


interface AppHeaderProps {
  onSelectTemplate: (template: TemplateType) => void;
  chapters: Chapter[];
  writingFont: WritingFont;
  onFontChange: (font: WritingFont) => void;
}

export default function AppHeader({ onSelectTemplate, chapters, writingFont, onFontChange }: AppHeaderProps) {
  const { toast } = useToast();

  const handleComingSoon = () => {
    toast({
      title: "Feature Coming Soon",
      description: "This feature is not yet available.",
    });
  };

  const handleExport = async (format: 'pdf' | 'epub' | 'docx') => {
    toast({
      title: `Exporting to ${format.toUpperCase()}`,
      description: `Your novel is being prepared for export...`,
    });

    const combinedContent = chapters.map(chapter => 
        `<h1>${chapter.title}</h1><div>${chapter.content}</div>`
    ).join('<hr>');
    
    const fontName = fonts.find(f => f.id === writingFont)?.name || 'Literata';


    try {
        if (format === 'pdf') {
            await generatePdf(combinedContent, fontName);
        } else if (format === 'docx') {
             const fileBuffer = await generateDocx(combinedContent, fontName);
             const blob = new Blob([fileBuffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
             saveAs(blob, 'novel.docx');

        } else if (format === 'epub') {
            handleComingSoon();
            return;
        }

        toast({
            title: "Export Complete",
            description: `Your novel has been exported to ${format.toUpperCase()}.`,
        });

    } catch (error) {
        console.error("Export failed:", error);
        toast({
            variant: "destructive",
            title: "Export Failed",
            description: "An error occurred while exporting your novel.",
        });
    }
  };

  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <h1 className="text-xl font-headline font-bold text-foreground">NovelOS Studio</h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-sm text-amber-500 font-medium">
            <Flame className="h-5 w-5" />
            <span>3-day streak</span>
        </div>
        
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">Font</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuRadioGroup value={writingFont} onValueChange={(value) => onFontChange(value as WritingFont)}>
                    {fonts.map((font) => (
                        <DropdownMenuRadioItem key={font.id} value={font.id}>
                            {font.name}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">File</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Templates</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onSelectTemplate('novel')}>Novel</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSelectTemplate('memoir')}>Memoir</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSelectTemplate('poetry')}>Poetry</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Styles</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleComingSoon}>Apply Custom Style</DropdownMenuItem>
            <DropdownMenuItem onClick={handleComingSoon}>Save Current Style</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Export</DropdownMenuLabel>
             <DropdownMenuItem onClick={() => handleExport('pdf')}>Export to PDF</DropdownMenuItem>
             <DropdownMenuItem onClick={() => handleExport('epub')}>Export to ePub</DropdownMenuItem>
             <DropdownMenuItem onClick={() => handleExport('docx')}>Export to DOCX</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}