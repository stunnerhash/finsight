import { useState } from 'react';
import { createWorker } from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

export const useReceiptProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedText, setExtractedText] = useState('');
  const [extractedAmount, setExtractedAmount] = useState<number | null>(null);

  const cleanAmount = (amountStr: string): number | null => {
    let cleanedStr = amountStr.replace(/[^\d.,-]/g, '').trim();
    if (cleanedStr.includes('.') && cleanedStr.includes(',')) {
      if (cleanedStr.lastIndexOf(',') > cleanedStr.lastIndexOf('.')) {
        cleanedStr = cleanedStr.replace(/\./g, '').replace(',', '.');
      } else {
        cleanedStr = cleanedStr.replace(/,/g, '');
      }
    } else if (cleanedStr.includes(',')) {
      cleanedStr = cleanedStr.replace(',', '.');
    }
    const amount = parseFloat(cleanedStr);
    return isNaN(amount) ? null : amount;
  };

  const findTotalAmount = (text: string): number | null => {
    const patterns = [
      // Pattern 1 - High-specificity for multi-word keys first
      /\b(total\s*amount|grand\s*total|amount\s*due|net\s*payable|invoice\s*total)\b.*?([-]?[$€£₹¥]?\s*\d{1,3}(?:[,.]?\d{3})*(?:[.,]\d{2}))\b/gi,
      
      // Pattern 2: High-Confidence for single keywords (e.g., 1,234.56)
      /\b(total|amount|balance)\b.*?([-]?[$€£₹¥]?\s*\d{1,3}(?:,?\d{3})*\.\d{2})\b/gi,
      
      // Pattern 3: High-Confidence for single keywords (e.g., 1.234,56)
      /\b(total|amount|balance)\b.*?([-]?[$€£₹¥]?\s*\d{1,3}(?:\.?\d{3})*,\d{2})\b/gi,
      
      // Pattern 4: General Fallback for varied formats (e.g., Total: 5384)
      /\b(total|amount|balance|pay)\b[^.,\d]*([-]?[$€£₹¥]?\s*(?:\d{1,3}(?:[,.\s]?\d{3})*|\d+)(?:[.,]\d{1,2})?)\b/gi,
    ];

    for (let i = 0; i < patterns.length; i++) {
      const pattern = patterns[i];
      pattern.lastIndex = 0; // Reset index for global regex
      const matches = [...text.matchAll(pattern)];
      
      if (matches.length > 0) {
        console.log(`[INFO] Found match with Pattern #${i + 1}`);
        const lastMatch = matches[matches.length - 1];
        const amount = cleanAmount(lastMatch[2] || lastMatch[1]);
        if (amount !== null) {
          return amount;
        }
      }
    }
    return null;
  };

  const processPdf = async (file: File): Promise<string> => {
    try {
      // Use local worker from installed dependency
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 2.5 });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d")!;
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvas, canvasContext: context, viewport }).promise;

      // Convert canvas to data URL that Tesseract can process
      return canvas.toDataURL("image/png");
    } catch (error) {
      console.error("PDF processing failed:", error);
      throw new Error("Failed to process PDF");
    }
  };

  const processReceipt = async (file: File) => {
    setIsProcessing(true);
    setProgress(0);

    try {
      const worker = await createWorker("eng", 1, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            const progressValue = Math.floor(m.progress * 100);
            setProgress(progressValue);
          }
        },
      });

      let ocrTarget: File | string = file;
      if (file.type === "application/pdf") {
        ocrTarget = await processPdf(file);
      }

      const {
        data: { text },
      } = await worker.recognize(ocrTarget);
      await worker.terminate();

      setExtractedText(text);
      const amount = findTotalAmount(text);
      setExtractedAmount(amount);

      return { text, amount };
    } catch (error) {
      console.error("OCR processing failed:", error);
      throw error;
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const resetProcessing = () => {
    setExtractedText('');
    setExtractedAmount(null);
    setProgress(0);
  };

  return {
    isProcessing,
    progress,
    extractedText,
    extractedAmount,
    processReceipt,
    resetProcessing,
  };
};
