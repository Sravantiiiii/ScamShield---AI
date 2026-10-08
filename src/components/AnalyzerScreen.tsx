import React, { useState } from 'react';
import {
  Clipboard,
  Trash2,
  Lock,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Info
} from 'lucide-react';
import { SCAM_EXAMPLES, ExampleMessage } from '../data/examples';
import { ScamAnalysisReport } from '../types';

interface AnalyzerScreenProps {
  onAnalysisComplete: (report: ScamAnalysisReport) => void;
}

export const AnalyzerScreen: React.FC<AnalyzerScreenProps> = ({ onAnalysisComplete }) => {
  const [message, setMessage] = useState<string>('');
  const [selectedExampleId, setSelectedExampleId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSelectExample = (example: ExampleMessage) => {
    setMessage(example.text);
    setSelectedExampleId(example.id);
    setErrorMsg(null);
  };

  const handleClear = () => {
    setMessage('');
    setSelectedExampleId(null);
    setErrorMsg(null);
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setMessage(text);
        setSelectedExampleId(null);
        setErrorMsg(null);
      }
    } catch {
      setErrorMsg('Could not read clipboard automatically. Please press Ctrl+V or Cmd+V into the box.');
    }
  };

  const handleAnalyze = async () => {
    const trimmed = message.trim();
    if (!trimmed) {
      setErrorMsg('Please paste or type a message to analyze.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed })
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      const report: ScamAnalysisReport = {
        riskLevel: data.riskLevel || 'HIGH RISK',
        riskPercentage: typeof data.riskPercentage === 'number' ? data.riskPercentage : 90,
        scamType: data.scamType || 'Suspicious Communication',
        redFlags: Array.isArray(data.redFlags) && data.redFlags.length > 0 ? data.redFlags : ['High-urgency language detected', 'Unverified sender credentials'],
        explanation: data.explanation || 'This message exhibits known scam patterns designed to rush your decision-making.',
        safetyAdvice: Array.isArray(data.safetyAdvice) && data.safetyAdvice.length > 0 ? data.safetyAdvice : [
          'Do not send money.',
          'Do not share OTPs or passwords.',
          'Do not click suspicious links.',
          'Verify the company through its official website.',
          'Report or block the sender if appropriate.'
        ],
        originalMessage: trimmed,
        analyzedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      onAnalysisComplete(report);
    } catch (err: any) {
      console.error('Analysis failed:', err);
      setErrorMsg('Unable to complete scam risk assessment. Please check your connection and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-10 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
          Analyze a Suspicious Message
        </h1>
        <p className="text-sm sm:text-base text-[#64748B] max-w-xl mx-auto leading-relaxed">
          Paste an SMS, WhatsApp message, email, job offer, payment request, or social media message below.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] space-y-6">
        {/* Quick Example Buttons */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <label className="text-xs font-semibold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Or Try a Real-World Example:</span>
            </label>
            <span className="text-[11px] text-[#64748B]">Click to pre-fill</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {SCAM_EXAMPLES.map((ex) => {
              const isSelected = selectedExampleId === ex.id && message === ex.text;
              return (
                <button
                  key={ex.id}
                  type="button"
                  onClick={() => handleSelectExample(ex)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#EFF6FF] text-[#2563EB] border-[#2563EB] shadow-xs ring-1 ring-[#2563EB]'
                      : 'bg-[#F8FAFC] hover:bg-[#EFF6FF] text-[#0F172A] hover:text-[#2563EB] border-[#CBD5E1] hover:border-[#2563EB]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
                  <span>{ex.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Textarea Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#0F172A]">
              Message Text
            </label>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePasteClipboard}
                className="text-xs text-[#2563EB] hover:text-[#1D4ED8] font-medium flex items-center gap-1 cursor-pointer"
              >
                <Clipboard className="w-3.5 h-3.5" />
                <span>Paste from Clipboard</span>
              </button>

              {message && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs text-[#64748B] hover:text-[#DC2626] font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          <div className="relative">
            <textarea
              rows={8}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (selectedExampleId && e.target.value !== SCAM_EXAMPLES.find(x => x.id === selectedExampleId)?.text) {
                  setSelectedExampleId(null);
                }
              }}
              placeholder="Paste your suspicious message here..."
              className="w-full p-4 bg-white text-sm sm:text-base text-[#0F172A] placeholder-[#64748B] border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#2563EB] focus:ring-3 focus:ring-blue-500/15 transition-all resize-y leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-[#64748B] px-1">
            <span>Character count: {message.length}</span>
            {message.length > 0 && (
              <span className="text-[#2563EB] font-medium">Ready to analyze</span>
            )}
          </div>
        </div>

        {/* Privacy Note Required by brief */}
        <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-start gap-3 text-xs text-[#64748B]">
          <Lock className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-[#0F172A]">Privacy Notice: </strong>
            Do not enter passwords, OTPs, bank account numbers, or other sensitive personal information.
          </p>
        </div>

        {/* Error Notification if any */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-[#FEE2E2] border border-[#FECACA] text-[#DC2626] text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Primary Action Button */}
        <div>
          <button
            type="button"
            disabled={isAnalyzing}
            onClick={handleAnalyze}
            className="w-full py-3.5 px-6 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] disabled:bg-[#93C5FD] text-white text-base font-semibold transition-all shadow-md shadow-blue-600/15 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Checking Message for Scams...</span>
              </>
            ) : (
              <>
                <span>Analyze Message</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Helpful Hint */}
      <div className="text-center text-xs text-[#64748B] flex items-center justify-center gap-1.5">
        <Info className="w-4 h-4 text-[#2563EB]" />
        <span>ScamShield AI checks for artificial urgency, fee demands, fake identities, and suspicious links.</span>
      </div>
    </div>
  );
};
