import React, { useState, useRef } from 'react';
import { LessonPlanResponse, UserMetadata, DailyPlan } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Printer, FileDown, FileText, Loader2 } from 'lucide-react';
import { parse } from 'marked';

interface LessonPlanDisplayProps {
  plan: LessonPlanResponse;
  metadata: UserMetadata;
  onReset: () => void;
}

export const LessonPlanDisplay: React.FC<LessonPlanDisplayProps> = ({ plan, metadata, onReset }) => {
  const [activeDay, setActiveDay] = useState<string>(plan.dailyPlans[0]?.day || "");
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = () => {
    setIsDownloadingPdf(true);
    
    // Allow state to update and render full content (all tabs) before capturing
    setTimeout(() => {
        if (!contentRef.current) return;

        const element = contentRef.current;
        const opt = {
            margin:       [5, 10, 5, 10], // Top, Right, Bottom, Left (mm)
            filename:     `${metadata.lessonTitle.replace(/[^a-zA-Z0-9]/g, '_')}_LessonPlan.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true, logging: false, scrollX: 0, scrollY: 0 },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak:    { mode: ['css', 'legacy'] }
        };

        const worker = (window as any).html2pdf();
        
        worker.set(opt).from(element).save().then(() => {
            setIsDownloadingPdf(false);
        }).catch((err: any) => {
            console.error("PDF generation error:", err);
            setIsDownloadingPdf(false);
            // Fallback to print if html2pdf fails
            window.print();
        });
    }, 500); 
  };

  const handleDownloadWord = () => {
    // Helper to parse markdown safely to HTML string for Word
    const mdToHtml = (text: string) => {
        try {
            return parse(text || "");
        } catch (e) {
            return text;
        }
    };

    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>${metadata.lessonTitle}</title>
        <style>
          body { font-family: 'Calibri', sans-serif; font-size: 11pt; }
          table { border-collapse: collapse; width: 100%; margin-bottom: 15px; }
          td, th { border: 1px solid #000; padding: 6px; vertical-align: top; }
          h1 { font-size: 18pt; text-align: center; color: #2E1065; margin-bottom: 20px; }
          h2 { font-size: 16pt; color: #1e1b4b; border-bottom: 2px solid #000; padding-bottom: 5px; margin-top: 30px; }
          h3 { font-size: 14pt; color: #334155; margin-top: 15px; margin-bottom: 10px; background-color: #f8fafc; padding: 5px; }
          .label { font-weight: bold; text-transform: uppercase; font-size: 0.75em; color: #64748b; display: block; margin-bottom: 4px; }
          .content { font-size: 11pt; }
          p { margin: 0 0 10px 0; }
          ul { margin: 0 0 10px 20px; padding: 0; }
          li { margin-bottom: 4px; }
        </style>
      </head>
      <body>
        <h1>${metadata.lessonTitle}</h1>
        
        <!-- Metadata Grid -->
        <table>
          <tr>
            <td width="25%"><span class="label">Grade</span><div class="content">${metadata.grade}</div></td>
            <td width="25%"><span class="label">Semester</span><div class="content">${metadata.semester}</div></td>
            <td width="25%"><span class="label">Week</span><div class="content">${metadata.weekNumber}</div></td>
            <td width="25%"><span class="label">Dates</span><div class="content">${metadata.startDate} to ${metadata.endDate}</div></td>
          </tr>
          <tr>
            <td><span class="label">Subject</span><div class="content">${metadata.subject}</div></td>
            <td><span class="label">Unit</span><div class="content">${metadata.unitName}</div></td>
            <td><span class="label">Lesson Title</span><div class="content">${metadata.lessonTitle}</div></td>
            <td><span class="label">Duration</span><div class="content">${metadata.duration}</div></td>
          </tr>
          <tr>
            <td><span class="label">Focus/Skill</span><div class="content">${plan.generalInfo.focusSkill}</div></td>
            <td colspan="2"><span class="label">CCSS Alignment</span><div class="content"><strong>${metadata.ccssCode}</strong> - ${plan.generalInfo.ccssAlignment}</div></td>
            <td><span class="label">Assessment Planned</span><div class="content">${plan.generalInfo.assessmentPlanned}</div></td>
          </tr>
          <tr>
            <td colspan="2"><span class="label">Teacher Name</span><div class="content">${metadata.teacherName}</div></td>
            <td colspan="2"><span class="label">HOD Name</span><div class="content">${metadata.hodName}</div></td>
          </tr>
          <tr>
            <td colspan="2"><span class="label">Learning Intention</span><div class="content">${plan.generalInfo.learningIntention}</div></td>
            <td colspan="2"><span class="label">Success Criteria</span><div class="content">${mdToHtml(plan.generalInfo.successCriteria)}</div></td>
          </tr>
           <tr>
            <td colspan="2"><span class="label">Materials & Resources</span><div class="content">${mdToHtml(plan.generalInfo.materials)}</div></td>
            <td colspan="2"><span class="label">Pre-requisites</span><div class="content">${mdToHtml(plan.generalInfo.prerequisites)}</div></td>
          </tr>
        </table>
  
        <!-- Daily Plans -->
        ${plan.dailyPlans.map(day => `
          <br style="page-break-before: always;" />
          <h2>${day.day}</h2>
          
          <h3>1. Introduction / Hook (5 mins)</h3>
          <table>
              <tr>
                  <td width="50%"><span class="label">Warm-Up</span><div class="content">${mdToHtml(day.intro.warmUp)}</div></td>
                  <td width="50%"><span class="label">Review</span><div class="content">${mdToHtml(day.intro.review)}</div></td>
              </tr>
              <tr>
                  <td><span class="label">Vocabulary</span><div class="content">${mdToHtml(day.intro.vocabulary)}</div></td>
                  <td><span class="label">Engaging Starter</span><div class="content">${mdToHtml(day.intro.starter)}</div></td>
              </tr>
          </table>
  
          <h3>2. Presentation (10 mins)</h3>
          <table>
              <tr><td><span class="label">Teacher Explanation</span><div class="content">${mdToHtml(day.presentation.explanation)}</div></td></tr>
              <tr><td><span class="label">Math Examples</span><div class="content">${mdToHtml(day.presentation.examples)}</div></td></tr>
              <tr><td><span class="label">Check for Understanding</span><div class="content">${mdToHtml(day.presentation.checkUnderstanding)}</div></td></tr>
          </table>
  
          <h3>3. Guided Practice (15 mins)</h3>
           <table>
              <tr><td width="30%"><span class="label">Grouping</span><div class="content">${mdToHtml(day.guidedPractice.groupStructure)}</div></td>
              <td><span class="label">Tasks</span><div class="content">${mdToHtml(day.guidedPractice.tasks)}</div></td></tr>
          </table>
  
          <h3>4. Independent Practice (10 mins)</h3>
           <table>
              <tr><td><span class="label">Core Tasks</span><div class="content">${mdToHtml(day.independentPractice.tasks)}</div></td></tr>
               ${day.independentPractice.equations ? `<tr><td><span class="label">Equations</span><div class="content">${mdToHtml(day.independentPractice.equations)}</div></td></tr>` : ''}
          </table>
  
          <h3>5. Closure (5 mins)</h3>
           <table>
              <tr>
                  <td width="33%"><span class="label">Self Assessment</span><div class="content">${mdToHtml(day.closure.selfAssessment)}</div></td>
                  <td width="33%"><span class="label">Summary</span><div class="content">${mdToHtml(day.closure.summary)}</div></td>
                  <td width="33%"><span class="label">Exit Ticket</span><div class="content">${mdToHtml(day.closure.exitTicket)}</div></td>
              </tr>
          </table>
  
          <h3>6. Differentiation Strategies</h3>
           <table>
              <tr>
                  <td width="33%"><span class="label">High Achievers</span><div class="content">${mdToHtml(day.differentiation.highAchievers)}</div></td>
                  <td width="33%"><span class="label">Average Students</span><div class="content">${mdToHtml(day.differentiation.averageStudents)}</div></td>
                  <td width="33%"><span class="label">Struggling Students</span><div class="content">${mdToHtml(day.differentiation.strugglingStudents)}</div></td>
              </tr>
          </table>
  
          <h3>7. Homework</h3>
           <table>
              <tr>
                  <td width="33%"><span class="label">Support (Easy)</span><div class="content">${mdToHtml(day.homework.support)}</div></td>
                  <td width="33%"><span class="label">Core (Medium)</span><div class="content">${mdToHtml(day.homework.core)}</div></td>
                  <td width="33%"><span class="label">Challenge (Hard)</span><div class="content">${mdToHtml(day.homework.challenge)}</div></td>
              </tr>
          </table>
        `).join('')}
      </body>
      </html>
    `;
  
    const blob = new Blob(['\ufeff', content], {
      type: 'application/msword'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${metadata.lessonTitle.replace(/[^a-zA-Z0-9]/g, '_')}_LessonPlan.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 print:hidden gap-4">
        <button onClick={onReset} className="text-slate-600 hover:text-indigo-600 font-medium flex items-center gap-2">
          &larr; Create New Plan
        </button>
        <div className="flex gap-3">
           <button 
             onClick={handleDownloadWord} 
             disabled={isDownloadingPdf}
             className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
           >
            <FileText className="w-4 h-4" />
            Download Word
          </button>
          <button 
            onClick={handleDownloadPdf} 
            disabled={isDownloadingPdf}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloadingPdf ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating PDF...
                </>
            ) : (
                <>
                    <FileDown className="w-4 h-4" />
                    Download PDF
                </>
            )}
          </button>
        </div>
      </div>

      {/* Main Document Container - Wrapped in ref for html2pdf */}
      <div 
        ref={contentRef}
        className={`bg-white rounded-xl overflow-hidden print:shadow-none print:border-none print:w-full print:m-0 ${isDownloadingPdf ? 'shadow-none w-full max-w-[210mm] mx-auto' : 'shadow-xl border border-slate-200'}`}
      >
        
        {/* ---------------- GENERAL INFORMATION GRID ---------------- */}
        <div className={`${isDownloadingPdf ? 'p-6' : 'p-8'} print:p-0`}>
          
          {/* Main Title */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-slate-900 uppercase tracking-wide print:text-black">
              {metadata.lessonTitle}
            </h1>
          </div>

          {/* Metadata Grid - Using borders for table-like appearance */}
          <div className="border-2 border-slate-300 rounded-sm overflow-hidden text-sm print:border-black print:text-black">
            
            {/* ROW 1: Grade | Semester | Week | Start/End Date */}
            <div className="grid grid-cols-1 md:grid-cols-4 border-b border-slate-300 print:border-black break-inside-avoid">
              <div className="p-2 border-b md:border-b-0 border-slate-300 md:border-r print:border-black">
                <span className="block text-xs font-bold text-slate-500 uppercase mb-1 print:text-black">Grade</span>
                <span className="font-semibold">{metadata.grade}</span>
              </div>
              <div className="p-2 border-b md:border-b-0 border-slate-300 md:border-r print:border-black">
                <span className="block text-xs font-bold text-slate-500 uppercase mb-1 print:text-black">Semester</span>
                <span className="font-semibold">{metadata.semester}</span>
              </div>
              <div className="p-2 border-b md:border-b-0 border-slate-300 md:border-r print:border-black">
                <span className="block text-xs font-bold text-slate-500 uppercase mb-1 print:text-black">Week</span>
                <span className="font-semibold">{metadata.weekNumber}</span>
              </div>
              <div className="p-2">
                <span className="block text-xs font-bold text-slate-500 uppercase mb-1 print:text-black">Dates</span>
                <span className="font-semibold">{metadata.startDate} to {metadata.endDate}</span>
              </div>
            </div>

            {/* ROW 2: Subject | Unit | Lesson Title | Duration */}
            <div className="grid grid-cols-1 md:grid-cols-4 border-b border-slate-300 print:border-black break-inside-avoid">
              <div className="p-2 border-b md:border-b-0 border-slate-300 md:border-r print:border-black">
                <span className="block text-xs font-bold text-slate-500 uppercase mb-1 print:text-black">Subject</span>
                <span className="font-semibold">{metadata.subject}</span>
              </div>
              <div className="p-2 border-b md:border-b-0 border-slate-300 md:border-r print:border-black">
                <span className="block text-xs font-bold text-slate-500 uppercase mb-1 print:text-black">Unit</span>
                <span className="font-semibold">{metadata.unitName}</span>
              </div>
              <div className="p-2 border-b md:border-b-0 border-slate-300 md:border-r print:border-black">
                <span className="block text-xs font-bold text-slate-500 uppercase mb-1 print:text-black">Lesson Title</span>
                <span className="font-semibold">{metadata.lessonTitle}</span>
              </div>
              <div className="p-2">
                <span className="block text-xs font-bold text-slate-500 uppercase mb-1 print:text-black">Duration</span>
                <span className="font-semibold">{metadata.duration}</span>
              </div>
            </div>

            {/* ROW 3: Focus/Skill | CCSS | Assessment */}
            <div className="grid grid-cols-1 md:grid-cols-3 border-b border-slate-300 print:border-black break-inside-avoid">
              <div className="p-2 border-b md:border-b-0 border-slate-300 md:border-r print:border-black">
                <span className="block text-xs font-bold text-slate-500 uppercase mb-1 print:text-black">Focus/Skill</span>
                <span className="">{plan.generalInfo.focusSkill}</span>
              </div>
              <div className="p-2 border-b md:border-b-0 border-slate-300 md:border-r print:border-black">
                <span className="block text-xs font-bold text-slate-500 uppercase mb-1 print:text-black">CCSS Alignment</span>
                <span className="font-mono text-xs bg-slate-100 px-1 rounded mr-1 print:bg-transparent print:border print:border-gray-300">{metadata.ccssCode}</span>
                <span className="">{plan.generalInfo.ccssAlignment}</span>
              </div>
              <div className="p-2">
                <span className="block text-xs font-bold text-slate-500 uppercase mb-1 print:text-black">Assessment Planned</span>
                <span className="">{plan.generalInfo.assessmentPlanned}</span>
              </div>
            </div>

             {/* ROW 4: Teacher | HOD */}
             <div className="grid grid-cols-1 md:grid-cols-2 border-b border-slate-300 print:border-black break-inside-avoid">
              <div className="p-2 border-b md:border-b-0 border-slate-300 md:border-r print:border-black">
                <span className="block text-xs font-bold text-slate-500 uppercase mb-1 print:text-black">Teacher Name</span>
                <span className="font-semibold">{metadata.teacherName}</span>
              </div>
              <div className="p-2">
                <span className="block text-xs font-bold text-slate-500 uppercase mb-1 print:text-black">HOD Name</span>
                <span className="font-semibold">{metadata.hodName}</span>
              </div>
            </div>

            {/* ROW 5: Learning Intention | Success Criteria */}
            <div className="grid grid-cols-1 md:grid-cols-2 border-b border-slate-300 print:border-black break-inside-avoid">
              <div className="p-2 border-b md:border-b-0 border-slate-300 md:border-r print:border-black">
                <span className="block text-xs font-bold text-slate-500 uppercase mb-1 print:text-black">Learning Intention</span>
                <span className="italic">{plan.generalInfo.learningIntention}</span>
              </div>
              <div className="p-2">
                <span className="block text-xs font-bold text-slate-500 uppercase mb-1 print:text-black">Success Criteria</span>
                <div className="prose prose-sm max-w-none print:prose-p:my-0">
                  <ReactMarkdown>{plan.generalInfo.successCriteria}</ReactMarkdown>
                </div>
              </div>
            </div>

            {/* ROW 6: Materials | Prerequisites */}
            <div className="grid grid-cols-1 md:grid-cols-2 print:border-black break-inside-avoid">
              <div className="p-2 border-b md:border-b-0 border-slate-300 md:border-r print:border-black">
                <span className="block text-xs font-bold text-slate-500 uppercase mb-1 print:text-black">Materials and Resources</span>
                <div className="prose prose-sm max-w-none print:prose-p:my-0">
                     <ReactMarkdown>{plan.generalInfo.materials}</ReactMarkdown>
                </div>
              </div>
              <div className="p-2">
                <span className="block text-xs font-bold text-slate-500 uppercase mb-1 print:text-black">Pre-requisites</span>
                <div className="prose prose-sm max-w-none print:prose-p:my-0">
                    <ReactMarkdown>{plan.generalInfo.prerequisites}</ReactMarkdown>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ---------------- DAILY PLANS ---------------- */}
        
        {/* Tabs for Screen View - Hidden during PDF download to clean up output */}
        <div className={`print:hidden border-t border-b border-slate-200 bg-slate-50 px-8 ${isDownloadingPdf ? 'hidden' : ''}`}>
            <div className="flex gap-6 overflow-x-auto">
                {plan.dailyPlans.map(dp => (
                    <button
                        key={dp.day}
                        onClick={() => setActiveDay(dp.day)}
                        className={`py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                            activeDay === dp.day
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        {dp.day}
                    </button>
                ))}
            </div>
        </div>

        {/* Daily Content Container */}
        <div className={`${isDownloadingPdf ? 'p-6' : 'p-8'} print:p-0`}>
          {plan.dailyPlans.map((currentDailyPlan, index) => (
             <div 
                key={currentDailyPlan.day} 
                className={`${(activeDay === currentDailyPlan.day || isDownloadingPdf) ? 'block' : 'hidden'} print:block ${index > 0 ? 'print:break-before-page' : 'print:mt-8'}`}
                style={index > 0 && isDownloadingPdf ? { pageBreakBefore: 'always' } : {}}
             >
                <div className="mb-6 border-b-2 border-slate-800 pb-2 pt-6">
                    <h2 className="text-2xl font-bold uppercase tracking-wider text-slate-900 print:text-black">{currentDailyPlan.day}</h2>
                </div>

                {/* 1. Intro */}
                <Section title="1. Introduction / Hook (5 mins)" color="bg-blue-50 border-blue-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InfoBlock label="Warm-Up" content={currentDailyPlan.intro.warmUp} />
                        <InfoBlock label="Review" content={currentDailyPlan.intro.review} />
                        <InfoBlock label="Vocabulary" content={currentDailyPlan.intro.vocabulary} />
                        <InfoBlock label="Engaging Starter" content={currentDailyPlan.intro.starter} />
                    </div>
                </Section>

                {/* 2. Presentation */}
                <Section title="2. Presentation (10 mins)" color="bg-indigo-50 border-indigo-100">
                     <div className="space-y-4">
                        <InfoBlock label="Teacher Explanation" content={currentDailyPlan.presentation.explanation} />
                        <div className="bg-white p-4 rounded border border-indigo-100 print:border-slate-300">
                            <span className="text-xs font-bold text-indigo-500 uppercase print:text-black">Math Examples</span>
                            <div className="mt-2 prose prose-slate max-w-none print:text-black">
                                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                    {currentDailyPlan.presentation.examples}
                                </ReactMarkdown>
                            </div>
                        </div>
                        <InfoBlock label="Check for Understanding" content={currentDailyPlan.presentation.checkUnderstanding} />
                     </div>
                </Section>

                {/* 3. Guided Practice */}
                <Section title="3. Guided Practice (15 mins)" color="bg-emerald-50 border-emerald-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1">
                            <InfoBlock label="Grouping" content={currentDailyPlan.guidedPractice.groupStructure} />
                        </div>
                        <div className="md:col-span-2">
                            <InfoBlock label="Tasks" content={currentDailyPlan.guidedPractice.tasks} />
                        </div>
                    </div>
                </Section>

                {/* 4. Independent Practice */}
                <Section title="4. Independent Practice (10 mins)" color="bg-amber-50 border-amber-100">
                     <div className="bg-white p-4 rounded border border-amber-100 mb-4 print:border-slate-300">
                        <span className="text-xs font-bold text-amber-600 uppercase print:text-black">Core Problems</span>
                        <div className="mt-2 prose prose-slate max-w-none print:text-black">
                            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                {currentDailyPlan.independentPractice.tasks}
                            </ReactMarkdown>
                        </div>
                    </div>
                    {currentDailyPlan.independentPractice.equations && (
                        <div className="bg-slate-50 p-4 rounded border border-slate-200 print:bg-transparent print:border-slate-300">
                            <span className="text-xs font-bold text-slate-500 uppercase print:text-black">Key Equations</span>
                             <div className="mt-2 text-lg font-serif print:text-black">
                                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                    {currentDailyPlan.independentPractice.equations}
                                </ReactMarkdown>
                            </div>
                        </div>
                    )}
                </Section>

                {/* 5. Closure */}
                <Section title="5. Closure (5 mins)" color="bg-slate-100 border-slate-200">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InfoBlock label="Self Assessment" content={currentDailyPlan.closure.selfAssessment} />
                        <InfoBlock label="Summary" content={currentDailyPlan.closure.summary} />
                        <InfoBlock label="Exit Ticket" content={currentDailyPlan.closure.exitTicket} />
                     </div>
                </Section>

                {/* 6. Differentiation */}
                <Section title="6. Differentiation Strategies" color="bg-rose-50 border-rose-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-3 rounded border border-rose-100 print:border-slate-300">
                            <h4 className="font-bold text-rose-600 text-sm mb-2 print:text-black">High Achievers</h4>
                            <div className="text-sm text-slate-700 print:text-black prose prose-sm">
                                <ReactMarkdown>{currentDailyPlan.differentiation.highAchievers}</ReactMarkdown>
                            </div>
                        </div>
                        <div className="bg-white p-3 rounded border border-rose-100 print:border-slate-300">
                             <h4 className="font-bold text-rose-600 text-sm mb-2 print:text-black">Average</h4>
                             <div className="text-sm text-slate-700 print:text-black prose prose-sm">
                                <ReactMarkdown>{currentDailyPlan.differentiation.averageStudents}</ReactMarkdown>
                            </div>
                        </div>
                         <div className="bg-white p-3 rounded border border-rose-100 print:border-slate-300">
                             <h4 className="font-bold text-rose-600 text-sm mb-2 print:text-black">Struggling</h4>
                             <div className="text-sm text-slate-700 print:text-black prose prose-sm">
                                <ReactMarkdown>{currentDailyPlan.differentiation.strugglingStudents}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                </Section>

                 {/* 7. Homework */}
                <Section title="7. Homework" color="bg-purple-50 border-purple-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InfoBlock label="Support (Easy)" content={currentDailyPlan.homework.support} />
                        <InfoBlock label="Core (Medium)" content={currentDailyPlan.homework.core} />
                        <InfoBlock label="Challenge (Hard)" content={currentDailyPlan.homework.challenge} />
                    </div>
                </Section>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; color: string; children: React.ReactNode }> = ({ title, color, children }) => (
    <div className={`mb-6 rounded-lg border p-5 ${color} print:bg-white print:border-slate-300 break-inside-avoid`}>
        <h3 className="font-bold text-lg mb-4 text-slate-800 border-b border-black/5 pb-2 print:text-black print:border-black">{title}</h3>
        {children}
    </div>
);

const InfoBlock: React.FC<{ label: string; content: string }> = ({ label, content }) => (
    <div className="mb-2">
        <span className="block text-xs font-bold text-slate-500 uppercase mb-1 print:text-black">{label}</span>
        <div className="text-sm text-slate-800 leading-relaxed print:text-black">
             <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{content}</ReactMarkdown>
        </div>
    </div>
);