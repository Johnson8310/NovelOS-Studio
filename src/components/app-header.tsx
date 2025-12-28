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
} from "@/components/ui/dropdown-menu"
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import type { Chapter } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AppHeader() {
  const { toast } = useToast();

  const handleComingSoon = () => {
    toast({
      title: "Feature Coming Soon",
      description: "This feature is not yet available.",
    });
  };

  const handleExport = (format: 'pdf' | 'epub' | 'docx') => {
    toast({
      title: `Exporting to ${format.toUpperCase()}`,
      description: `Your novel is being prepared for export. This is a mock action.`,
    });
    // In a real app, you would generate the file here.
  };

  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <h1 className="text-xl font-headline font-bold text-foreground">NovelOS Studio</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-amber-500 font-medium">
            <Flame className="h-5 w-5" />
            <span>3-day streak</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">File</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Templates</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleComingSoon}>Novel</DropdownMenuItem>
            <DropdownMenuItem onClick={handleComingSoon}>Memoir</DropdownMenuItem>
            <DropdownMenuItem onClick={handleComingSoon}>Poetry</DropdownMenuItem>
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
    