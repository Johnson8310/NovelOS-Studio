"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from './ui/button';
import { Wand2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { generateCover } from '@/ai/flows/ai-cover-generator';

export default function CoverCreator() {
    const defaultCover = PlaceHolderImages.find(img => img.id === 'cover-placeholder');
    
    const [coverImage, setCoverImage] = useState(defaultCover?.imageUrl);
    const [prompt, setPrompt] = useState('A mysterious forest under a full moon');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    
    const handleGenerateCover = async () => {
        setIsLoading(true);
        try {
            const result = await generateCover({ prompt });
            if (result.coverImageUri) {
                setCoverImage(result.coverImageUri);
                toast({
                    title: "Cover Generated!",
                    description: "Your new book cover is ready."
                });
            } else {
                 toast({
                    variant: "destructive",
                    title: "Cover Generation Failed",
                    description: "Could not get a response from the AI.",
                });
            }
        } catch (error) {
             console.error("Cover generation failed:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "An error occurred during cover generation.",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>AI Book Cover Creator</CardTitle>
                <CardDescription>
                    Describe the cover you want to create, and let AI bring it to life.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6">
                <div className="relative w-[300px] h-[400px] shadow-lg rounded-md overflow-hidden bg-muted">
                    {coverImage ? (
                        <Image
                            src={coverImage}
                            alt="Generated book cover"
                            fill
                            style={{ objectFit: 'cover' }}
                            unoptimized // Required for data URIs
                        />
                    ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                            <p className="text-muted-foreground">Your cover will appear here</p>
                        </div>
                    )}
                     {isLoading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Loader2 className="h-10 w-10 animate-spin text-white" />
                        </div>
                    )}
                </div>
                 <div className="w-full space-y-2">
                    <Label htmlFor="cover-prompt">Cover Prompt</Label>
                    <Input 
                        id="cover-prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., A lone astronaut on a red planet"
                        disabled={isLoading}
                    />
                </div>
                <Button onClick={handleGenerateCover} disabled={isLoading} className="w-full">
                    <Wand2 className="mr-2 h-4 w-4" />
                    {isLoading ? "Generating..." : "Generate Cover"}
                </Button>
            </CardContent>
        </Card>
    );
}
    
