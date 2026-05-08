// Trader DNA Scoring Algorithm
import {
  TraderProfile,
  ProfileType,
  AnswerMap,
  SectionKey,
  LearningPath,
  DashboardLayout,
  AlertThresholds,
} from '@/types/trader-dna';
import { questions } from './questions';

// Calculate section scores from answers
export function calculateSectionScores(answers: AnswerMap): Record<SectionKey, number> {
  const sections: SectionKey[] = ['riskPersonality', 'emotionalStability', 'decisionMaking', 'tradingBehavior', 'learningStyle'];
  const scores: Record<SectionKey, number> = {
    riskPersonality: 0,
    emotionalStability: 0,
    decisionMaking: 0,
    tradingBehavior: 0,
    learningStyle: 0,
  };

  for (const section of sections) {
    const sectionQuestions = questions.filter(q => q.section === section);
    let totalWeight = 0;
    let weightedSum = 0;

    for (const question of sectionQuestions) {
      const answer = answers[question.id];
      if (answer !== undefined && answer !== null) {
        const numericValue = typeof answer === 'number' ? answer : parseFloat(answer as string) || 0;
        weightedSum += numericValue * question.weight;
        totalWeight += question.weight;
      }
    }

    if (totalWeight > 0) {
      // Normalize to 0-100 scale (assuming max possible value is 5 per question)
      const maxPossible = sectionQuestions.reduce((sum, q) => sum + 5 * q.weight, 0);
      const normalizedScore = (weightedSum / maxPossible) * 100;
      scores[section] = Math.round(Math.min(100, Math.max(0, normalizedScore)));
    }
  }

  return scores;
}

// Determine profile type based on scores
export function determineProfileType(scores: Record<SectionKey, number>): ProfileType {
  const { riskPersonality, emotionalStability, decisionMaking, tradingBehavior } = scores;

  // Priority order for profile determination
  if (riskPersonality > 70 && emotionalStability > 50) {
    return 'warrior';
  }
  if (decisionMaking > 65) {
    return 'analyst';
  }
  if (tradingBehavior > 70) {
    return 'disciplinarian';
  }
  if (emotionalStability < 45) {
    return 'opportunist';
  }
  if (riskPersonality < 50 && emotionalStability > 60) {
    return 'sniper';
  }

  // Default fallback
  return 'analyst';
}

// Determine learning path based on learning style score
export function determineLearningPath(learningStyleScore: number): LearningPath {
  if (learningStyleScore >= 70) {
    return 'visual';
  }
  if (learningStyleScore >= 40) {
    return 'structured';
  }
  return 'practical';
}

// Get dashboard layout configuration based on profile type
export function getDashboardLayoutConfig(profileType: ProfileType): DashboardLayout {
  const layouts: Record<ProfileType, DashboardLayout> = {
    sniper: {
      primaryWidget: 'analysis',
      widgetOrder: ['analysis', 'performance', 'alerts', 'risk'],
    },
    analyst: {
      primaryWidget: 'metrics',
      widgetOrder: ['metrics', 'charts', 'performance', 'alerts'],
    },
    warrior: {
      primaryWidget: 'quickActions',
      widgetOrder: ['quickActions', 'alerts', 'journal', 'performance'],
    },
    disciplinarian: {
      primaryWidget: 'checklists',
      widgetOrder: ['checklists', 'adherence', 'performance', 'metrics'],
    },
    opportunist: {
      primaryWidget: 'tools',
      widgetOrder: ['tools', 'alerts', 'journal', 'performance'],
    },
  };

  return layouts[profileType];
}

// Get alert thresholds based on profile type
export function getAlertThresholdsConfig(profileType: ProfileType): AlertThresholds {
  const thresholds: Record<ProfileType, AlertThresholds> = {
    sniper: {
      riskSensitivity: 'medium',
      alertFrequency: 'normal',
    },
    analyst: {
      riskSensitivity: 'high',
      alertFrequency: 'detailed',
    },
    warrior: {
      riskSensitivity: 'low',
      alertFrequency: 'minimal',
    },
    disciplinarian: {
      riskSensitivity: 'high',
      alertFrequency: 'normal',
    },
    opportunist: {
      riskSensitivity: 'medium',
      alertFrequency: 'normal',
    },
  };

  return thresholds[profileType];
}

// Generate recommendations based on scores and profile type
export function generateRecommendations(scores: Record<SectionKey, number>, profileType: ProfileType): string[] {
  const recommendations: string[] = [];

  // Profile-specific recommendations
  switch (profileType) {
    case 'sniper':
      recommendations.push('Focus on patience and waiting for high-quality setups');
      recommendations.push('Develop detailed analysis before entry');
      recommendations.push('Build conviction tracking to support waiting behavior');
      break;
    case 'analyst':
      recommendations.push('Create systematic trading rules and follow them consistently');
      recommendations.push('Build comprehensive trading journal with data analysis');
      recommendations.push('Develop automated alerts for entry signals');
      break;
    case 'warrior':
      recommendations.push('Implement strict position sizing rules to control aggression');
      recommendations.push('Add pre-trade validation checks before execution');
      recommendations.push('Build daily loss limits to prevent overtrading');
      break;
    case 'disciplinarian':
      recommendations.push('Focus on checklist adherence and consistency tracking');
      recommendations.push('Implement automated rule reminders');
      recommendations.push('Build performance metrics for rule compliance');
      break;
    case 'opportunist':
      recommendations.push('Create a structured evaluation framework for opportunities');
      recommendations.push('Limit the number of tools and strategies used simultaneously');
      recommendations.push('Build transition protocols between different market conditions');
      break;
  }

  // Score-based recommendations for weak areas
  if (scores.riskPersonality < 50) {
    recommendations.push('Work on risk management fundamentals');
  }
  if (scores.emotionalStability < 50) {
    recommendations.push('Practice emotional control techniques during trading');
  }
  if (scores.decisionMaking < 50) {
    recommendations.push('Develop a more systematic decision-making process');
  }
  if (scores.tradingBehavior < 50) {
    recommendations.push('Focus on trading discipline and consistency');
  }

  // Return top 5 recommendations
  return recommendations.slice(0, 5);
}

// Main function to calculate complete trader profile
export function calculateProfile(answers: AnswerMap): TraderProfile {
  const scores = calculateSectionScores(answers);
  const profileType = determineProfileType(scores);
  const learningPath = determineLearningPath(scores.learningStyle);
  const dashboardLayout = getDashboardLayoutConfig(profileType);
  const alertThresholds = getAlertThresholdsConfig(profileType);
  const recommendations = generateRecommendations(scores, profileType);

  return {
    type: profileType,
    scores,
    learningPath,
    dashboardLayout,
    alertThresholds,
    recommendations,
  };
}

// Type for database-fetched profile
export interface TraderProfileDB {
  id: string;
  profile_type: ProfileType;
  risk_personality_score: number;
  emotional_stability_score: number;
  decision_making_score: number;
  trading_behavior_score: number;
  learning_style_score: number;
  learning_path: LearningPath;
  dashboard_layout: DashboardLayout;
  alert_thresholds: AlertThresholds;
  completed_at: string;
  created_at: string;
}

// Map database profile to TraderProfile interface
export function mapDbProfileToTraderProfile(dbProfile: TraderProfileDB): TraderProfile {
  return {
    type: dbProfile.profile_type,
    scores: {
      riskPersonality: dbProfile.risk_personality_score,
      emotionalStability: dbProfile.emotional_stability_score,
      decisionMaking: dbProfile.decision_making_score,
      tradingBehavior: dbProfile.trading_behavior_score,
      learningStyle: dbProfile.learning_style_score,
    },
    learningPath: dbProfile.learning_path,
    dashboardLayout: dbProfile.dashboard_layout,
    alertThresholds: dbProfile.alert_thresholds,
    recommendations: [], // Recommendations are recalculated, not stored
  };
}