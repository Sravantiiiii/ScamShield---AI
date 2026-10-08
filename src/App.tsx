import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HomeScreen } from './components/HomeScreen';
import { AnalyzerScreen } from './components/AnalyzerScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { ScamAnalysisReport, ScreenState } from './types';
import { Shield } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('home');
  const [currentReport, setCurrentReport] = useState<ScamAnalysisReport | null>(null);

  const handleStartAnalysis = () => {
    setCurrentScreen('analyzer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnalysisComplete = (report: ScamAnalysisReport) => {
    setCurrentReport(report);
    setCurrentScreen('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnalyzeAnother = () => {
    setCurrentReport(null);
    setCurrentScreen('analyzer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Clean Navbar */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={(screen) => {
          setCurrentScreen(screen);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6">
        {currentScreen === 'home' && (
          <HomeScreen onStartAnalysis={handleStartAnalysis} />
        )}

        {currentScreen === 'analyzer' && (
          <AnalyzerScreen onAnalysisComplete={handleAnalysisComplete} />
        )}

        {currentScreen === 'results' && currentReport && (
          <ResultsScreen
            report={currentReport}
            onAnalyzeAnother={handleAnalyzeAnother}
          />
        )}
      </main>

      {/* Clean Trust Footer */}
      <footer className="bg-white border-t border-[#E2E8F0] mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#2563EB] flex items-center justify-center text-white">
              <Shield className="w-3 h-3" />
            </div>
            <span className="font-bold text-[#0F172A]">ScamShield AI</span>
            <span>—</span>
            <span>"Before You Trust a Message, Check It."</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Free Public Safety Tool</span>
            <span>•</span>
            <span>Targeted for Students, Job Seekers & Smartphone Users</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
