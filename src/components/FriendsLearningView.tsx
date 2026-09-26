import React, { useState, useEffect } from 'react';
import {
  Users,
  Flame,
  Swords,
  Clock,
  Sparkles,
  Send,
  Plus,
  CheckCircle2,
  AlertCircle,
  Trophy,
  Coffee,
  Volume2,
  Check,
  UserCheck,
  MessageSquare,
  Zap,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, StudyFriend, StudyRoomMessage } from '../types';
import { initialFriends, initialRoomMessages, peerDuelQuestions } from '../data/friendsData';
import { addXp, recordActivityStreak } from '../services/storage';

interface FriendsLearningViewProps {
  profile: UserProfile;
}

export const FriendsLearningView: React.FC<FriendsLearningViewProps> = ({ profile }) => {
  const [activeTab, setActiveTab] = useState<'circle' | 'room' | 'duel'>('circle');
  const [friends, setFriends] = useState<StudyFriend[]>(initialFriends);
  const [roomMessages, setRoomMessages] = useState<StudyRoomMessage[]>(initialRoomMessages);
  const [newMsgText, setNewMsgText] = useState('');
  const [myActivityStatus, setMyActivityStatus] = useState('Solving Two-Pointer DSA & Preparing for Tech Interview');

  // Add friend modal
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [newFriendHandle, setNewFriendHandle] = useState('');
  const [newFriendName, setNewFriendName] = useState('');
  const [newFriendRole, setNewFriendRole] = useState('Software Developer');

  // Nudge notification
  const [nudgedFriendId, setNudgedFriendId] = useState<string | null>(null);

  // Synchronized Room Timer
  const [roomTimerActive, setRoomTimerActive] = useState(false);
  const [roomSecondsLeft, setRoomSecondsLeft] = useState(25 * 60);

  // Peer Duel State
  const [duelOpponent, setDuelOpponent] = useState<StudyFriend>(initialFriends[0]);
  const [duelActive, setDuelActive] = useState(false);
  const [duelFinished, setDuelFinished] = useState(false);
  const [duelRound, setDuelRound] = useState(0);
  const [duelUserScore, setDuelUserScore] = useState(0);
  const [duelOpponentScore, setDuelOpponentScore] = useState(0);
  const [selectedDuelOption, setSelectedDuelOption] = useState<number | null>(null);
  const [roundSubmitted, setRoundSubmitted] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (roomTimerActive && roomSecondsLeft > 0) {
      interval = setInterval(() => setRoomSecondsLeft((s) => s - 1), 1000);
    } else if (roomSecondsLeft === 0 && roomTimerActive) {
      setRoomTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [roomTimerActive, roomSecondsLeft]);

  const handleNudge = (friend: StudyFriend) => {
    setNudgedFriendId(friend.id);
    setTimeout(() => setNudgedFriendId(null), 2500);
  };

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFriendName.trim()) return;

    const created: StudyFriend = {
      id: `f-${Date.now()}`,
      name: newFriendName,
      handle: newFriendHandle.startsWith('@') ? newFriendHandle : `@${newFriendHandle || 'student'}`,
      avatar: newFriendName[0].toUpperCase(),
      college: profile.college,
      targetRole: newFriendRole,
      streakDays: 1,
      xp: 400,
      readiness: 50,
      currentActivity: 'Just joined the study circle!',
      status: 'Studying',
      lastActive: 'Just now',
    };

    setFriends([created, ...friends]);
    setNewFriendName('');
    setNewFriendHandle('');
    setShowAddFriend(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsgText.trim()) return;

    const newMsg: StudyRoomMessage = {
      id: `msg-${Date.now()}`,
      senderName: profile.name,
      avatar: profile.name ? profile.name[0] : 'U',
      text: newMsgText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'chat',
    };

    setRoomMessages([...roomMessages, newMsg]);
    setNewMsgText('');
  };

  // Start Peer Duel
  const startDuelWith = (friend: StudyFriend) => {
    setDuelOpponent(friend);
    setDuelActive(true);
    setDuelFinished(false);
    setDuelRound(0);
    setDuelUserScore(0);
    setDuelOpponentScore(0);
    setSelectedDuelOption(null);
    setRoundSubmitted(false);
    setActiveTab('duel');
  };

  const submitDuelAnswer = () => {
    if (selectedDuelOption === null) return;
    setRoundSubmitted(true);

    const currentQ = peerDuelQuestions[duelRound];
    const isUserCorrect = selectedDuelOption === currentQ.correctIndex;
    
    // Opponent has 75% accuracy simulation
    const opponentCorrect = Math.random() > 0.3;

    if (isUserCorrect) {
      setDuelUserScore((prev) => prev + 100);
    }
    if (opponentCorrect) {
      setDuelOpponentScore((prev) => prev + 100);
    }
  };

  const handleNextDuelRound = () => {
    if (duelRound < peerDuelQuestions.length - 1) {
      setDuelRound((r) => r + 1);
      setSelectedDuelOption(null);
      setRoundSubmitted(false);
    } else {
      setDuelFinished(true);
      setDuelActive(false);
      addXp(60);
      recordActivityStreak('coding');
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  const formatRoomTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-400 font-medium">
            <span>Collaborative Placement Hub</span>
            <span aria-hidden="true">·</span>
            <span className="text-indigo-400">{profile.college}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
            Friends in Learning
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Keep each other consistent, co-work in silent virtual study rooms, and sharpen problem-solving with friendly 3-minute technical duels.
          </p>
        </div>

        {/* Action Button: Add Study Partner */}
        <div className="flex items-center space-x-2 self-start md:self-center">
          <button
            onClick={() => setShowAddFriend(true)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-400" />
            <span>Add Study Partner</span>
          </button>
        </div>
      </div>

      {/* Clean Segmented Navigation Controls */}
      <div className="flex items-center space-x-1 p-1 bg-slate-900 border border-slate-800 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('circle')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'circle'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Study Circle & Leaderboard</span>
        </button>

        <button
          onClick={() => setActiveTab('room')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'room'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span>Virtual Co-Working Room</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
        </button>

        <button
          onClick={() => setActiveTab('duel')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'duel'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Swords className="w-3.5 h-3.5 text-amber-400" />
          <span>1v1 Peer Skill Duel</span>
        </button>
      </div>

      {/* TAB 1: STUDY CIRCLE & LEADERBOARD */}
      {activeTab === 'circle' && (
        <div className="space-y-6">
          
          {/* My Shared Focus Card */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Your Shared Preparation Focus:
              </span>
              <p className="text-sm font-semibold text-white">{myActivityStatus}</p>
              <div className="flex items-center space-x-3 text-xs text-slate-400 pt-0.5">
                <span className="flex items-center space-x-1 text-orange-400 font-semibold">
                  <Flame className="w-3.5 h-3.5 fill-orange-500" />
                  <span>{profile.streak.currentDays}d Streak</span>
                </span>
                <span>·</span>
                <span>{profile.overallReadiness}% Readiness</span>
                <span>·</span>
                <span>{profile.xp} XP</span>
              </div>
            </div>

            <button
              onClick={() => {
                const updated = prompt('Update your current study focus activity:', myActivityStatus);
                if (updated) setMyActivityStatus(updated);
              }}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-medium self-start sm:self-center transition-colors cursor-pointer"
            >
              Update Focus Status
            </button>
          </div>

          {/* Friends List with Active Tasks and Duels */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>{friends.length} Study Partners in Circle</span>
              <span>Sorted by active consistency</span>
            </div>

            {friends.map((friend) => {
              const isStudying = friend.status === 'Studying' || friend.status === 'Solving DSA' || friend.status === 'In Mock Interview';

              return (
                <div
                  key={friend.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-750 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start space-x-3.5 min-w-0">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm text-indigo-300">
                        {friend.avatar}
                      </div>
                      {isStudying && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" title="Online & Studying" />
                      )}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h2 className="font-bold text-sm text-white truncate">{friend.name}</h2>
                        <span className="text-xs text-slate-400">{friend.handle}</span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span className="text-xs text-indigo-400">{friend.targetRole}</span>
                      </div>

                      <p className="text-xs text-slate-300 font-medium">
                        "{friend.currentActivity}"
                      </p>

                      <div className="flex items-center space-x-3 text-[11px] text-slate-400 pt-0.5">
                        <span className="text-orange-400 font-semibold flex items-center space-x-0.5">
                          <Flame className="w-3 h-3 fill-orange-500" />
                          <span>{friend.streakDays}d</span>
                        </span>
                        <span>·</span>
                        <span>{friend.xp} XP</span>
                        <span>·</span>
                        <span className="text-slate-400">{friend.readiness}% Ready</span>
                        <span>·</span>
                        <span className="text-slate-500">{friend.lastActive}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons: Nudge & Duel */}
                  <div className="flex items-center space-x-2 self-end sm:self-center flex-shrink-0">
                    <button
                      onClick={() => handleNudge(friend)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                        nudgedFriendId === friend.id
                          ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                          : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700'
                      }`}
                    >
                      {nudgedFriendId === friend.id ? '✓ Nudged!' : 'High-Five 🙌'}
                    </button>

                    <button
                      onClick={() => startDuelWith(friend)}
                      className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center space-x-1.5 shadow-sm cursor-pointer"
                    >
                      <Swords className="w-3.5 h-3.5" />
                      <span>Challenge to Duel</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* TAB 2: VIRTUAL CO-WORKING ROOM */}
      {activeTab === 'room' && (
        <div className="space-y-6">
          
          {/* Room Header & Synced Pomodoro */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>SILENT CO-WORKING FOCUS ROOM</span>
              </div>
              <h2 className="text-xl font-bold text-white">NIT Campus Placement Study Room #1</h2>
              <p className="text-xs text-slate-400">
                Synchronized 25-minute quiet focus sprints. Study alongside peers without distractions.
              </p>
            </div>

            {/* Shared Timer Widget */}
            <div className="flex items-center space-x-4 bg-slate-850 p-4 rounded-2xl border border-slate-800 self-start md:self-center">
              <div className="text-right">
                <span className="text-xs text-slate-400 block font-medium">Sprint Clock</span>
                <span className="text-2xl font-mono font-black text-white">{formatRoomTimer(roomSecondsLeft)}</span>
              </div>
              <button
                onClick={() => setRoomTimerActive(!roomTimerActive)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  roomTimerActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
                }`}
              >
                {roomTimerActive ? 'Pause Timer' : 'Start Focus Sprint'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Active Peers in Room (7 cols) */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-bold text-white text-sm">Present in the Room ({friends.filter(f => f.status !== 'Offline').length + 1})</h3>
                <span className="text-xs text-slate-400">Silent Focus Mode</span>
              </div>

              <div className="space-y-3">
                {/* You */}
                <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/30 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">
                      {profile.name ? profile.name[0] : 'Y'}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white">{profile.name} (You)</span>
                      <p className="text-[11px] text-slate-300">{myActivityStatus}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-400">In Focus</span>
                </div>

                {/* Other Friends in room */}
                {friends.filter(f => f.status !== 'Offline').map((friend) => (
                  <div
                    key={friend.id}
                    className="p-3.5 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-indigo-300 flex-shrink-0">
                        {friend.avatar}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-white truncate block">{friend.name}</span>
                        <p className="text-[11px] text-slate-400 truncate">{friend.currentActivity}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-medium text-slate-400 flex-shrink-0 ml-2">{friend.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Silent Motivation Chat / Milestones Feed (5 cols) */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4">
              <div className="pb-3 border-b border-slate-800">
                <h3 className="font-bold text-white text-sm">Study Room Motivation Stream</h3>
                <p className="text-[11px] text-slate-400">Share solved milestones & encouragement</p>
              </div>

              {/* Messages list */}
              <div className="flex-1 space-y-3 overflow-y-auto max-h-72 text-xs">
                {roomMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-xl border leading-relaxed ${
                      msg.type === 'milestone'
                        ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                        : 'bg-slate-850 border-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold text-[11px] text-slate-400 mb-1">
                      <span>{msg.senderName}</span>
                      <span>{msg.time}</span>
                    </div>
                    <p>{msg.text}</p>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="pt-2 flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Share a milestone or focus goal..."
                  value={newMsgText}
                  onChange={(e) => setNewMsgText(e.target.value)}
                  className="flex-1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!newMsgText.trim()}
                  className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </div>

        </div>
      )}

      {/* TAB 3: 1V1 PEER SKILL DUEL */}
      {activeTab === 'duel' && (
        <div className="space-y-6">
          
          {/* Duel Arena Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-md">
            
            {/* Duel Scoreboard */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-800">
              {/* You */}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center font-bold text-white text-base shadow-sm">
                  {profile.name ? profile.name[0] : 'Y'}
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium">You</span>
                  <h3 className="font-bold text-white text-base leading-tight">{profile.name}</h3>
                  <span className="text-lg font-black text-indigo-400">{duelUserScore} pts</span>
                </div>
              </div>

              {/* Versus Badge */}
              <div className="text-center px-4 py-1.5 rounded-xl bg-slate-800 border border-slate-700">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  Round {duelRound + 1} of 3
                </span>
                <span className="text-[10px] text-slate-400">1v1 Rapid Duel</span>
              </div>

              {/* Opponent */}
              <div className="flex items-center space-x-3 text-right">
                <div>
                  <span className="text-xs text-slate-400 font-medium">Opponent</span>
                  <h3 className="font-bold text-white text-base leading-tight">{duelOpponent.name}</h3>
                  <span className="text-lg font-black text-purple-400">{duelOpponentScore} pts</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center font-bold text-white text-base shadow-sm">
                  {duelOpponent.avatar}
                </div>
              </div>
            </div>

            {/* Duel Question Stage */}
            {!duelFinished ? (
              <div className="space-y-5">
                {(() => {
                  const currentQ = peerDuelQuestions[duelRound];

                  return (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400">
                        <span>TOPIC: {currentQ.topic}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-slate-400">100 Points per question</span>
                      </div>

                      <h4 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                        {currentQ.question}
                      </h4>

                      {/* Options */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        {currentQ.options.map((opt, idx) => {
                          const isSelected = selectedDuelOption === idx;
                          let btnStyle = 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-slate-600';

                          if (roundSubmitted) {
                            if (idx === currentQ.correctIndex) {
                              btnStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200';
                            } else if (isSelected) {
                              btnStyle = 'bg-rose-950/40 border-rose-500 text-rose-200';
                            }
                          } else if (isSelected) {
                            btnStyle = 'bg-indigo-600/30 border-indigo-500 text-indigo-200';
                          }

                          return (
                            <button
                              key={idx}
                              disabled={roundSubmitted}
                              onClick={() => setSelectedDuelOption(idx)}
                              className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                            >
                              <span>{opt}</span>
                              {roundSubmitted && idx === currentQ.correctIndex && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 ml-2" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Round Action & Explanation */}
                      <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-800">
                        {!roundSubmitted ? (
                          <button
                            disabled={selectedDuelOption === null}
                            onClick={submitDuelAnswer}
                            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-xs shadow-md shadow-indigo-600/30 cursor-pointer"
                          >
                            Lock in Answer
                          </button>
                        ) : (
                          <div className="space-y-1 text-xs flex-1">
                            <p className="font-bold text-slate-300">
                              {selectedDuelOption === currentQ.correctIndex ? '✓ Correct! +100 Points earned.' : '✗ Missed this round.'}
                            </p>
                            <p className="text-slate-400">{currentQ.explanation}</p>
                          </div>
                        )}

                        {roundSubmitted && (
                          <button
                            onClick={handleNextDuelRound}
                            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1.5 self-end transition-all cursor-pointer"
                          >
                            <span>{duelRound < 2 ? 'Next Round →' : 'See Duel Results'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              /* Duel Celebration Card */
              <div className="text-center space-y-6 py-4">
                <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-2xl font-bold border border-amber-500/30">
                  <Trophy className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-2xl font-black text-white">
                    {duelUserScore >= duelOpponentScore ? 'Victory! You Won the Skill Duel' : 'Great Effort! Rematch Soon'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    Final Score: <strong className="text-indigo-400">{duelUserScore} pts</strong> vs {duelOpponent.name}: <strong className="text-purple-400">{duelOpponentScore} pts</strong>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 max-w-sm mx-auto text-xs text-emerald-400 font-semibold flex items-center justify-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>+60 XP earned & streak maintained!</span>
                </div>

                <button
                  onClick={() => {
                    setDuelFinished(false);
                    setDuelActive(false);
                    setActiveTab('circle');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Return to Study Circle
                </button>
              </div>
            )}

          </div>

        </div>
      )}

      {/* Add Partner Modal */}
      {showAddFriend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <form
            onSubmit={handleAddFriend}
            className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Add Study Partner</h3>
              <button
                type="button"
                onClick={() => setShowAddFriend(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Partner Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={newFriendName}
                onChange={(e) => setNewFriendName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">College Handle / ID</label>
              <input
                type="text"
                placeholder="@rahul_cs"
                value={newFriendHandle}
                onChange={(e) => setNewFriendHandle(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Placement Role</label>
              <select
                value={newFriendRole}
                onChange={(e) => setNewFriendRole(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              >
                <option>Software Developer</option>
                <option>Machine Learning Engineer</option>
                <option>Full Stack Developer</option>
                <option>Data Scientist</option>
                <option>Cloud / DevOps</option>
              </select>
            </div>

            <div className="flex justify-end space-x-2 pt-3">
              <button
                type="button"
                onClick={() => setShowAddFriend(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30"
              >
                Add Partner
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
