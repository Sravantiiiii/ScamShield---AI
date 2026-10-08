export type RiskLevel = 'HIGH RISK' | 'MODERATE RISK' | 'LOW RISK';

export interface ScamAnalysisReport {
  riskLevel: RiskLevel;
  riskPercentage: number;
  scamType: string;
  redFlags: string[];
  explanation: string;
  safetyAdvice: string[];
  originalMessage: string;
  analyzedAt: string;
}

export type ScreenState = 'home' | 'analyzer' | 'results';
