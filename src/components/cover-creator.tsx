"use client";

import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from './ui/button';
import { Upload } from 'lucide-react';

export default function CoverCreator() {
    const coverImage = PlaceHolderImages.find(img => img.id === 'cover-placeholder');

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Book Cover Creator</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6">
                <div className="relative w-[300px] h-[400px] shadow-lg rounded-md overflow-hidden">
                    {coverImage ? (
                        <Image
                            src={coverImage.imageUrl}
                            alt={coverImage.description}
                            fill
                            style={{ objectFit: 'cover' }}
                            data-ai-hint={coverImage.imageHint}
                        />
                    ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                            <p className="text-muted-foreground">No cover image</p>
                        </div>
                    )}
                </div>
                <Button disabled>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Cover (Coming Soon)
                </Button>
            </CardContent>
        </Card>
    );
}
