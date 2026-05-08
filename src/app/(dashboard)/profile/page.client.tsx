'use client';

import { TraderProfile, PROFILE_TYPE_NAMES, PROFILE_TYPE_DESCRIPTIONS, SectionKey } from '@/types/trader-dna';
import { ProfileSummary } from '@/components/trader-dna/profile-summary';
import { LearningPathDisplay } from '@/components/trader-dna/learning-path-display';

interface TraderProfilePageClientProps {
  profile: TraderProfile;
}

const PROFILE_ICONS: Record<string, string> = {
  sniper: '🎯',
  analyst: '📊',
  warrior: '⚔️',
  disciplinarian: '📋',
  opportunist: '🔄',
};

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

export function TraderProfilePageClient({ profile }: TraderProfilePageClientProps) {
  const profileName = PROFILE_TYPE_NAMES[profile.type];
  const profileDescription = PROFILE_TYPE_DESCRIPTIONS[profile.type];
  const icon = PROFILE_ICONS[profile.type];
  const colorClass = PROFILE_COLORS[profile.type];
  const scoreEntries = Object.entries(profile.scores) as [SectionKey, number][];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-4">
        <a 
          href="/dashboard" 
          className="p-2 hover:bg-[#F5F7FA] rounded-lg transition-colors"
          aria-label="Back to dashboard"
        >
          <svg className="w-5 h-5 text-[#616161]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </a>
        <div>
          <h1 className="text-2xl font-bold text-[#0B0B0B]">My Trader Profile</h1>
          <p className="text-sm text-[#616161]">Your personalized trading DNA assessment results</p>
        </div>
      </div>

      {/* Profile header */}
      <div className={`bg-gradient-to-r ${colorClass} rounded-xl p-6 text-white`}>
        <div className="flex items-start gap-4">
          <div className="text-5xl">{icon}</div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold">{profileName}</h2>
            <p className="mt-2 text-white/90 leading-relaxed">
              {profileDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Learning Path */}
      <div className="bg-white rounded-xl border border-[#E0E0E0] p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-[#0B0B0B] mb-4">Your Learning Path</h3>
        <LearningPathDisplay learningPath={profile.learningPath} />
      </div>

      {/* Section Scores */}
      <div className="bg-white rounded-xl border border-[#E0E0E0] p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-[#0B0B0B] mb-4">Assessment Results</h3>
        <div className="space-y-5">
          {scoreEntries.map(([section, score]) => (
            <div key={section} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#616161]">
                  {SECTION_LABELS[section]}
                </span>
                <span className="text-sm font-bold text-[#0B0B0B]">{score}%</span>
              </div>
              <div className="h-3 bg-[#E0E0E0] rounded-full overflow-hidden">
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

      {/* Dashboard Preferences */}
      <div className="bg-white rounded-xl border border-[#E0E0E0] p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-[#0B0B0B] mb-4">Dashboard Personalization</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-[#9E9E9E]">Primary Widget</p>
            <p className="text-[#0B0B0B] font-medium">{profile.dashboardLayout.primaryWidget}</p>
          </div>
          <div>
            <p className="text-sm text-[#9E9E9E]">Widget Order</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {profile.dashboardLayout.widgetOrder.map((widget, index) => (
                <span 
                  key={widget}
                  className="px-3 py-1 bg-[#F5F7FA] text-[#616161] rounded-full text-sm"
                >
                  {index + 1}. {widget}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-[#9E9E9E]">Alert Sensitivity</p>
            <p className="text-[#0B0B0B] font-medium capitalize">
              {profile.alertThresholds.riskSensitivity} sensitivity • {profile.alertThresholds.alertFrequency} alerts
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-[#E0E0E0]">
        <a
          href="/trader-dna"
          className="px-4 py-2 text-sm text-[#616161] hover:text-[#E53935] transition-colors"
        >
          ← Retake Assessment
        </a>
        <a
          href="/dashboard"
          className="px-6 py-3 bg-[#E53935] text-white rounded-lg font-medium hover:bg-[#D32F2F] transition-colors"
        >
          Go to Dashboard →
        </a>
      </div>
    </div>
  );
}