import { createWorker } from 'tesseract.js';

let worker = null;

async function getWorker() {
  if (!worker) {
    worker = await createWorker('eng');
  }
  return worker;
}

export async function extractAmountFromImage(imageData) {
  try {
    const w = await getWorker();
    const { data } = await w.recognize(imageData);
    const text = data.text;
    const amountPatterns = [
      /(?:total|amount|due|pay|rs\.?|₹)\s*([0-9,]+(?:\.[0-9]{2})?)/gi,
      /([0-9,]+(?:\.[0-9]{2})?)\s*(?:only|rs\.?|₹)/gi,
      /(?:grand\s+total|net\s+amount|bill\s+amount)[:\s]*([0-9,]+(?:\.[0-9]{2})?)/gi,
    ];
    for (const pattern of amountPatterns) {
      const match = text.match(pattern);
      if (match) {
        const numMatch = match[0].match(/([0-9,]+(?:\.[0-9]{2})?)/);
        if (numMatch) {
          return parseFloat(numMatch[1].replace(/,/g, ''));
        }
      }
    }
    const allNums = text.match(/([0-9,]+(?:\.[0-9]{2})?)/g);
    if (allNums) {
      const amounts = allNums.map(n => parseFloat(n.replace(/,/g, ''))).filter(n => n > 0);
      if (amounts.length > 0) {
        return Math.max(...amounts);
      }
    }
    return null;
  } catch {
    return null;
  }
}

export function terminateWorker() {
  if (worker) {
    worker.terminate();
    worker = null;
  }
}
