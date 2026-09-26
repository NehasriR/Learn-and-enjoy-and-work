import React, { useState } from 'react';
import {
  Video,
  MessageSquare,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  Award,
  Play
} from 'lucide-react';
import { VirtualInterviewRoom } from './VirtualInterviewRoom';

interface InterviewArenaViewProps {
  targetRole: string;
}

export const InterviewArenaView: React.FC<InterviewArenaViewProps> = ({ targetRole }) => {
  return (
    <div className="space-y-6">
      {/* Full Virtual Interaction Experience */}
      <VirtualInterviewRoom targetRole={targetRole} />
    </div>
  );
};
