import React from 'react';
import { UserMetadata } from '../types';
import { Calendar, User, BookOpen, Clock, Hash, AlignLeft } from 'lucide-react';

interface InputFormProps {
  metadata: UserMetadata;
  setMetadata: React.Dispatch<React.SetStateAction<UserMetadata>>;
  onNext: () => void;
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

export const InputForm: React.FC<InputFormProps> = ({ metadata, setMetadata, onNext }) => {
  const handleChange = (field: keyof UserMetadata, value: any) => {
    setMetadata(prev => ({ ...prev, [field]: value }));
  };

  const toggleDay = (day: string) => {
    setMetadata(prev => {
      const current = prev.selectedDays;
      if (current.includes(day)) {
        return { ...prev, selectedDays: current.filter(d => d !== day) };
      } else {
        return { ...prev, selectedDays: [...current, day] };
      }
    });
  };

  const isFormValid = metadata.grade && metadata.lessonTitle && metadata.ccssCode && metadata.selectedDays.length > 0;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <BookOpen className="w-6 h-6 text-indigo-600" />
        Lesson Parameters
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <label className="block">
            <span className="text-slate-700 font-medium">Grade Level</span>
            <input
              type="text"
              value={metadata.grade}
              onChange={(e) => handleChange('grade', e.target.value)}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              placeholder="e.g., Grade 8"
            />
          </label>

          <label className="block">
            <span className="text-slate-700 font-medium">Semester</span>
            <input
              type="text"
              value={metadata.semester}
              onChange={(e) => handleChange('semester', e.target.value)}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              placeholder="e.g., Semester 2"
            />
          </label>

           <label className="block">
            <span className="text-slate-700 font-medium">Week Number</span>
            <input
              type="text"
              value={metadata.weekNumber}
              onChange={(e) => handleChange('weekNumber', e.target.value)}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              placeholder="e.g., Week 5"
            />
          </label>
        </div>

        {/* Dates & People */}
        <div className="space-y-4">
           <div className="grid grid-cols-2 gap-4">
            <label className="block">
                <span className="text-slate-700 font-medium">Start Date</span>
                <input
                type="date"
                value={metadata.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                />
            </label>
            <label className="block">
                <span className="text-slate-700 font-medium">End Date</span>
                <input
                type="date"
                value={metadata.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                />
            </label>
           </div>

           <label className="block">
            <span className="text-slate-700 font-medium">Teacher Name</span>
            <div className="relative">
              <User className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={metadata.teacherName}
                onChange={(e) => handleChange('teacherName', e.target.value)}
                className="mt-1 pl-8 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                placeholder="Mrs. Smith"
              />
            </div>
          </label>

          <label className="block">
            <span className="text-slate-700 font-medium">HOD Name</span>
             <div className="relative">
              <User className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={metadata.hodName}
                onChange={(e) => handleChange('hodName', e.target.value)}
                className="mt-1 pl-8 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                placeholder="Mr. Jones"
              />
            </div>
          </label>
        </div>
      </div>

      <div className="my-6 border-t border-slate-200"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
             <label className="block">
                <span className="text-slate-700 font-medium">Lesson Title</span>
                <div className="relative">
                <AlignLeft className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                <input
                    type="text"
                    value={metadata.lessonTitle}
                    onChange={(e) => handleChange('lessonTitle', e.target.value)}
                    className="mt-1 pl-8 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    placeholder="e.g., Quadratic Functions"
                />
                </div>
            </label>

            <label className="block">
                <span className="text-slate-700 font-medium">Unit Name</span>
                <input
                    type="text"
                    value={metadata.unitName}
                    onChange={(e) => handleChange('unitName', e.target.value)}
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    placeholder="e.g., Algebra II"
                />
            </label>
        </div>

        <div className="space-y-4">
             <label className="block">
                <span className="text-slate-700 font-medium">CCSS Standard Code</span>
                 <div className="relative">
                <Hash className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                <input
                    type="text"
                    value={metadata.ccssCode}
                    onChange={(e) => handleChange('ccssCode', e.target.value)}
                    className="mt-1 pl-8 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    placeholder="e.g., 8.EE.C.7"
                />
                </div>
            </label>
            <label className="block">
                <span className="text-slate-700 font-medium">Duration</span>
                 <div className="relative">
                <Clock className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                <input
                    type="text"
                    value={metadata.duration}
                    onChange={(e) => handleChange('duration', e.target.value)}
                    className="mt-1 pl-8 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                />
                </div>
            </label>
        </div>
      </div>

      <div className="mt-6">
        <span className="text-slate-700 font-medium block mb-2">Select Days for Planning</span>
        <div className="flex flex-wrap gap-2">
            {DAYS.map(day => (
                <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        metadata.selectedDays.includes(day)
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                    {day}
                </button>
            ))}
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={onNext}
          disabled={!isFormValid}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-all ${
            isFormValid ? 'bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl' : 'bg-slate-300 cursor-not-allowed'
          }`}
        >
          Next: Upload Materials
        </button>
      </div>
    </div>
  );
};