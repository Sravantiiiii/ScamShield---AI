import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Share2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { ScamAnalysisReport } from '../types';

interface ResultsScreenProps {
  report: ScamAnalysisReport;
  onAnalyzeAnother: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ report, onAnalyzeAnother }) => {
  const [copied, setCopied] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  const getRiskStyles = () => {
    switch (report.riskLevel) {
      case 'HIGH RISK':
        return {
          textColor: 'text-[#DC2626]',
          bgColor: 'bg-[#FEE2E2]',
          borderColor: 'border-[#FECACA]',
          badgeBg: 'bg-[#DC2626] text-white',
          icon: ShieldAlert,
          title: 'High Risk Detected',
          stripe: 'bg-[#DC2626]'
        };
      case 'MODERATE RISK':
        return {
          textColor: 'text-[#D97706]',
          bgColor: 'bg-[#FEF3C7]',
          borderColor: 'border-[#FDE68A]',
          badgeBg: 'bg-[#F59E0B] text-white',
          icon: AlertTriangle,
          title: 'Moderate Risk Warning',
          stripe: 'bg-[#F59E0B]'
        };
      case 'LOW RISK':
      default:
        return {
          textColor: 'text-[#16A34A]',
          bgColor: 'bg-[#DCFCE7]',
          borderColor: 'border-[#BBF7D0]',
          badgeBg: 'bg-[#16A34A] text-white',
          icon: ShieldCheck,
          title: 'Low Risk / Looks Safe',
          stripe: 'bg-[#16A34A]'
        };
    }
  };

  const riskStyle = getRiskStyles();
  const Icon = riskStyle.icon;

  const handleCopyReport = async () => {
    const reportText = `🛡️ SCAMSHIELD AI REPORT
Risk Level: ${report.riskLevel} (${report.riskPercentage}%)
Likely Scam Type: ${report.scamType}

🚨 RED FLAGS DETECTED:
${report.redFlags.map((flag, i) => `${i + 1}. ${flag}`).join('\n')}

💡 WHY THIS LOOKS SUSPICIOUS:
${report.explanation}

✅ WHAT YOU SHOULD DO:
${report.safetyAdvice.map((advice) => `• ${advice}`).join('\n')}

Checked with ScamShield AI: "Before You Trust a Message, Check It."`;

    try {
      await navigator.clipboard.writeText(reportText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-10 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
          AI Scam Analysis Report
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
          AI Scam Risk Assessment
        </h1>
      </div>

      {/* Primary Report Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] overflow-hidden">
        {/* Top Accent Stripe */}
        <div className={`h-2 w-full ${riskStyle.stripe}`} />

        <div className="p-6 sm:p-8 space-y-8">
          {/* Header Summary Box: Risk Level & Percentage */}
          <div className={`p-6 rounded-2xl border ${riskStyle.borderColor} ${riskStyle.bgColor} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                report.riskLevel === 'HIGH RISK'
                  ? 'bg-[#DC2626] text-white'
                  : report.riskLevel === 'MODERATE RISK'
                  ? 'bg-[#F59E0B] text-white'
                  : 'bg-[#16A34A] text-white'
              }`}>
                <Icon className="w-7 h-7" />
              </div>

              <div>
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider mb-1 ${
                  report.riskLevel === 'HIGH RISK'
                    ? 'bg-[#DC2626] text-white'
                    : report.riskLevel === 'MODERATE RISK'
                    ? 'bg-[#F59E0B] text-white'
                    : 'bg-[#16A34A] text-white'
                }`}>
                  {report.riskLevel}
                </span>

                <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${riskStyle.textColor}`}>
                  {report.riskPercentage}% Risk
                </h2>

                <div className="mt-1 text-xs sm:text-sm text-[#0F172A] font-semibold">
                  Likely Scam Type: <span className="underline decoration-2 decoration-blue-500 underline-offset-2">{report.scamType}</span>
                </div>
              </div>
            </div>

            <div className="text-left sm:text-right pt-2 sm:pt-0 border-t sm:border-t-0 border-black/10 text-xs text-[#64748B]">
              <span>Analyzed at {report.analyzedAt}</span>
            </div>
          </div>

          {/* Section: Red Flags Detected */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
              <span>Red Flags Detected ({report.redFlags.length})</span>
            </h3>

            <div className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-4 sm:p-5">
              <ol className="space-y-2.5">
                {report.redFlags.map((flag, index) => (
                  <li key={index} className="flex items-start gap-3 text-xs sm:text-sm text-[#0F172A]">
                    <span className="w-6 h-6 rounded-full bg-white border border-[#CBD5E1] text-[#2563EB] font-bold text-xs flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <span className="pt-0.5 font-medium">{flag}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Section: Why This Looks Suspicious */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
              <span>Why This Looks Suspicious</span>
            </h3>

            <div className="p-4 sm:p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs">
              <p className="text-xs sm:text-sm text-[#434655] leading-relaxed">
                {report.explanation}
              </p>
            </div>
          </div>

          {/* Section: What You Should Do */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
              <span>What You Should Do</span>
            </h3>

            <div className="p-5 rounded-xl bg-[#EFF6FF] border border-[#DBEAFE] space-y-2.5">
              {report.safetyAdvice.map((advice, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#1E40AF]">
                  <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                  <span className="font-medium">{advice}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Collapsible Original Message for Context */}
          <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
            <button
              onClick={() => setShowOriginal(!showOriginal)}
              className="w-full flex items-center justify-between p-3.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] text-xs font-semibold text-[#64748B] transition-colors cursor-pointer"
            >
              <span>View Analyzed Message Snippet</span>
              {showOriginal ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {showOriginal && (
              <div className="p-4 bg-white border-t border-[#E2E8F0] text-xs font-mono text-[#475569] whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                {report.originalMessage}
              </div>
            )}
          </div>

          {/* Bottom Action Buttons */}
          <div className="pt-4 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleCopyReport}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-[#CBD5E1] hover:bg-[#F8FAFC] text-xs sm:text-sm font-semibold text-[#0F172A] flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-[#16A34A]" />
                  <span className="text-[#16A34A]">Report Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#64748B]" />
                  <span>Copy Report</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onAnalyzeAnother}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Analyze Another Message</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
