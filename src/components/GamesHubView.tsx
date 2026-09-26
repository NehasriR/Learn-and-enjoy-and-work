import React, { useState } from 'react';
import {
  Gamepad2,
  Bug,
  Database,
  Timer,
  Zap,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Award,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Code
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  codeDetectiveProblems,
  sqlQuestProblems,
  dsaRaceProblems,
  outputPredictorProblems,
  conceptMatchCards,
} from '../data/gamesAndQuestions';
import { addXp, recordActivityStreak } from '../services/storage';

type GameMode =
  | 'detective'
  | 'sql_quest'
  | 'dsa_race'
  | 'output_predictor'
  | 'flash_battle'
  | 'concept_match'
  | 'debug_challenge'
  | 'career_quest';

const GAMES_LIST = [
  { id: 'detective' as GameMode, title: 'Game 1: Code Detective', icon: Bug, tag: 'Debugging', desc: 'Inspect tricky Python/JS snippets and catch the subtle bug.' },
  { id: 'sql_quest' as GameMode, title: 'Game 2: SQL Quest', icon: Database, tag: 'Queries', desc: 'Craft optimal queries for second-highest salary, window aggregations & joins.' },
  { id: 'dsa_race' as GameMode, title: 'Game 3: DSA Race', icon: Timer, tag: 'Data Structures', desc: 'Match engineering requirements to optimal O(1) or O(log N) structures.' },
  { id: 'output_predictor' as GameMode, title: 'Game 4: Output Predictor', icon: Code, tag: 'Execution', desc: 'Predict exact console outputs for closure traps and reference scopes.' },
  { id: 'flash_battle' as GameMode, title: 'Game 5: Flash Battle', icon: Zap, tag: 'Rapid-Fire', desc: '10-second rapid-fire flashcards to build split-second interview recall.' },
  { id: 'concept_match' as GameMode, title: 'Game 6: Concept Match', icon: Sparkles, tag: 'Foundations', desc: 'Connect architectural concepts with their real-world production use-cases.' },
  { id: 'debug_challenge' as GameMode, title: 'Game 7: Debug Challenge', icon: Bug, tag: 'Algorithms', desc: 'Repair broken recursive base cases and memory leaks.' },
  { id: 'career_quest' as GameMode, title: 'Game 8: AI Career Quest', icon: Award, tag: 'System Choice', desc: 'Pick the right database, cache, or pipeline for real startup scenarios.' },
];

export const GamesHubView: React.FC = () => {
  const [activeGame, setActiveGame] = useState<GameMode>('detective');

  // Game 1: Code Detective state
  const [cdIndex, setCdIndex] = useState(0);
  const [cdSelectedLine, setCdSelectedLine] = useState<number | null>(null);
  const [cdChecked, setCdChecked] = useState(false);

  // Game 2: SQL Quest state
  const [sqlIndex, setSqlIndex] = useState(0);
  const [sqlSelected, setSqlSelected] = useState<number | null>(null);
  const [sqlChecked, setSqlChecked] = useState(false);

  // Game 3: DSA Race state
  const [dsaIndex, setDsaIndex] = useState(0);
  const [dsaSelected, setDsaSelected] = useState<number | null>(null);
  const [dsaChecked, setDsaChecked] = useState(false);

  // Game 4: Output Predictor state
  const [opIndex, setOpIndex] = useState(0);
  const [opSelected, setOpSelected] = useState<number | null>(null);
  const [opChecked, setOpChecked] = useState(false);

  const handleCorrectAnswer = (xp: number) => {
    addXp(xp);
    recordActivityStreak('coding');
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch (e) {}
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
              Educational Game Arena
            </span>
            <span className="text-xs text-slate-400">8 Interactive Learning Modules</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Learning Games Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Gamified learning designed for high concept retention. Practice debugging, SQL query puzzles, rapid data structure selection, and output prediction without textbook fatigue.
          </p>
        </div>
      </div>

      {/* 8 Games Selector Grid (Requirement 12) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {GAMES_LIST.map((g) => {
          const Icon = g.icon;
          const isActive = activeGame === g.id;
          return (
            <button
              key={g.id}
              onClick={() => {
                setActiveGame(g.id);
                setCdChecked(false);
                setSqlChecked(false);
                setDsaChecked(false);
                setOpChecked(false);
              }}
              className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                  {g.tag}
                </span>
              </div>
              <div>
                <p className="font-bold text-xs sm:text-sm leading-tight text-white">{g.title}</p>
                <p className="text-[10px] text-slate-400 line-clamp-1 mt-1">{g.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* ACTIVE GAME CANVAS */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
        
        {/* GAME 1: CODE DETECTIVE */}
        {activeGame === 'detective' && (
          <div className="space-y-6">
            {(() => {
              const currentProblem = codeDetectiveProblems[cdIndex];
              const isCorrect = cdSelectedLine === currentProblem.bugLine;

              return (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-emerald-400 uppercase">
                          Case #{cdIndex + 1} • {currentProblem.language}
                        </span>
                        <span className="text-xs text-slate-400">Difficulty: {currentProblem.difficulty}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white mt-0.5">{currentProblem.title}</h3>
                    </div>

                    <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold self-start sm:self-center border border-amber-500/30">
                      +{currentProblem.xp} XP
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300">
                    Analyze the code snippet below. Click on the option that points out the exact bug and why it fails in production.
                  </p>

                  <pre className="p-5 rounded-2xl bg-slate-950 font-mono text-xs text-emerald-300 border border-slate-800 overflow-x-auto leading-relaxed">
                    {currentProblem.snippet}
                  </pre>

                  {/* Options */}
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold text-slate-300 block mb-1">Select the defect:</span>
                    {currentProblem.options.map((opt, i) => {
                      const isSelected = cdSelectedLine === opt.line;
                      let btnStyle = 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600';

                      if (cdChecked) {
                        if (opt.line === currentProblem.bugLine) {
                          btnStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200';
                        } else if (isSelected) {
                          btnStyle = 'bg-rose-950/40 border-rose-500 text-rose-200';
                        }
                      } else if (isSelected) {
                        btnStyle = 'bg-indigo-950/50 border-indigo-500 text-indigo-200';
                      }

                      return (
                        <button
                          key={i}
                          disabled={cdChecked}
                          onClick={() => setCdSelectedLine(opt.line)}
                          className={`w-full p-3.5 rounded-xl border text-left text-xs font-medium transition-all flex items-start justify-between cursor-pointer ${btnStyle}`}
                        >
                          <div>
                            <span className="font-bold text-slate-200">Line {opt.line}: </span>
                            <span>{opt.explanation}</span>
                          </div>
                          {cdChecked && opt.line === currentProblem.bugLine && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Submission and Explanation */}
                  <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {!cdChecked ? (
                      <button
                        disabled={cdSelectedLine === null}
                        onClick={() => {
                          setCdChecked(true);
                          if (cdSelectedLine === currentProblem.bugLine) {
                            handleCorrectAnswer(currentProblem.xp);
                          }
                        }}
                        className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs shadow-md shadow-emerald-600/30 cursor-pointer"
                      >
                        Verify Bug Diagnosis
                      </button>
                    ) : (
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-2">
                          {isCorrect ? (
                            <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Defect Solved! +{currentProblem.xp} XP added.</span>
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-rose-400 flex items-center space-x-1.5">
                              <AlertCircle className="w-4 h-4" />
                              <span>Not quite. Look at the explanation below:</span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
                          <strong className="text-white">Explanation: </strong>
                          {currentProblem.fixExplanation}
                        </p>
                      </div>
                    )}

                    {cdChecked && (
                      <button
                        onClick={() => {
                          setCdIndex((prev) => (prev + 1) % codeDetectiveProblems.length);
                          setCdSelectedLine(null);
                          setCdChecked(false);
                        }}
                        className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center space-x-1.5 self-end transition-all cursor-pointer"
                      >
                        <span>Next Mystery Case</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* GAME 2: SQL QUEST */}
        {activeGame === 'sql_quest' && (
          <div className="space-y-6">
            {(() => {
              const currentSql = sqlQuestProblems[sqlIndex];
              const isCorrect = sqlSelected === currentSql.correctIndex;

              return (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div>
                      <span className="text-xs font-bold text-blue-400 uppercase">
                        SQL Quest #{sqlIndex + 1}
                      </span>
                      <h3 className="text-lg font-bold text-white mt-0.5">{currentSql.title}</h3>
                    </div>
                    <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold self-start sm:self-center border border-amber-500/30">
                      +{currentSql.xp} XP
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 space-y-1">
                    <span className="font-bold text-indigo-300">Schema Context: </span>
                    <span className="font-mono text-slate-200">{currentSql.schemaDescription}</span>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-white">
                    Mission: {currentSql.task}
                  </p>

                  <div className="space-y-2">
                    {currentSql.options.map((opt, i) => {
                      const isSelected = sqlSelected === i;
                      let btnClass = 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-slate-600';

                      if (sqlChecked) {
                        if (i === currentSql.correctIndex) {
                          btnClass = 'bg-emerald-950/40 border-emerald-500 text-emerald-200';
                        } else if (isSelected) {
                          btnClass = 'bg-rose-950/40 border-rose-500 text-rose-200';
                        }
                      } else if (isSelected) {
                        btnClass = 'bg-indigo-950/50 border-indigo-500 text-indigo-200';
                      }

                      return (
                        <button
                          key={i}
                          disabled={sqlChecked}
                          onClick={() => setSqlSelected(i)}
                          className={`w-full p-3.5 rounded-xl border text-left font-mono text-xs transition-all flex items-center justify-between cursor-pointer ${btnClass}`}
                        >
                          <span>{opt}</span>
                          {sqlChecked && i === currentSql.correctIndex && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {!sqlChecked ? (
                      <button
                        disabled={sqlSelected === null}
                        onClick={() => {
                          setSqlChecked(true);
                          if (sqlSelected === currentSql.correctIndex) {
                            handleCorrectAnswer(currentSql.xp);
                          }
                        }}
                        className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-xs shadow-md shadow-indigo-600/30 cursor-pointer"
                      >
                        Execute & Validate Query
                      </button>
                    ) : (
                      <div className="space-y-2 flex-1 text-xs">
                        <p className={isCorrect ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                          {isCorrect ? 'Query Passed All Test Assertions!' : 'Query Failed on Edge Cases.'}
                        </p>
                        <p className="text-slate-300 leading-relaxed bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                          <strong className="text-white">Explanation: </strong>
                          {currentSql.explanation}
                        </p>
                      </div>
                    )}

                    {sqlChecked && (
                      <button
                        onClick={() => {
                          setSqlIndex((prev) => (prev + 1) % sqlQuestProblems.length);
                          setSqlSelected(null);
                          setSqlChecked(false);
                        }}
                        className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center space-x-1.5 self-end transition-all cursor-pointer"
                      >
                        <span>Next SQL Mission</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* GAME 3: DSA RACE */}
        {activeGame === 'dsa_race' && (
          <div className="space-y-6">
            {(() => {
              const currentDsa = dsaRaceProblems[dsaIndex];
              const isCorrect = dsaSelected === currentDsa.correctIndex;

              return (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div>
                      <span className="text-xs font-bold text-amber-400 uppercase">
                        Optimal Architecture #{dsaIndex + 1}
                      </span>
                      <h3 className="text-lg font-bold text-white mt-0.5">Select the Optimal Data Structure</h3>
                    </div>
                    <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold self-start sm:self-center border border-amber-500/30">
                      +{currentDsa.xp} XP
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700 text-sm text-slate-100 font-medium leading-relaxed">
                    "{currentDsa.scenario}"
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {currentDsa.options.map((opt, i) => {
                      const isSelected = dsaSelected === i;
                      let btnClass = 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-slate-600';

                      if (dsaChecked) {
                        if (i === currentDsa.correctIndex) {
                          btnClass = 'bg-emerald-950/40 border-emerald-500 text-emerald-200';
                        } else if (isSelected) {
                          btnClass = 'bg-rose-950/40 border-rose-500 text-rose-200';
                        }
                      } else if (isSelected) {
                        btnClass = 'bg-indigo-950/50 border-indigo-500 text-indigo-200';
                      }

                      return (
                        <button
                          key={i}
                          disabled={dsaChecked}
                          onClick={() => setDsaSelected(i)}
                          className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${btnClass}`}
                        >
                          <span>{opt}</span>
                          {dsaChecked && i === currentDsa.correctIndex && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {!dsaChecked ? (
                      <button
                        disabled={dsaSelected === null}
                        onClick={() => {
                          setDsaChecked(true);
                          if (dsaSelected === currentDsa.correctIndex) {
                            handleCorrectAnswer(currentDsa.xp);
                          }
                        }}
                        className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-xs shadow-md shadow-indigo-600/30 cursor-pointer"
                      >
                        Confirm Optimal Choice
                      </button>
                    ) : (
                      <div className="space-y-1.5 flex-1 text-xs">
                        <p className={isCorrect ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                          {isCorrect ? 'Correct! Optimal Time & Space Complexity.' : 'Suboptimal choice for this constraint.'}
                        </p>
                        <p className="text-slate-300 leading-relaxed bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                          <strong className="text-white">Why: </strong>
                          {currentDsa.explanation} ({currentDsa.timeComplexityReason})
                        </p>
                      </div>
                    )}

                    {dsaChecked && (
                      <button
                        onClick={() => {
                          setDsaIndex((prev) => (prev + 1) % dsaRaceProblems.length);
                          setDsaSelected(null);
                          setDsaChecked(false);
                        }}
                        className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center space-x-1.5 self-end transition-all cursor-pointer"
                      >
                        <span>Next DSA Challenge</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* GAME 4: OUTPUT PREDICTOR */}
        {activeGame === 'output_predictor' && (
          <div className="space-y-6">
            {(() => {
              const currentOp = outputPredictorProblems[opIndex];
              const isCorrect = opSelected === currentOp.correctIndex;

              return (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div>
                      <span className="text-xs font-bold text-cyan-400 uppercase">
                        Output Predictor #{opIndex + 1} • {currentOp.language}
                      </span>
                      <h3 className="text-lg font-bold text-white mt-0.5">What will be printed to stdout?</h3>
                    </div>
                    <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold self-start sm:self-center border border-amber-500/30">
                      +{currentOp.xp} XP
                    </span>
                  </div>

                  <pre className="p-5 rounded-2xl bg-slate-950 font-mono text-xs text-indigo-300 border border-slate-800 leading-relaxed overflow-x-auto">
                    {currentOp.code}
                  </pre>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    {currentOp.options.map((opt, i) => {
                      const isSelected = opSelected === i;
                      let btnClass = 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-slate-600';

                      if (opChecked) {
                        if (i === currentOp.correctIndex) {
                          btnClass = 'bg-emerald-950/40 border-emerald-500 text-emerald-200';
                        } else if (isSelected) {
                          btnClass = 'bg-rose-950/40 border-rose-500 text-rose-200';
                        }
                      } else if (isSelected) {
                        btnClass = 'bg-indigo-950/50 border-indigo-500 text-indigo-200';
                      }

                      return (
                        <button
                          key={i}
                          disabled={opChecked}
                          onClick={() => setOpSelected(i)}
                          className={`p-3.5 rounded-xl border text-left font-mono text-xs transition-all flex items-center justify-between cursor-pointer ${btnClass}`}
                        >
                          <span>{opt}</span>
                          {opChecked && i === currentOp.correctIndex && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {!opChecked ? (
                      <button
                        disabled={opSelected === null}
                        onClick={() => {
                          setOpChecked(true);
                          if (opSelected === currentOp.correctIndex) {
                            handleCorrectAnswer(currentOp.xp);
                          }
                        }}
                        className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-xs shadow-md shadow-indigo-600/30 cursor-pointer"
                      >
                        Submit Prediction
                      </button>
                    ) : (
                      <div className="space-y-1.5 flex-1 text-xs">
                        <p className={isCorrect ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                          {isCorrect ? 'Precise Analysis! Memory references mastered.' : 'Tricky pointer / scope behavior.'}
                        </p>
                        <p className="text-slate-300 leading-relaxed bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                          <strong className="text-white">Explanation: </strong>
                          {currentOp.explanation}
                        </p>
                      </div>
                    )}

                    {opChecked && (
                      <button
                        onClick={() => {
                          setOpIndex((prev) => (prev + 1) % outputPredictorProblems.length);
                          setOpSelected(null);
                          setOpChecked(false);
                        }}
                        className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center space-x-1.5 self-end transition-all cursor-pointer"
                      >
                        <span>Next Code Snippet</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* GAMES 5 to 8 Quick Concept Card Showcase */}
        {['flash_battle', 'concept_match', 'debug_challenge', 'career_quest'].includes(activeGame) && (
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white capitalize">{activeGame.replace('_', ' ')} Arena</h3>
              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                Level 1 Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {conceptMatchCards.map((card) => (
                <div key={card.id} className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3 text-xs">
                  <span className="font-bold text-indigo-300 text-sm block">{card.concept}</span>
                  <p className="text-slate-300 leading-relaxed">{card.definition}</p>
                  <div className="pt-2 border-t border-slate-700/60 text-[11px] text-emerald-400">
                    <strong className="text-slate-200">Production Use: </strong>
                    {card.productionExample}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-center">
              <button
                onClick={() => handleCorrectAnswer(40)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center space-x-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Round Completed (+40 XP)</span>
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
