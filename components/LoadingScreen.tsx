import React from 'react';
import { Loader2, BrainCircuit } from 'lucide-react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto text-center py-20 animate-in fade-in duration-700">
      <div className="relative inline-block mb-8">
        <div className="absolute inset-0 bg-indigo-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
        <div className="relative bg-white p-6 rounded-full shadow-xl border border-indigo-100">
          <BrainCircuit className="w-16 h-16 text-indigo-600 animate-pulse" />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg border border-slate-100">
             <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
        </div>
      </div>
      
      <h2 className="text-3xl font-bold text-slate-800 mb-4">Crafting Your Math Lesson</h2>
      <p className="text-lg text-slate-500 max-w-md mx-auto">
        Our AI is analyzing your PDF, aligning with CCSS standards, and structuring differentiated activities for your students.
      </p>

      <div className="mt-8 space-y-3 max-w-sm mx-auto">
        <div className="flex items-center gap-3 text-sm text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Extracting PDF content...
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse delay-75"></span>
            Solving LaTeX equations...
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse delay-150"></span>
            Generating differentiation strategies...
        </div>
      </div>
    </div>
  );
};