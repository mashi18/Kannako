import { useState, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { createSpeechRecognition, isSpeechSupported, parseVoiceText } from '../services/voiceService';

export default function VoiceEntry({ onResult, onClose }) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (!isSpeechSupported()) return;
    const rec = createSpeechRecognition();
    if (!rec) return;
    rec.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      const parsed = parseVoiceText(text);
      onResult?.(parsed);
      setListening(false);
    };
    rec.onerror = () => { setListening(false); };
    rec.onend = () => { setListening(false); };
    setRecognition(rec);
    return () => { try { rec.abort(); } catch {} };
  }, []);

  const toggleListening = () => {
    if (!recognition) return;
    if (listening) {
      recognition.stop();
      setListening(false);
    } else {
      setTranscript('');
      recognition.start();
      setListening(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="card w-full max-w-sm mx-4 text-center">
        <h3 className="font-bold text-lg mb-2">Voice Entry</h3>
        <p className="text-sm text-slate-500 mb-6">Say something like "500 cash sale" or "Milk 1200 expense"</p>
        <button
          onClick={toggleListening}
          disabled={!recognition}
          className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center transition-all ${
            listening
              ? 'bg-red-500 text-white shadow-lg shadow-red-200 animate-pulse'
              : 'bg-kanakko-100 text-kanakko-600'
          }`}
        >
          {listening ? <MicOff size={32} /> : <Mic size={32} />}
        </button>
        {listening && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <Loader2 size={18} className="animate-spin text-kanakko-500" />
            <span className="text-sm text-slate-500">Listening...</span>
          </div>
        )}
        {transcript && (
          <div className="mt-4 p-3 bg-slate-50 rounded-xl">
            <p className="text-sm font-medium text-slate-700">"{transcript}"</p>
          </div>
        )}
        {!recognition && (
          <p className="text-sm text-rose-500 mt-4">Voice input not supported on this device</p>
        )}
        <button onClick={onClose} className="btn-secondary w-full mt-4">
          Cancel
        </button>
      </div>
    </div>
  );
}
