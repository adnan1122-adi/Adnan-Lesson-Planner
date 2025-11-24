export interface UserMetadata {
  grade: string;
  semester: string;
  weekNumber: string;
  startDate: string;
  endDate: string;
  selectedDays: string[]; // e.g., ["Monday", "Wednesday"]
  lessonTitle: string;
  ccssCode: string;
  teacherName: string;
  hodName: string;
  subject: string;
  unitName: string;
  duration: string;
}

export interface DailyPlan {
  day: string;
  intro: {
    warmUp: string;
    review: string;
    vocabulary: string;
    starter: string;
  };
  presentation: {
    explanation: string;
    modeling: string;
    examples: string; // Should contain LaTeX
    checkUnderstanding: string;
  };
  guidedPractice: {
    groupStructure: string;
    tasks: string;
  };
  independentPractice: {
    tasks: string;
    equations: string; // LaTeX
  };
  closure: {
    selfAssessment: string;
    summary: string;
    exitTicket: string;
  };
  differentiation: {
    strategies: string[];
    highAchievers: string;
    averageStudents: string;
    strugglingStudents: string;
  };
  homework: {
    support: string;
    core: string;
    challenge: string;
  };
}

export interface LessonPlanResponse {
  generalInfo: {
    focusSkill: string;
    ccssAlignment: string;
    assessmentPlanned: string;
    learningIntention: string;
    successCriteria: string;
    materials: string;
    prerequisites: string;
  };
  dailyPlans: DailyPlan[];
}

export interface AppState {
  step: 'form' | 'upload' | 'generating' | 'result';
  metadata: UserMetadata;
  pdfFile: File | null;
  lessonPlan: LessonPlanResponse | null;
  error: string | null;
}

export const INITIAL_METADATA: UserMetadata = {
  grade: '',
  semester: '',
  weekNumber: '',
  startDate: '',
  endDate: '',
  selectedDays: [],
  lessonTitle: '',
  ccssCode: '',
  teacherName: '',
  hodName: '',
  subject: 'Mathematics',
  unitName: '',
  duration: '60 minutes',
};