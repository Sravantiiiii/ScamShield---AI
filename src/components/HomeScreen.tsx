import React from 'react';
import {
  Shield,
  ArrowRight,
  ClipboardCheck,
  AlertTriangle,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  Smartphone,
  Lock,
  Sparkles
} from 'lucide-react';

interface HomeScreenProps {
  onStartAnalysis: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onStartAnalysis }) => {
  return (
    <div className="space-y-16 py-6 sm:py-10">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFF6FF] border border-[#DBEAFE] text-[#2563EB] text-xs font-semibold">
          <Shield className="w-3.5 h-3.5" />
          <span>Free AI Scam Detection for Everyone</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0F172A] leading-[1.15]">
          Before You Trust a Message, <span className="text-[#2563EB]">Check It.</span>
        </h1>

        <p className="text-base sm:text-lg text-[#64748B] max-w-2xl mx-auto leading-relaxed">
          Use AI to detect scam warning signs before you click, pay, or share sensitive information.
        </p>

        <div className="pt-2">
          <button
            onClick={onStartAnalysis}
            className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white text-base font-semibold rounded-lg shadow-md shadow-blue-600/20 hover:shadow-lg transition-all cursor-pointer"
          >
            <span>Analyze a Message</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-[#64748B] flex items-center justify-center gap-2">
          <Lock className="w-3.5 h-3.5 text-[#16A34A]" />
          <span>Private and confidential. No sign-up required.</span>
        </p>
      </section>

      {/* How It Works Section */}
      <section className="bg-white rounded-2xl border border-[#E2E8F0] p-8 sm:p-10 shadow-[0_1px_3px_0_rgba(15,23,42,0.04)]">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#2563EB] mb-2">
            Simple 3-Step Process
          </h2>
          <h3 className="text-2xl font-bold text-[#0F172A] tracking-tight">
            How It Works
          </h3>
          <p className="text-sm text-[#64748B] mt-1">
            Get instant clarity on any message in under three seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="p-6 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] relative flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] border border-[#DBEAFE] text-[#2563EB] flex items-center justify-center font-bold text-sm mb-4">
                1
              </div>
              <h4 className="text-base font-bold text-[#0F172A] mb-2">
                Paste Any Message
              </h4>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                Copy text from SMS, WhatsApp, emails, job offers, or payment requests and paste it into the analyzer.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center gap-1.5 text-xs text-[#2563EB] font-medium">
              <ClipboardCheck className="w-4 h-4" />
              <span>Instant text import</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] relative flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] border border-[#DBEAFE] text-[#2563EB] flex items-center justify-center font-bold text-sm mb-4">
                2
              </div>
              <h4 className="text-base font-bold text-[#0F172A] mb-2">
                AI Scans for Red Flags
              </h4>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                Our model pinpoints urgent language, upfront payment demands, fake job promises, and phishing links.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center gap-1.5 text-xs text-[#2563EB] font-medium">
              <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
              <span>Pattern & risk detection</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] relative flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] border border-[#DBEAFE] text-[#2563EB] flex items-center justify-center font-bold text-sm mb-4">
                3
              </div>
              <h4 className="text-base font-bold text-[#0F172A] mb-2">
                Get Safety Advice
              </h4>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                Review an easy-to-understand risk score and clear bullet points on what actions you should take right now.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center gap-1.5 text-xs text-[#16A34A] font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Actionable protection</span>
            </div>
          </div>
        </div>
      </section>

      {/* Target Users / Audience Section */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#2563EB] mb-2">
            Built For Everyday Protection
          </h2>
          <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
            Who Uses ScamShield AI?
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-xs flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0F172A] mb-1">
                Students
              </h4>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Catch fake scholarship awards, student loan relief traps, and fraudulent housing listings.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-xs flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0F172A] mb-1">
                Job Seekers
              </h4>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Spot fake remote work offers asking for equipment deposits or interviews over Telegram.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-xs flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0F172A] mb-1">
                Smartphone Users
              </h4>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Assess suspicious delivery fee texts, fake bank fraud warnings, and lottery prize claims.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Call to Action */}
      <section className="bg-[#0B1220] rounded-2xl p-8 sm:p-10 text-center text-white space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
          Unsure About a Message You Just Received?
        </h3>
        <p className="text-sm text-[#94A3B8] max-w-lg mx-auto">
          Paste it in ScamShield AI right now and find out if it is safe before responding.
        </p>
        <div className="pt-2">
          <button
            onClick={onStartAnalysis}
            className="px-6 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            Start Message Check
          </button>
        </div>
      </section>
    </div>
  );
};
