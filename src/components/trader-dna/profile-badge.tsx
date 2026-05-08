'use client';

import { TraderProfile, PROFILE_TYPE_NAMES } from '@/types/trader-dna';

interface ProfileBadgeProps {
  profile: TraderProfile | null;
}

const PROFILE_ICONS: Record<string, string> = {
  sniper: '🎯',
  analyst: '📊',
  warrior: '⚔️',
  disciplinarian: '📋',
  opportunist: '🔄',
};

export function ProfileBadge({ profile }: ProfileBadgeProps) {
  if (!profile) {
    // No profile - show call to action
    return (
      <a
        href="/trader-dna"
        className="flex items-center gap-2 px-3 py-2 bg-[#E53935]/10 hover:bg-[#E53935]/20 rounded-lg transition-colors group"
        title="Complete your Trader DNA Assessment"
      >
        <div className="w-8 h-8 rounded-full bg-[#E53935] flex items-center justify-center">
          <span className="text-white text-sm">?</span>
        </div>
        <div className="hidden sm:block">
          <p className="text-xs font-medium text-[#E53935]">Complete Assessment</p>
          <p className="text-xs text-[#616161]">Discover your trading DNA</p>
        </div>
      </a>
    );
  }

  const profileName = PROFILE_TYPE_NAMES[profile.type];
  const icon = PROFILE_ICONS[profile.type];

  return (
    <a
      href="/profile"
      className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-[#F5F7FA] rounded-lg border border-[#E0E0E0] transition-colors group"
      title={`Your profile: ${profileName}`}
    >
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E53935] to-[#FF6B6B] flex items-center justify-center">
        <span className="text-white text-sm">{icon}</span>
      </div>
      <div className="hidden sm:block">
        <p className="text-xs font-medium text-[#0B0B0B] group-hover:text-[#E53935] transition-colors">
          {profileName}
        </p>
        <p className="text-xs text-[#9E9E9E]">View profile</p>
      </div>
    </a>
  );
}