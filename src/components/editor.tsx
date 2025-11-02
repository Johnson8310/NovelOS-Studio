"use client"

import type { Chapter } from "@/lib/types";
import React, { useRef, useState, useEffect } from 'react';
import { Bold, Italic, Underline, Wand2 } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { useToast } from "@/hooks/use-toast";
import { aiGrammarCheck } from "@/ai/flows/ai-grammar-check";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

interface EditorProps {
    chapter: Chapter;
    onContentChange: (content: string) => void;
}

const EditorToolbar = ({ onFormat, onProofread, isProofreading }: { onFormat: (command: string) => void, onProofread: () => void, isProofreading: boolean }) => (
    <div className="p-2 border-b bg-background sticky top-0 z-10 flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => onFormat('bold')}><Bold className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => onFormat('italic')}><Italic className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => onFormat('underline')}><Underline className="h-4 w-4" /></Button>
        <Separator orientation="vertical" className="h-6" />
        <Button variant="ghost" onClick={onProofread} disabled={isProofreading}>
            <Wand2 className={cn("h-4 w-4 mr-2", isProofreading && "animate-pulse")} />
            {isProofreading ? 'Improving...' : 'AI Proofread'}
        </Button>
    </div>
);


export default function Editor({ chapter, onContentChange }: EditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();
    const [isProofreading, setIsProofreading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        if (editorRef.current && chapter.content !== editorRef.current.innerHTML) {
            editorRef.current.innerHTML = chapter.content;
        }
    }, [chapter.id, chapter.content]);

    const handleInput = () => {
        if (editorRef.current) {
            onContentChange(editorRef.current.innerHTML);
        }
    };

    const handleFormat = (command: string) => {
        document.execCommand(command, false);
        editorRef.current?.focus();
        handleInput();
    };
    
    const handleProofread = async () => {
        if (!editorRef.current) return;
        
        setIsProofreading(true);
        try {
            const textToCorrect = editorRef.current.innerText;
            const result = await aiGrammarCheck({ text: textToCorrect });
            
            if (result.correctedText && editorRef.current) {
                // To maintain basic structure, we can try to wrap in paragraphs
                const formattedText = result.correctedText.split('\n\n').map(p => `<p>${p}</p>`).join('');
                editorRef.current.innerHTML = formattedText;
                onContentChange(formattedText);
                toast({
                    title: "AI Proofread Complete",
                    description: "The text has been updated with corrections.",
                });
            } else {
                 toast({
                    variant: "destructive",
                    title: "AI Proofread Failed",
                    description: "Could not get a response from the AI.",
                });
            }
        } catch (error) {
            console.error("AI proofreading failed:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "An error occurred during proofreading.",
            });
        } finally {
            setIsProofreading(false);
        }
    };
    
    if (!isMounted) {
        return (
            <div className="p-4 space-y-4">
                <Skeleton className="h-10 w-1/4" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full">
            <EditorToolbar onFormat={handleFormat} onProofread={handleProofread} isProofreading={isProofreading} />
            <div className="flex-grow overflow-auto">
                <div
                    ref={editorRef}
                    contentEditable={!isProofreading}
                    onInput={handleInput}
                    className="prose dark:prose-invert max-w-none p-8 h-full focus:outline-none font-body"
                    style={{ minHeight: '60vh' }}
                />
            </div>
        </div>
    );
}