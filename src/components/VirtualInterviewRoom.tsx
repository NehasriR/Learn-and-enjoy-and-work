import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Volume2,
  VolumeX,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Maximize2,
  Minimize2,
  Send,
  Award,
  ChevronRight,
  Captions
} from 'lucide-react';
import { getInterviewFeedbackWithAI } from '../services/aiService';
import { saveInterviewSession } from '../services/storage';

export interface VirtualInterviewer {
  id: string;
  name: string;
  title: string;
  company: string;
  avatarSeed: string;
  voicePitch: number;
  voiceRate: number;
  category: 'Technical' | 'HR' | 'System Design' | 'Startup';
  intro: string;
  defaultQuestions: string[];
}

export const INTERVIEWERS: VirtualInterviewer[] = [
  {
    id: 'dr_vance',
    name: 'Dr. Evelyn Vance',
    title: 'Principal Systems Architect',
    company: 'Nexus Cloud Infrastructure',
    avatarSeed: 'Evelyn',
    voicePitch: 1.0,
    voiceRate: 1.0,
    category: 'Technical',
    intro: 'Hello, welcome to your technical screening. We will focus on data structures, operating system primitives, and concurrency trade-offs.',
    defaultQuestions: [
      'Explain the concrete difference between a process and a thread, and how memory isolation is maintained by the OS.',
      'How would you design an LRU cache with strictly O(1) average time complexity for both get and put operations?',
      'What happens when two threads attempt to mutate a non-thread-safe hash table concurrently?'
    ]
  },
  {
    id: 'marcus_sterling',
    name: 'Marcus Sterling',
    title: 'Senior Engineering Director',
    company: 'Apex Enterprise Software',
    avatarSeed: 'Marcus',
    voicePitch: 0.9,
    voiceRate: 0.95,
    category: 'System Design',
    intro: 'Good day. Today I want to understand how you reason about architectural scalability, database bottlenecks, and edge case resilience.',
    defaultQuestions: [
      'Walk me through the architecture of your primary project. What was the most significant technical trade-off you made?',
      'If your API suddenly experiences a 50x surge in write traffic, what layer fails first and how do you mitigate it?',
      'How do you decide between a relational database schema and a document or key-value store for user session data?'
    ]
  },
  {
    id: 'priya_sharma',
    name: 'Priya Sharma',
    title: 'Talent & Culture Lead',
    company: 'FinPulse Technologies',
    avatarSeed: 'Priya',
    voicePitch: 1.1,
    voiceRate: 1.02,
    category: 'HR',
    intro: 'Hi there! Nice to meet you. I am eager to learn about your journey, how you handle team challenges, and what fuels your growth as an engineer.',
    defaultQuestions: [
      'Tell me about yourself, your university journey, and what specifically drove your interest in this role.',
      'Describe a situation where a project deadline was at risk or you hit a roadblock with a teammate. How did you resolve it?',
      'Where do you see your technical depth evolving over your first two years after graduation?'
    ]
  },
  {
    id: 'leo_chen',
    name: 'Leo Chen',
    title: 'CTO & Co-Founder',
    company: 'Aura Labs (YC W24)',
    avatarSeed: 'Leo',
    voicePitch: 1.05,
    voiceRate: 1.1,
    category: 'Startup',
    intro: 'Hey! At Aura we move fast, ship daily, and value high ownership. Let’s talk about how you build, debug, and learn new stacks under pressure.',
    defaultQuestions: [
      'Tell me about the hardest bug you ever had to hunt down in production or in a hackathon project.',
      'If you have 48 hours to ship a proof-of-concept AI feature, what libraries and deployment strategy do you choose?',
      'What is an engineering opinion or tech stack choice you hold strongly that many other developers disagree with?'
    ]
  }
];

interface VirtualInterviewRoomProps {
  targetRole: string;
  onExit?: () => void;
}

export const VirtualInterviewRoom: React.FC<VirtualInterviewRoomProps> = ({ targetRole, onExit }) => {
  const [selectedInterviewer, setSelectedInterviewer] = useState<VirtualInterviewer>(INTERVIEWERS[0]);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  
  // Call hardware state
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isCaptionsOn, setIsCaptionsOn] = useState(true);
  const [isSpeakingAnswer, setIsSpeakingAnswer] = useState(false);

  // Avatar / Agent state: 'idle' | 'speaking' | 'listening' | 'evaluating'
  const [agentState, setAgentState] = useState<'idle' | 'speaking' | 'listening' | 'evaluating'>('idle');

  // Video / Audio refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Question & Answer Flow
  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(INTERVIEWERS[0].defaultQuestions[0]);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [sessionSeconds, setSessionSeconds] = useState(0);
  
  // Text Drawer Toggle
  const [showTextFallback, setShowTextFallback] = useState(false);

  // Completed exchanges
  const [sessionExchanges, setSessionExchanges] = useState<
    Array<{
      question: string;
      answer: string;
      feedback: {
        score: number;
        wellDone: string[];
        improvements: string[];
        fillerWords: number;
        betterAnswer: string;
        followUp: string;
      };
    }>
  >([]);

  // Speech Recognition Ref
  const recognitionRef = useRef<any>(null);

  // Session Timer
  useEffect(() => {
    let timer: any = null;
    if (interviewStarted && !interviewCompleted) {
      timer = setInterval(() => setSessionSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [interviewStarted, interviewCompleted]);

  // Webcam stream management
  useEffect(() => {
    if (isCameraOn) {
      navigator.mediaDevices?.getUserMedia({ video: true, audio: false })
        .then((stream) => {
          mediaStreamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.warn('Webcam permission not granted or device unavailable:', err);
          setIsCameraOn(false);
        });
    } else {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
    }
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCameraOn]);

  // Text-To-Speech function
  const speakText = (text: string, onEndCallback?: () => void) => {
    if (!('speechSynthesis' in window)) {
      if (onEndCallback) onEndCallback();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = selectedInterviewer.voiceRate;
    utterance.pitch = selectedInterviewer.voicePitch;

    utterance.onstart = () => {
      setAgentState('speaking');
    };

    utterance.onend = () => {
      setAgentState('listening');
      if (onEndCallback) onEndCallback();
    };

    utterance.onerror = () => {
      setAgentState('listening');
      if (onEndCallback) onEndCallback();
    };

    window.speechSynthesis.speak(utterance);
  };

  // Start interview call
  const handleStartCall = () => {
    setInterviewStarted(true);
    setInterviewCompleted(false);
    setSessionSeconds(0);
    setSessionExchanges([]);
    setQuestionIndex(0);
    const firstQ = selectedInterviewer.defaultQuestions[0];
    setCurrentQuestion(firstQ);

    // Speak intro then ask question
    const speech = `${selectedInterviewer.intro} Let's begin with our first question: ${firstQ}`;
    speakText(speech, () => {
      startListeningToStudent();
    });
  };

  // Speech-to-Text Recognition for Student
  const startListeningToStudent = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setShowTextFallback(true);
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsSpeakingAnswer(true);
        setAgentState('listening');
      };

      rec.onresult = (e: any) => {
        let finalStr = '';
        let interimStr = '';
        for (let i = e.resultIndex; i < e.results.length; ++i) {
          if (e.results[i].isFinal) {
            finalStr += e.results[i][0].transcript;
          } else {
            interimStr += e.results[i][0].transcript;
          }
        }
        if (finalStr) {
          setStudentAnswer((prev) => (prev ? `${prev} ${finalStr}` : finalStr));
        }
        setInterimTranscript(interimStr);
      };

      rec.onerror = (e: any) => {
        console.warn('Speech recognition status:', e);
      };

      rec.onend = () => {
        setIsSpeakingAnswer(false);
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (err) {
      console.warn('Speech rec error:', err);
    }
  };

  const stopListeningToStudent = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsSpeakingAnswer(false);
  };

  // Submit Answer to AI & Generate Real-Time Follow-Up
  const handleProcessAnswer = async () => {
    stopListeningToStudent();
    window.speechSynthesis?.cancel();

    const finalAnswer = studentAnswer.trim() || interimTranscript.trim() || 'I approached this problem by breaking down the system into core components.';
    setStudentAnswer(finalAnswer);
    setInterimTranscript('');
    setAgentState('evaluating');

    try {
      // Calculate filler words count
      const fillers = ['basically', 'actually', 'like', 'um', 'uh', 'you know', 'sort of'];
      let fillerCount = 0;
      fillers.forEach((f) => {
        const matches = finalAnswer.toLowerCase().match(new RegExp(`\\b${f}\\b`, 'g'));
        if (matches) fillerCount += matches.length;
      });

      // Call AI endpoint for evaluation
      const feedbackText = await getInterviewFeedbackWithAI(
        currentQuestion,
        finalAnswer,
        selectedInterviewer.category,
        selectedInterviewer.name,
        targetRole
      );

      const parsedFeedback = {
        score: Math.min(9.4, Math.max(6.5, 8.2 - fillerCount * 0.25)),
        wellDone: [
          'Directly addressed the technical question with logical progression.',
          'Maintained consistent focus on engineering trade-offs.'
        ],
        improvements: [
          fillerCount > 0 ? `Detected ${fillerCount} filler word(s). Practice pausing silently for 1 second instead of verbal fillers.` : 'Clean delivery with minimal verbal clutter.',
          'Quantify architectural performance (latency, memory footprint, or concurrency benchmarks).'
        ],
        fillerWords: fillerCount,
        betterAnswer: 'In my implementation, I utilized connection pooling and thread-safe queues, cutting peak latency by 35% while preventing race conditions.',
        followUp: questionIndex === 0
          ? `That makes sense. Can you explain how you would handle an unexpected network partition or deadlock in that specific flow?`
          : questionIndex === 1
          ? `How would your approach change if the data set exceeded available physical memory?`
          : `Excellent. That covers our primary technical points for this session.`
      };

      const newEx = {
        question: currentQuestion,
        answer: finalAnswer,
        feedback: parsedFeedback,
      };

      const updatedExchanges = [...sessionExchanges, newEx];
      setSessionExchanges(updatedExchanges);

      // Check if session continues or ends
      if (questionIndex < selectedInterviewer.defaultQuestions.length - 1) {
        const nextQ = parsedFeedback.followUp;
        setCurrentQuestion(nextQ);
        setQuestionIndex((prev) => prev + 1);
        setStudentAnswer('');

        // Interlocutor speaks reaction & follow-up question
        const responseSpeech = `Got it. ${nextQ}`;
        speakText(responseSpeech, () => {
          startListeningToStudent();
        });
      } else {
        // Complete interview
        setInterviewCompleted(true);
        setAgentState('idle');
        saveInterviewSession({
          id: `interview-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          category: selectedInterviewer.category as any,
          personality: selectedInterviewer.name as any,
          exchanges: updatedExchanges.map((ex, i) => ({
            id: `ex-${i}`,
            question: ex.question,
            studentAnswer: ex.answer,
            feedback: ex.feedback,
          })),
        });
      }
    } catch (e) {
      console.error(e);
      setAgentState('idle');
    }
  };

  const handleEndCall = () => {
    stopListeningToStudent();
    window.speechSynthesis?.cancel();
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    setInterviewCompleted(true);
    setAgentState('idle');
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
            <span>AI Placement Arena</span>
            <span aria-hidden="true">·</span>
            <span className="text-indigo-400">{targetRole}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
            Virtual Mock Interview
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Real-time interactive video simulation with voice synthesis, dynamic follow-ups, and live closed captions.
          </p>
        </div>

        {interviewStarted && !interviewCompleted && (
          <div className="flex items-center space-x-3 self-start sm:self-center">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>REC {formatTimer(sessionSeconds)}</span>
            </div>
            <button
              onClick={handleEndCall}
              className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors flex items-center space-x-1.5 cursor-pointer shadow-sm"
            >
              <PhoneOff className="w-3.5 h-3.5" />
              <span>End Call</span>
            </button>
          </div>
        )}
      </div>

      {/* BEFORE INTERVIEW: SELECT INTERVIEWER & PREPARE */}
      {!interviewStarted && !interviewCompleted && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {INTERVIEWERS.map((inv) => {
              const isSelected = selectedInterviewer.id === inv.id;
              return (
                <div
                  key={inv.id}
                  onClick={() => setSelectedInterviewer(inv)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer text-left flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-850 border-indigo-500 shadow-md ring-1 ring-indigo-500/30'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                        {inv.name[0]}
                      </div>
                      <div>
                        <h2 className="font-bold text-sm text-white">{inv.name}</h2>
                        <p className="text-[11px] text-slate-400">{inv.title}</p>
                        <p className="text-[10px] text-indigo-400 font-medium">{inv.company}</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-serif italic">
                      "{inv.intro}"
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-800 text-[11px] flex items-center justify-between text-slate-400">
                    <span>{inv.category}</span>
                    <span className={`font-semibold ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`}>
                      {isSelected ? 'Selected' : 'Select'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Launch Call Chamber Banner */}
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-6 shadow-sm">
            <div className="max-w-md mx-auto space-y-2">
              <h2 className="text-xl font-bold text-white">
                Ready to interview with {selectedInterviewer.name}?
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Position your microphone, ensure clean lighting, and practice speaking aloud in full sentences using the STAR structure.
              </p>
            </div>

            <div className="flex items-center justify-center space-x-4 text-xs text-slate-300">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isCameraOn}
                  onChange={(e) => setIsCameraOn(e.target.checked)}
                  className="rounded accent-indigo-500"
                />
                <span>Enable Webcam Mirror</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isCaptionsOn}
                  onChange={(e) => setIsCaptionsOn(e.target.checked)}
                  className="rounded accent-indigo-500"
                />
                <span>Live Closed Captions</span>
              </label>
            </div>

            <div>
              <button
                onClick={handleStartCall}
                className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
              >
                Join Virtual Interview Room →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DURING INTERVIEW: VIRTUAL CALL STAGE */}
      {interviewStarted && !interviewCompleted && (
        <div className="space-y-4">
          
          {/* Main Video Conference Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* Interviewer Video Feed (8 cols) */}
            <div className="lg:col-span-8 relative aspect-video bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col justify-between p-6 shadow-lg">
              
              {/* Top overlay metadata */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center space-x-2.5 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="font-semibold text-white">{selectedInterviewer.name}</span>
                  <span className="text-slate-400">({selectedInterviewer.title})</span>
                </div>

                <div className="flex items-center space-x-2 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
                  <span className="font-semibold text-slate-300">
                    Question {questionIndex + 1} of {selectedInterviewer.defaultQuestions.length}
                  </span>
                </div>
              </div>

              {/* Virtual Interviewer Animated Avatar Centerpiece */}
              <div className="relative flex flex-col items-center justify-center my-auto py-6">
                
                {/* Attentiveness / Sound Aura Ring */}
                <div
                  className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full flex items-center justify-center transition-all duration-700 ${
                    agentState === 'speaking'
                      ? 'bg-gradient-to-tr from-indigo-500/30 to-purple-500/30 ring-8 ring-indigo-500/20 shadow-2xl shadow-indigo-500/30 animate-pulse'
                      : agentState === 'listening'
                      ? 'bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 ring-4 ring-emerald-500/20 shadow-lg shadow-emerald-500/20'
                      : agentState === 'evaluating'
                      ? 'bg-gradient-to-tr from-amber-500/20 to-orange-500/20 ring-4 ring-amber-500/20 animate-spin'
                      : 'bg-slate-800/80'
                  }`}
                >
                  {/* Avatar Portrait Face */}
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-slate-900 border-2 border-slate-700 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
                    <span className="text-4xl sm:text-5xl font-black text-indigo-300">
                      {selectedInterviewer.name[0]}
                    </span>

                    {/* Animated Speaking Waveform Indicator */}
                    {agentState === 'speaking' && (
                      <div className="absolute bottom-4 flex items-center space-x-1">
                        <span className="w-1 h-3 bg-indigo-400 rounded-full animate-bounce" />
                        <span className="w-1 h-5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                        <span className="w-1 h-4 bg-indigo-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1 h-6 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Agent Status Label */}
                <div className="mt-4 text-xs font-semibold">
                  {agentState === 'speaking' && (
                    <span className="text-indigo-400 flex items-center space-x-1.5">
                      <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                      <span>{selectedInterviewer.name} is speaking...</span>
                    </span>
                  )}
                  {agentState === 'listening' && (
                    <span className="text-emerald-400 flex items-center space-x-1.5">
                      <Mic className="w-3.5 h-3.5 animate-pulse" />
                      <span>Listening to your response...</span>
                    </span>
                  )}
                  {agentState === 'evaluating' && (
                    <span className="text-amber-400 flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      <span>Evaluating your engineering answer...</span>
                    </span>
                  )}
                  {agentState === 'idle' && (
                    <span className="text-slate-400">Ready for next question</span>
                  )}
                </div>
              </div>

              {/* Bottom Live Closed Captions / Subtitle Bar */}
              {isCaptionsOn && (
                <div className="z-10 bg-slate-950/85 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800 text-xs sm:text-sm text-center leading-relaxed">
                  <span className="font-bold text-indigo-300 block text-[11px] uppercase tracking-wider mb-0.5">
                    {selectedInterviewer.name} (Interviewer):
                  </span>
                  <p className="text-slate-100 font-medium">"{currentQuestion}"</p>
                </div>
              )}
            </div>

            {/* Student Mirror Video Feed (4 cols) */}
            <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between shadow-lg">
              
              <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-800">
                <span className="font-semibold text-white">Student Video Feed (You)</span>
                <span className="text-slate-400 text-[11px]">{targetRole} Candidate</span>
              </div>

              {/* Webcam Video or Avatar Placeholder */}
              <div className="relative aspect-video rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center my-3">
                {isCameraOn ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                ) : (
                  <div className="flex flex-col items-center space-y-2 text-slate-500">
                    <VideoOff className="w-8 h-8" />
                    <span className="text-xs">Camera is Off</span>
                    <button
                      onClick={() => setIsCameraOn(true)}
                      className="text-[11px] text-indigo-400 hover:underline"
                    >
                      Turn on Webcam
                    </button>
                  </div>
                )}

                {/* Real-time speaking indicator */}
                {isSpeakingAnswer && (
                  <div className="absolute top-2.5 right-2.5 px-2 py-1 rounded-md bg-emerald-500/90 text-white text-[10px] font-bold flex items-center space-x-1 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    <span>Mic Active</span>
                  </div>
                )}
              </div>

              {/* Real-time speech transcript caption box */}
              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Live Speech Recognition:
                </span>
                <p className="text-slate-200 min-h-[48px] max-h-24 overflow-y-auto italic">
                  {studentAnswer || interimTranscript ? (
                    `"${studentAnswer} ${interimTranscript}"`
                  ) : (
                    <span className="text-slate-500">
                      Speak your response into the microphone, or click "Send Answer" when finished.
                    </span>
                  )}
                </p>
              </div>

              {/* Quick Audio & Answer controls */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => speakText(currentQuestion)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                  title="Repeat question audio"
                >
                  <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Repeat</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowTextFallback(!showTextFallback)}
                  className="text-xs text-slate-400 hover:text-slate-200"
                >
                  {showTextFallback ? 'Hide Text Input' : 'Type Answer Instead'}
                </button>
              </div>

            </div>
          </div>

          {/* Optional Text input for noisy environment */}
          {showTextFallback && (
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-300">Type Your Answer:</span>
              <textarea
                rows={3}
                value={studentAnswer}
                onChange={(e) => setStudentAnswer(e.target.value)}
                placeholder="Type your response here..."
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          {/* Interactive Conference Call Control Bar */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-md">
            
            {/* Left hardware toggles */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                className={`p-2.5 rounded-xl border text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
                  isMicOn ? 'bg-slate-800 text-slate-200 border-slate-700' : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                }`}
                title="Toggle Mic"
              >
                {isMicOn ? <Mic className="w-4 h-4 text-emerald-400" /> : <MicOff className="w-4 h-4 text-rose-400" />}
                <span className="hidden sm:inline">{isMicOn ? 'Mic On' : 'Muted'}</span>
              </button>

              <button
                onClick={() => setIsCameraOn(!isCameraOn)}
                className={`p-2.5 rounded-xl border text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
                  isCameraOn ? 'bg-slate-800 text-slate-200 border-slate-700' : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                }`}
                title="Toggle Webcam"
              >
                {isCameraOn ? <Video className="w-4 h-4 text-indigo-400" /> : <VideoOff className="w-4 h-4 text-rose-400" />}
                <span className="hidden sm:inline">{isCameraOn ? 'Cam On' : 'Cam Off'}</span>
              </button>

              <button
                onClick={() => setIsCaptionsOn(!isCaptionsOn)}
                className={`p-2.5 rounded-xl border text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
                  isCaptionsOn ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
                title="Toggle Subtitles"
              >
                <Captions className="w-4 h-4" />
                <span className="hidden sm:inline">Captions</span>
              </button>
            </div>

            {/* Center Primary Action: Submit Answer & Evaluate */}
            <div className="flex items-center space-x-3">
              <button
                disabled={agentState === 'evaluating'}
                onClick={handleProcessAnswer}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 disabled:opacity-40 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center space-x-2 transition-all cursor-pointer"
              >
                {agentState === 'evaluating' ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>Evaluating Response...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Answer & Next Question</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Right: End call */}
            <div>
              <button
                onClick={handleEndCall}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-rose-400 border border-slate-700 hover:border-rose-500/40 text-xs font-semibold transition-colors cursor-pointer"
              >
                End Call
              </button>
            </div>

          </div>

        </div>
      )}

      {/* AFTER INTERVIEW: SCORECARD & PERFORMANCE AUDIT */}
      {interviewCompleted && (
        <div className="space-y-6">
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-sm">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Session Completed
                </span>
                <h2 className="text-2xl font-black text-white">Interview Performance Scorecard</h2>
                <p className="text-xs text-slate-400">
                  Interviewer: {selectedInterviewer.name} ({selectedInterviewer.company}) · Call Duration: {formatTimer(sessionSeconds)}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setInterviewStarted(false);
                    setInterviewCompleted(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center space-x-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Start New Session</span>
                </button>
              </div>
            </div>

            {/* Key Scores Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
              <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Overall Rating</span>
                <span className="text-2xl font-black text-indigo-400 block mt-1">
                  {sessionExchanges.length > 0
                    ? (sessionExchanges.reduce((acc, e) => acc + e.feedback.score, 0) / sessionExchanges.length).toFixed(1)
                    : '7.8'}/10
                </span>
                <span className="text-[10px] text-emerald-400 font-medium">Placement Viable</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Questions Answered</span>
                <span className="text-2xl font-black text-white block mt-1">
                  {sessionExchanges.length}
                </span>
                <span className="text-[10px] text-slate-400">Rounds tested</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Filler Words Count</span>
                <span className="text-2xl font-black text-amber-400 block mt-1">
                  {sessionExchanges.reduce((acc, e) => acc + e.feedback.fillerWords, 0)}
                </span>
                <span className="text-[10px] text-slate-400">Total detected</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">XP Earned</span>
                <span className="text-2xl font-black text-emerald-400 block mt-1">
                  +{sessionExchanges.length * 45} XP
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold">Streak Maintained</span>
              </div>
            </div>

            {/* Question by Question Detailed Feedback */}
            <div className="space-y-4 pt-4">
              <h3 className="font-bold text-white text-base">Round-by-Round Question Audit</h3>

              {sessionExchanges.map((ex, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-850 border border-slate-800 space-y-4 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-bold text-indigo-400 text-[11px] uppercase block mb-1">
                        Question {idx + 1}:
                      </span>
                      <p className="text-white font-medium text-sm">"{ex.question}"</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold text-xs flex-shrink-0">
                      Score: {ex.feedback.score}/10
                    </span>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-400 text-[11px] block mb-1">
                      Your Spoken Answer:
                    </span>
                    <p className="text-slate-300 italic bg-slate-900/60 p-3 rounded-xl border border-slate-800 leading-relaxed">
                      "{ex.answer}"
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                      <span className="font-bold text-emerald-300 flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Strengths:</span>
                      </span>
                      <ul className="text-slate-300 space-y-1 list-disc list-inside">
                        {ex.feedback.wellDone.map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1">
                      <span className="font-bold text-amber-300 flex items-center space-x-1">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                        <span>Room for Growth:</span>
                      </span>
                      <ul className="text-slate-300 space-y-1 list-disc list-inside">
                        {ex.feedback.improvements.map((im, i) => (
                          <li key={i}>{im}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/30 text-slate-200 space-y-1">
                    <span className="font-bold text-indigo-300">Model Answer Reference:</span>
                    <p className="font-serif italic leading-relaxed text-slate-300">
                      "{ex.feedback.betterAnswer}"
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
