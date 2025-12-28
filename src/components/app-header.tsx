"use client";

import React from 'react';
import { SidebarTrigger } from './ui/sidebar';
import { Flame, Check } from 'lucide-react';
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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import htmlToDocx from 'html-to-docx';
import { saveAs } from 'file-saver';
import { fonts } from '@/lib/fonts';


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

    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = combinedContent;
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.width = '800px'; // A reasonable width for rendering
    tempContainer.style.padding = '20px';
    tempContainer.style.fontFamily = fonts.find(f => f.id === writingFont)?.name || 'Literata';
    
    document.body.appendChild(tempContainer);


    try {
        if (format === 'pdf') {
            const canvas = await html2canvas(tempContainer, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const ratio = canvasWidth / canvasHeight;
            const width = pdfWidth;
            const height = width / ratio;

            let position = 0;
            let pageHeight = pdf.internal.pageSize.height;
            let heightLeft = height;

            pdf.addImage(imgData, 'PNG', 0, position, width, height);
            heightLeft -= pageHeight;

            while (heightLeft > 0) {
                position = heightLeft - height;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, width, height);
                heightLeft -= pageHeight;
            }
            
            pdf.save("novel.pdf");

        } else if (format === 'docx') {
             const fileBuffer = await htmlToDocx(combinedContent, undefined, {
                font: fonts.find(f => f.id === writingFont)?.name || 'Literata',
                fontSize: 12,
             });
             saveAs(fileBuffer as Blob, 'novel.docx');

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
    } finally {
        document.body.removeChild(tempContainer);
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
    