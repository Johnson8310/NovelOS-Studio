"use client";

import React, { useState, useEffect, useMemo } from 'react';
import type { Chapter } from '@/lib/types';
import { Sidebar, SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import ChapterSidebar from '@/components/chapter-sidebar';
import AppHeader from '@/components/app-header';
import Editor from '@/components/editor';
import StatusBar from '@/components/status-bar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CoverCreator from './cover-creator';
import { v4 as uuidv4 } from 'uuid';

const initialChapters: Chapter[] = [
  { id: '1', title: 'Chapter 1: The Beginning', content: '<h1>The Journey Begins</h1><p>It was a dark and stormy night... or maybe just a bit overcast. Either way, our story starts here. Write something amazing!</p>' },
  { id: '2', title: 'Chapter 2: The Plot Thickens', content: '<h1>Rising Action</h1><p>Suddenly, a mysterious stranger appeared.</p>' },
];

export default function NovelOSStudio() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('editor');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const savedChapters = localStorage.getItem('novelOS-chapters');
      const savedActiveChapterId = localStorage.getItem('novelOS-activeChapterId');
      
      if (savedChapters) {
        const parsedChapters: Chapter[] = JSON.parse(savedChapters);
        setChapters(parsedChapters);
        if (savedActiveChapterId && parsedChapters.some(c => c.id === savedActiveChapterId)) {
          setActiveChapterId(savedActiveChapterId);
        } else if (parsedChapters.length > 0) {
          setActiveChapterId(parsedChapters[0].id);
        }
      } else {
        setChapters(initialChapters);
        setActiveChapterId(initialChapters[0].id);
      }
    } catch (error) {
      console.error("Failed to load from localStorage", error);
      setChapters(initialChapters);
      setActiveChapterId(initialChapters[0].id);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem('novelOS-chapters', JSON.stringify(chapters));
        if (activeChapterId) {
          localStorage.setItem('novelOS-activeChapterId', activeChapterId);
        }
      } catch (error) {
        console.error("Failed to save to localStorage", error);
      }
    }
  }, [chapters, activeChapterId, isMounted]);

  const handleAddChapter = () => {
    const newChapter: Chapter = {
      id: uuidv4(),
      title: `Chapter ${chapters.length + 1}`,
      content: `<p>Start your new chapter here.</p>`,
    };
    setChapters([...chapters, newChapter]);
    setActiveChapterId(newChapter.id);
  };

  const handleDeleteChapter = (id: string) => {
    if (chapters.length <= 1) {
        // Prevent deleting the last chapter
        alert("You cannot delete the last chapter.");
        return;
    }
    const newChapters = chapters.filter((chapter) => chapter.id !== id);
    setChapters(newChapters);
    if (activeChapterId === id) {
      setActiveChapterId(newChapters.length > 0 ? newChapters[0].id : null);
    }
  };

  const handleUpdateChapter = (id: string, newContent: Partial<Chapter>) => {
    setChapters(
      chapters.map((chapter) =>
        chapter.id === id ? { ...chapter, ...newContent } : chapter
      )
    );
  };

  const handleReorderChapter = (id: string, direction: 'up' | 'down') => {
    const index = chapters.findIndex(c => c.id === id);
    if (index === -1) return;

    const newChapters = [...chapters];
    if (direction === 'up' && index > 0) {
      [newChapters[index - 1], newChapters[index]] = [newChapters[index], newChapters[index - 1]];
      setChapters(newChapters);
    } else if (direction === 'down' && index < chapters.length - 1) {
      [newChapters[index + 1], newChapters[index]] = [newChapters[index], newChapters[index + 1]];
      setChapters(newChapters);
    }
  };

  const activeChapter = useMemo(() => chapters.find(c => c.id === activeChapterId), [chapters, activeChapterId]);
  
  const totalWordCount = useMemo(() => 
    chapters.reduce((acc, chapter) => {
      const text = new DOMParser().parseFromString(chapter.content, 'text/html').body.textContent || '';
      return acc + (text.trim().split(/\s+/).filter(Boolean).length);
    }, 0), 
  [chapters]);

  if (!isMounted) {
    return null; // or a loading spinner
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <ChapterSidebar
          chapters={chapters}
          activeChapterId={activeChapterId}
          onSelectChapter={setActiveChapterId}
          onAddChapter={handleAddChapter}
          onDeleteChapter={handleDeleteChapter}
          onReorderChapter={handleReorderChapter}
          onUpdateChapterTitle={(id, title) => handleUpdateChapter(id, { title })}
        />
      </Sidebar>
      <SidebarInset className="flex flex-col h-screen">
        <AppHeader />
        <div className="flex-grow p-4 pt-0 flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col">
                <TabsList className="mb-4 self-start">
                    <TabsTrigger value="editor">Editor</TabsTrigger>
                    <TabsTrigger value="cover">Cover Creator</TabsTrigger>
                </TabsList>
                <TabsContent value="editor" className="flex-grow flex flex-col bg-card rounded-lg border shadow-sm">
                    {activeChapter ? (
                        <Editor 
                            key={activeChapter.id}
                            chapter={activeChapter} 
                            onContentChange={(content) => handleUpdateChapter(activeChapter.id, { content })}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            <p>Select a chapter or create a new one to start writing.</p>
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="cover" className="flex-grow">
                    <CoverCreator />
                </TabsContent>
            </Tabs>
        </div>
        <StatusBar chapter={activeChapter} totalWordCount={totalWordCount} />
      </SidebarInset>
    </SidebarProvider>
  );
}