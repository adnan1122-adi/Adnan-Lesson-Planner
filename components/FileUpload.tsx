import React, { useCallback, useState } from 'react';
import { UploadCloud, FileText, CheckCircle, X } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onBack: () => void;
  onGenerate: () => void;
  selectedFile: File | null;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, onBack, onGenerate, selectedFile }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        onFileSelect(file);
      } else {
        alert("Please upload a PDF file.");
      }
    }
  }, [onFileSelect]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
       onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-slate-100 animate-in fade-in zoom-in duration-300">
      <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
        <UploadCloud className="w-6 h-6 text-indigo-600" />
        Upload Lesson Material
      </h2>
      <p className="text-slate-500 mb-6">Upload your PDF lesson plan, worksheet, or textbook pages.</p>

      {!selectedFile ? (
        <div
          className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${
            dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-slate-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="application/pdf"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleChange}
          />
          <div className="flex flex-col items-center pointer-events-none">
            <UploadCloud className={`w-12 h-12 mb-4 ${dragActive ? 'text-indigo-600' : 'text-slate-400'}`} />
            <p className="text-lg font-medium text-slate-700">Drag & Drop PDF here</p>
            <p className="text-sm text-slate-500 mt-1">or click to browse files</p>
          </div>
        </div>
      ) : (
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-100 p-3 rounded-lg">
              <FileText className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <p className="font-medium text-slate-800">{selectedFile.name}</p>
              <p className="text-sm text-slate-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <button onClick={() => onFileSelect(null as any)} className="text-slate-400 hover:text-red-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-lg text-slate-600 font-medium hover:bg-slate-100 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onGenerate}
          disabled={!selectedFile}
          className={`flex items-center gap-2 px-8 py-3 rounded-lg text-white font-medium transition-all ${
            selectedFile
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              : 'bg-slate-300 cursor-not-allowed'
          }`}
        >
            <CheckCircle className="w-5 h-5" />
            Generate Plan
        </button>
      </div>
    </div>
  );
};