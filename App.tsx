import React, { useState } from 'react';
import { AppState, INITIAL_METADATA, LessonPlanResponse, UserMetadata } from './types';
import { generateLessonPlan } from './services/geminiService';
import { InputForm } from './components/InputForm';
import { FileUpload } from './components/FileUpload';
import { LoadingScreen } from './components/LoadingScreen';
import { LessonPlanDisplay } from './components/LessonPlanDisplay';
import { Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    step: 'form',
    metadata: INITIAL_METADATA,
    pdfFile: null,
    lessonPlan: null,
    error: null,
  });

  const setMetadata = (update: React.SetStateAction<UserMetadata>) => {
    setState(prev => ({ 
      ...prev, 
      metadata: typeof update === 'function' ? update(prev.metadata) : update 
    }));
  };

  const handleFileSelect = (file: File) => {
    setState(prev => ({ ...prev, pdfFile: file }));
  };

  const handleGenerate = async () => {
    if (!state.metadata || !state.pdfFile) return;

    setState(prev => ({ ...prev, step: 'generating', error: null }));

    try {
      const plan = await generateLessonPlan(state.metadata, state.pdfFile);
      setState(prev => ({ ...prev, step: 'result', lessonPlan: plan }));
    } catch (error: any) {
      console.error(error);
      setState(prev => ({ 
        ...prev, 
        step: 'upload', 
        error: "An error occurred while generating the plan. Please check your API key and try again." 
      }));
      alert("Failed to generate lesson plan. Ensure your API Key is valid and the PDF is readable.");
    }
  };

  const handleReset = () => {
    setState({
      step: 'form',
      metadata: INITIAL_METADATA,
      pdfFile: null,
      lessonPlan: null,
      error: null,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10 print:hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-indigo-500">
              MathGenius AI
            </span>
          </div>
          <div className="text-sm text-slate-500">
             Advanced Lesson Planner
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow p-6">
        <div className="max-w-7xl mx-auto">
          {state.error && (
            <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
              {state.error}
            </div>
          )}

          {state.step === 'form' && (
            <div className="animate-in fade-in duration-500">
              <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Create Your Perfect Math Lesson</h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                  Combine your resources with advanced AI to generate rigorous, differentiated, and CCSS-aligned lesson plans in seconds.
                </p>
              </div>
              <InputForm 
                metadata={state.metadata} 
                setMetadata={setMetadata} 
                onNext={() => setState(prev => ({ ...prev, step: 'upload' }))} 
              />
            </div>
          )}

          {state.step === 'upload' && (
            <FileUpload 
              onFileSelect={handleFileSelect} 
              onBack={() => setState(prev => ({ ...prev, step: 'form' }))}
              onGenerate={handleGenerate}
              selectedFile={state.pdfFile}
            />
          )}

          {state.step === 'generating' && (
            <LoadingScreen />
          )}

          {state.step === 'result' && state.lessonPlan && (
            <LessonPlanDisplay 
              plan={state.lessonPlan} 
              metadata={state.metadata} 
              onReset={handleReset} 
            />
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-slate-400 text-sm print:hidden">
        <p>&copy; {new Date().getFullYear()} MathGenius AI Planner. Powered by Gemini 2.5 Flash.</p>
      </footer>
    </div>
  );
};

export default App;