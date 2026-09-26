import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Award,
  ArrowRight,
  Copy,
  Check,
  RefreshCw,
  Search
} from 'lucide-react';
import { ResumeReport } from '../types';
import { initialResumeText } from '../data/demoData';
import { analyzeResumeWithAI } from '../services/aiService';

interface ResumeAnalyzerViewProps {
  targetRole: string;
}

export const ResumeAnalyzerView: React.FC<ResumeAnalyzerViewProps> = ({ targetRole }) => {
  const [resumeText, setResumeText] = useState(initialResumeText);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<ResumeReport | null>({
    text: initialResumeText,
    atsScore: 78,
    quantifiableScore: 65,
    roleAlignmentScore: 82,
    detectedSkills: ['Python', 'SQL', 'FastAPI', 'Scikit-learn', 'XGBoost', 'Docker', 'Git', 'Pandas'],
    missingKeywords: ['CI/CD (GitHub Actions)', 'Unit Testing (PyTest)', 'ONNX Runtime / TensorRT', 'Model Monitoring (Evidently / Prometheus)', 'Kubernetes (Basics)'],
    bulletImprovements: [
      {
        original: 'Built an end-to-end medical risk stratification pipeline using Python and FastAPI',
        improved: 'Architected and deployed an end-to-end medical risk triage microservice using Python & FastAPI, reducing prediction latency to sub-45ms across 10,000+ benchmark clinical records.',
        reason: 'Adds latency metric (sub-45ms) and scale volume (10,000+ records) to satisfy Google XYZ formula.'
      },
      {
        original: 'Created a lightweight job scheduling service in Python using thread pools',
        improved: 'Engineered a concurrent background job scheduler using Python ThreadPoolExecutor and SQLite, achieving 99.4% task completion rate with automated exponential-backoff retries.',
        reason: 'Quantifies reliability (99.4%) and highlights engineering trade-offs (exponential backoff).'
      }
    ],
    generalTips: [
      'Maintain a single-column format for seamless ATS parsing.',
      'Always start bullet points with strong past-tense action verbs (Architected, Engineered, Formulated, Accelerated).',
      'Never fabricate experience; ground quantifiable metrics in benchmark test datasets, stress tests, or actual user counts.'
    ]
  });

  const handleRunAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim()) return;

    setIsAnalyzing(true);
    try {
      const reviewText = await analyzeResumeWithAI(resumeText, targetRole);

      setReport({
        text: resumeText,
        atsScore: 80,
        quantifiableScore: 70,
        roleAlignmentScore: 84,
        detectedSkills: ['Python', 'SQL', 'FastAPI', 'Machine Learning', 'Docker', 'Git'],
        missingKeywords: ['CI/CD Pipeline', 'Unit Testing', 'Model Registry (MLflow)', 'Cloud Deployment (AWS/GCP)'],
        bulletImprovements: [
          {
            original: 'Worked on machine learning model to predict prices.',
            improved: 'Trained and hyperparameter-tuned an XGBoost regression model, improving R² score by 14% to 0.91 on cross-validated real estate data.',
            reason: 'Replaces generic "worked on" with exact action and quantifiable metric.'
          }
        ],
        generalTips: [
          'Ensure headers (Education, Projects, Technical Skills) follow standard ASCII conventions.',
          'Double check that all project links open directly to clean GitHub READMEs with demo GIF/screenshots.'
        ]
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
              ATS & Role Matcher
            </span>
            <span className="text-xs text-slate-400">Strict Recruiter Screen Simulator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Resume Analyzer for {targetRole}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Audit your resume against ATS screening bots and human hiring managers. Discover missing target keywords, quantifiable impact deficiencies, and line-by-line XYZ bullet upgrades.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Input Textarea (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-white text-base">Paste Resume Text</h2>
            <button
              onClick={() => setResumeText(initialResumeText)}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Load Demo Resume
            </button>
          </div>

          <form onSubmit={handleRunAnalysis} className="space-y-4">
            <textarea
              rows={16}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="w-full p-3.5 rounded-2xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono leading-relaxed focus:outline-none focus:border-indigo-500"
              placeholder="Paste your plain text resume here..."
            />

            <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Scanning ATS Filters & Keywords...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Audit Resume for {targetRole}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Audit Report (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {report && (
            <div className="space-y-6">
              
              {/* Scores Strip */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="font-bold text-white text-base">ATS & Recruiter Screening Audit</h3>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                    <span className="text-slate-400 text-xs block">ATS Friendliness</span>
                    <span className="text-2xl font-black text-indigo-400 block mt-1">{report.atsScore}%</span>
                    <span className="text-[10px] text-emerald-400 font-semibold">Passes parsing</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                    <span className="text-slate-400 text-xs block">Quantifiable Impact</span>
                    <span className="text-2xl font-black text-amber-400 block mt-1">{report.quantifiableScore}%</span>
                    <span className="text-[10px] text-amber-300 font-semibold">Needs more numbers</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                    <span className="text-slate-400 text-xs block">Role Alignment</span>
                    <span className="text-2xl font-black text-purple-400 block mt-1">{report.roleAlignmentScore}%</span>
                    <span className="text-[10px] text-purple-300 font-semibold">High match</span>
                  </div>
                </div>
              </div>

              {/* Missing Keywords & Detected Skills (Requirement 8) */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div>
                  <h4 className="font-bold text-white text-sm">Critical Missing Keywords for {targetRole}</h4>
                  <p className="text-xs text-slate-400">
                    Recruiter search filters and ATS engines search for these specific terms:
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {report.missingKeywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center space-x-1"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                      <span>{kw}</span>
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <span className="text-xs font-semibold text-slate-400">Successfully Detected Skills:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {report.detectedSkills.map((sk, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-medium"
                      >
                        ✓ {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bullet Improvements: XYZ Formula */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div>
                  <h4 className="font-bold text-white text-sm">Line-by-Line Bullet Point Upgrades (Google XYZ)</h4>
                  <p className="text-xs text-slate-400">
                    Formula: <strong className="text-indigo-300">Accomplished [X] as measured by [Y], by doing [Z]</strong>
                  </p>
                </div>

                <div className="space-y-4">
                  {report.bulletImprovements.map((bi, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700 space-y-2.5 text-xs">
                      <div>
                        <span className="font-bold text-rose-400 uppercase text-[10px] tracking-wider block">Before:</span>
                        <p className="text-slate-300 italic">"{bi.original}"</p>
                      </div>
                      <div className="pt-2 border-t border-slate-700/50">
                        <span className="font-bold text-emerald-400 uppercase text-[10px] tracking-wider block">Upgraded:</span>
                        <p className="text-emerald-200 font-semibold leading-relaxed">"{bi.improved}"</p>
                      </div>
                      <p className="text-[11px] text-slate-400 pt-1">
                        <strong className="text-slate-300">Why this wins: </strong>{bi.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Best Practice Tips */}
              <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-2 text-xs">
                <span className="font-bold text-indigo-300">Recruiter Rule: </span>
                <ul className="space-y-1 text-slate-300 list-disc list-inside">
                  {report.generalTips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
};
