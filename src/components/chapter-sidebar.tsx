"use client";

import React, { useState } from 'react';
import type { Chapter } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarMenuAction
} from '@/components/ui/sidebar';
import { PlusCircle, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Input } from './ui/input';

interface ChapterSidebarProps {
  chapters: Chapter[];
  activeChapterId: string | null;
  onSelectChapter: (id: string) => void;
  onAddChapter: () => void;
  onDeleteChapter: (id: string) => void;
  onReorderChapter: (id: string, direction: 'up' | 'down') => void;
  onUpdateChapterTitle: (id: string, title: string) => void;
}

export default function ChapterSidebar({
  chapters,
  activeChapterId,
  onSelectChapter,
  onAddChapter,
  onDeleteChapter,
  onReorderChapter,
  onUpdateChapterTitle,
}: ChapterSidebarProps) {
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const handleTitleDoubleClick = (chapter: Chapter) => {
    setEditingChapterId(chapter.id);
    setEditingTitle(chapter.title);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    if (editingChapterId && editingTitle.trim()) {
      onUpdateChapterTitle(editingChapterId, editingTitle.trim());
    }
    setEditingChapterId(null);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleBlur();
    } else if (e.key === 'Escape') {
      setEditingChapterId(null);
    }
  };


  return (
    <>
      <SidebarHeader>
        <h2 className="text-lg font-headline font-semibold">Manuscript</h2>
      </SidebarHeader>
      <ScrollArea className="flex-grow">
        <SidebarContent>
          <SidebarMenu>
            {chapters.map((chapter, index) => (
              <SidebarMenuItem key={chapter.id} className="group/menu-item relative">
                <div className="flex items-center w-full">
                  <SidebarMenuButton
                    onClick={() => onSelectChapter(chapter.id)}
                    isActive={chapter.id === activeChapterId}
                    className="flex-grow justify-start"
                    onDoubleClick={() => handleTitleDoubleClick(chapter)}
                    tooltip={{children: chapter.title, side: 'right'}}
                  >
                  {editingChapterId === chapter.id ? (
                      <Input
                        value={editingTitle}
                        onChange={handleTitleChange}
                        onBlur={handleTitleBlur}
                        onKeyDown={handleTitleKeyDown}
                        autoFocus
                        className="h-6 text-sm bg-transparent border-primary"
                      />
                    ) : (
                      <span>{chapter.title}</span>
                    )}
                  </SidebarMenuButton>
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center opacity-0 group-hover/menu-item:opacity-100 transition-opacity">
                     <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onReorderChapter(chapter.id, 'up')} disabled={index === 0}>
                        <ArrowUp className="h-4 w-4" />
                     </Button>
                     <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onReorderChapter(chapter.id, 'down')} disabled={index === chapters.length-1}>
                        <ArrowDown className="h-4 w-4" />
                     </Button>
                     <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => onDeleteChapter(chapter.id)} disabled={chapters.length <= 1}>
                        <Trash2 className="h-4 w-4" />
                     </Button>
                  </div>
                </div>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </ScrollArea>
      <SidebarFooter>
        <Button variant="ghost" onClick={onAddChapter} className="w-full justify-start">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Chapter
        </Button>
      </SidebarFooter>
    </>
  );
}