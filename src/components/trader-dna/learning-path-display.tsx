'use client';

import { LearningPath } from '@/types/trader-dna';

interface LearningPathDisplayProps {
  learningPath: LearningPath;
}

const LEARNING_PATH_CONTENT: Record<LearningPath, { icon: string; title: string; description: string }> = {
  visual: {
    icon: '👁️',
    title: 'Visual Learning',
    description: 'You learn best by watching and observing. Video lessons, chart analysis, and watching experienced traders are your most effective learning methods. Look for video tutorials, webinars, and visual strategy explanations.',
  },
  structured: {
    icon: '📚',
    title: 'Structured Learning',
    description: 'You prefer organized, sequential learning with clear steps and documentation. Written guides, step-by-step courses, and comprehensive documentation work best for you. Build your knowledge systematically through courses and readings.',
  },
  practical: {
    icon: '🛠️',
    title: 'Practical Learning',
    description: 'You learn by doing and practicing. Simulation trading, hands-on exercises, and real-world application of strategies are your most effective learning methods. Practice with demo accounts and test strategies in live environments.',
  },
};

export function LearningPathDisplay({ learningPath }: LearningPathDisplayProps) {
  const content = LEARNING_PATH_CONTENT[learningPath];

  return (
    <div className="bg-[#F5F7FA] rounded-lg p-4 border-l-4 border-[#E53935]">
      <div className="flex items-start gap-3">
        <span className="text-2xl">{content.icon}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-[#0B0B0B]">{content.title}</h3>
            <span className="text-xs bg-[#E53935]/10 text-[#E53935] px-2 py-0.5 rounded-full">
              Recommended
            </span>
          </div>
          <p className="text-sm text-[#616161] mt-1 leading-relaxed">
            {content.description}
          </p>
        </div>
      </div>
    </div>
  );
}