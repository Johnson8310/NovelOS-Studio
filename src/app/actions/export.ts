'use server';

import htmlToDocx from 'html-to-docx';

export async function generateDocx(htmlContent: string, fontName: string) {
    const fileBuffer = await htmlToDocx(htmlContent, undefined, {
        font: fontName,
        fontSize: 12,
    });

    return fileBuffer;
}
