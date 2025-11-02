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

export default function AppHeader() {
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
            <DropdownMenuItem disabled>Novel</DropdownMenuItem>
            <DropdownMenuItem disabled>Memoir</DropdownMenuItem>
            <DropdownMenuItem disabled>Poetry</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Styles</DropdownMenuLabel>
            <DropdownMenuItem disabled>Apply Custom Style</DropdownMenuItem>
            <DropdownMenuItem disabled>Save Current Style</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Export</DropdownMenuLabel>
             <DropdownMenuItem disabled>Export to PDF</DropdownMenuItem>
             <DropdownMenuItem disabled>Export to ePub</DropdownMenuItem>
             <DropdownMenuItem disabled>Export to DOCX</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}