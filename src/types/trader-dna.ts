// Trader DNA Assessment Types

export type SectionKey = 
  | 'riskPersonality' 
  | 'emotionalStability' 
  | 'decisionMaking' 
  | 'tradingBehavior' 
  | 'learningStyle';

export type ProfileType = 'sniper' | 'analyst' | 'warrior' | 'disciplinarian' | 'opportunist';

export type QuestionType = 'multiple_choice' | 'rating' | 'scenario' | 'frequency';

export type LearningPath = 'visual' | 'structured' | 'practical';

export interface QuestionOption {
  value: number | string;
  label: string;
  description?: string;
}

export interface AssessmentQuestion {
  id: string;
  section: SectionKey;
  type: QuestionType;
  question: string;
  options: QuestionOption[];
  weight: number;
}

export type AnswerMap = Record<string, number | string>;

export interface Section {
  title: string;
  description: string;
  questionCount: number;
}

export interface AlertThresholds {
  riskSensitivity: 'low' | 'medium' | 'high';
  alertFrequency: 'minimal' | 'normal' | 'detailed';
}

export interface DashboardLayout {
  primaryWidget: string;
  widgetOrder: string[];
}

export interface TraderProfile {
  type: ProfileType;
  scores: {
    riskPersonality: number;
    emotionalStability: number;
    decisionMaking: number;
    tradingBehavior: number;
    learningStyle: number;
  };
  learningPath: LearningPath;
  dashboardLayout: DashboardLayout;
  alertThresholds: AlertThresholds;
  recommendations: string[];
}

// Section metadata constant
export const sections: Record<SectionKey, Section> = {
  riskPersonality: {
    title: 'Risk Personality',
    description: 'Assess your aggression level, risk appetite, loss tolerance, and recovery behavior',
    questionCount: 8,
  },
  emotionalStability: {
    title: 'Emotional Stability',
    description: 'Evaluate your impulsiveness, patience, frustration response, and revenge tendencies',
    questionCount: 8,
  },
  decisionMaking: {
    title: 'Decision Making Style',
    description: 'Identify if you are an analytical trader, emotional trader, reactive trader, or structured trader',
    questionCount: 8,
  },
  tradingBehavior: {
    title: 'Trading Behavior',
    description: 'Measure your overtrading probability, FOMO tendencies, discipline level, and consistency habits',
    questionCount: 8,
  },
  learningStyle: {
    title: 'Learning Style',
    description: 'Determine if you are a visual learner, structured learner, or practical learner',
    questionCount: 8,
  },
};

// Profile type display names
export const PROFILE_TYPE_NAMES: Record<ProfileType, string> = {
  sniper: 'The Sniper',
  analyst: 'The Analyst',
  warrior: 'The Warrior',
  disciplinarian: 'The Disciplinarian',
  opportunist: 'The Opportunist',
};

// Profile type descriptions
export const PROFILE_TYPE_DESCRIPTIONS: Record<ProfileType, string> = {
  sniper: 'You are a patient, high-conviction trader who waits for perfect setups before executing. You focus on detailed analysis and prefer quality over quantity in your trades.',
  analyst: 'You are a data-driven, systematic trader who relies on charts, metrics, and reports. You prefer clear rules and structured approaches to the market.',
  warrior: 'You are an aggressive, confident trader who acts quickly and decisively. You thrive on momentum and are comfortable taking bold positions.',
  disciplinarian: 'You are a strict rules-based trader who values consistency above all. You follow checklists and track adherence metrics to ensure you stay disciplined.',
  opportunist: 'You are an adaptive, flexible trader who switches between tools and strategies based on market conditions. You excel at finding opportunities in various environments.',
};