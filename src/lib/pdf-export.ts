"use client"

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function generatePdf(htmlContent: string, fontName: string) {
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = htmlContent;
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.width = '800px';
    tempContainer.style.padding = '20px';
    tempContainer.style.fontFamily = fontName;

    document.body.appendChild(tempContainer);

    try {
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
    } finally {
        document.body.removeChild(tempContainer);
    }
}
