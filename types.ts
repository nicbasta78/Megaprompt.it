
export interface BillData {
  annualConsumption: number;
  powerCommitted: number;
  fasceDistribution: {
    f1: number;
    f2: number;
    f3: number;
  };
  alphaSpread: number;
  pcv: number;
  additionalServices: string[];
  providerName: string;
}

export interface InterviewResponse {
  step: string;
  answer: string;
}

export enum AuditPhase {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  EXTRACTING = 'EXTRACTING',
  INTERVIEW = 'INTERVIEW',
  GENERATING_REPORT = 'GENERATING_REPORT',
  COMPLETED = 'COMPLETED'
}

export interface MarketOffer {
  name: string;
  punBase: string;
  spread: number;
  fixedCost: number;
  estimatedYearlyCost: number;
}

export interface FinalReport {
  behaviorAnalysis: {
    idealHours: string;
    tips: string[];
  };
  savingsModeling: {
    monthlySavings: number;
    yearlySavings: number;
    currentVsOptimizedData: Array<{ name: string; cost: number }>;
  };
  marketIntelligence: MarketOffer[];
  verdict: string;
}
