'use client';

import { TraderProfile, PROFILE_TYPE_NAMES, PROFILE_TYPE_DESCRIPTIONS, SectionKey } from '@/types/trader-dna';
import { LearningPathDisplay } from './learning-path-display';

interface ProfileSummaryProps {
  profile: TraderProfile;
}

// Profile type icons
const PROFILE_ICONS: Record<string, string> = {
  sniper: '🎯',
  analyst: '📊',
  warrior: '⚔️',
  disciplinarian: '📋',
  opportunist: '🔄',
};

// Profile type colors
const PROFILE_COLORS: Record<string, string> = {
  sniper: 'from-blue-500 to-blue-600',
  analyst: 'from-purple-500 to-purple-600',
  warrior: 'from-red-500 to-red-600',
  disciplinarian: 'from-green-500 to-green-600',
  opportunist: 'from-amber-500 to-amber-600',
};

const SECTION_LABELS: Record<SectionKey, string> = {
  riskPersonality: 'Risk Personality',
  emotionalStability: 'Emotional Stability',
  decisionMaking: 'Decision Making',
  tradingBehavior: 'Trading Behavior',
  learningStyle: 'Learning Style',
};

export function ProfileSummary({ profile }: ProfileSummaryProps) {
  const profileName = PROFILE_TYPE_NAMES[profile.type];
  const profileDescription = PROFILE_TYPE_DESCRIPTIONS[profile.type];
  const icon = PROFILE_ICONS[profile.type];
  const colorClass = PROFILE_COLORS[profile.type];

  const scoreEntries = Object.entries(profile.scores) as [SectionKey, number][];

  return (
    <div className="space-y-6">
      {/* Profile header */}
      <div className={`bg-gradient-to-r ${colorClass} rounded-xl p-6 text-white`}>
        <div className="flex items-start gap-4">
          <div className="text-4xl">{icon}</div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{profileName}</h1>
            <p className="mt-2 text-white/90 text-sm leading-relaxed">
              {profileDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Learning Path */}
      <div className="bg-white rounded-xl border border-[#E0E0E0] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#0B0B0B] mb-4">Your Learning Path</h2>
        <LearningPathDisplay learningPath={profile.learningPath} />
      </div>

      {/* Section Scores */}
      <div className="bg-white rounded-xl border border-[#E0E0E0] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#0B0B0B] mb-4">Assessment Results</h2>
        <div className="space-y-4">
          {scoreEntries.map(([section, score]) => (
            <div key={section} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#616161]">
                  {SECTION_LABELS[section]}
                </span>
                <span className="text-sm font-bold text-[#0B0B0B]">{score}%</span>
              </div>
              <div className="h-2 bg-[#E0E0E0] rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    score >= 70 ? 'bg-[#2E7D32]' : score >= 50 ? 'bg-[#E53935]' : 'bg-[#FF6B6B]'
                  }`}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {profile.recommendations.length > 0 && (
        <div className="bg-white rounded-xl border border-[#E0E0E0] p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#0B0B0B] mb-4">Personalized Recommendations</h2>
          <ul className="space-y-3">
            {profile.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#E53935]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-[#E53935]">{index + 1}</span>
                </div>
                <span className="text-sm text-[#424242]">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        <a
          href="/trader-dna"
          className="px-4 py-2 text-sm text-[#616161] hover:text-[#E53935] transition-colors"
        >
          ← Retake Assessment
        </a>
        <a
          href="/profile"
          className="px-6 py-3 bg-[#E53935] text-white rounded-lg font-medium hover:bg-[#D32F2F] transition-colors"
        >
          View Full Profile →
        </a>
      </div>
    </div>
  );
}