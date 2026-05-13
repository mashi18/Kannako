export function parseVoiceText(transcript) {
  const lower = transcript.toLowerCase().trim();
  let type = 'OUT';
  let amount = 0;
  let description = '';
  const inKeywords = ['sale', 'received', 'got', 'income', 'payment received', 'cash sale', 'credit'];
  const outKeywords = ['expense', 'spent', 'paid', 'purchase', 'bought', 'milk', 'vegetables', 'stock', 'supplies'];
  const amountMatch = lower.match(/([0-9,]+(?:\.[0-9]{2})?)/);
  if (amountMatch) {
    amount = parseFloat(amountMatch[1].replace(/,/g, ''));
  }
  for (const kw of outKeywords) {
    if (lower.includes(kw)) { type = 'OUT'; break; }
  }
  for (const kw of inKeywords) {
    if (lower.includes(kw)) { type = 'IN'; break; }
  }
  description = lower.replace(/[0-9,]+(?:\.[0-9]{2})?/g, '').replace(/rs\.?|₹/g, '').trim();
  const cleanDescription = description.charAt(0).toUpperCase() + description.slice(1);
  return { type, amount, description: cleanDescription || (type === 'IN' ? 'Sale' : 'Expense') };
}

export function isSpeechSupported() {
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
}

export function createSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return null;
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'hi-IN';
  return recognition;
}
