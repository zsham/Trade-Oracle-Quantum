
export interface TradeEvent {
  id: string;
  origin: string;
  destination: string;
  commodity: string;
  value: number;
  timestamp: number;
  type: 'Export' | 'Import';
}

export interface TradeOpportunity {
  pair: string;
  commodity: string;
  action: 'STRONG BUY' | 'ACCUMULATE' | 'HEDGE' | 'WATCH';
  strategyType: 'Arbitrage' | 'Momentum' | 'Supply Chain' | 'Swing Trade' | 'Macro Trend';
  confidence: number;
  rationale: string;
  targetYield: string;
}

export interface AICounsel {
  summary: string;
  marketSentiment: string;
  recommendedAction: string;
  risks: string[];
  opportunities: TradeOpportunity[];
}
