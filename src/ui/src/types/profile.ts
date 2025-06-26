// src/ui/src/types/profile.ts

export interface EducationEntry {
  id: string; // For list key
  institution: string;
  degree: string;
  graduationDate: string;
  gpa?: string;
  relevantCoursework?: string;
}

export interface WorkExperienceEntry {
  id: string; // For list key
  company: string;
  jobTitle: string;
  startDate: string;
  endDate?: string; // Optional, for current jobs
  responsibilities: string; // Bullet points, store as a single string with newlines
  achievements?: string;    // Bullet points, store as a single string with newlines
}

export interface ProjectEntry {
  id: string; // For list key
  projectName: string;
  description: string;
  technologiesUsed: string; // Comma-separated or newline-separated string
  githubLink?: string;
  liveDemoLink?: string;
}

export interface UserProfile {
  uid: string; // Firebase UID

  // Personal Details
  fullName?: string;
  email: string; // Usually from auth, but can be stored for convenience
  phoneNumber?: string;
  address?: string;
  linkedInProfile?: string;
  githubProfile?: string;
  personalWebsite?: string;

  // Education
  education?: EducationEntry[];

  // Work Experience
  workExperience?: WorkExperienceEntry[];

  // Projects
  projects?: ProjectEntry[];

  // Skills
  technicalSkills?: string; // Comma-separated or newline-separated
  softSkills?: string;    // Comma-separated or newline-separated

  // Certifications/Awards
  certificationsAwards?: string; // Text area or structured list

  // Generic Answers
  strengths?: string;
  weaknesses?: string;
  careerGoals?: string;
  whyInterestedInRole?: string; // Example generic question
  tellMeAboutChallenge?: string; // Example generic question
  customGenericAnswers?: Array<{ id: string; question: string; answer: string }>; // For user-defined generic Q&A

  // API Key for external services
  externalApiKey?: string;
}

// Default structure for a new profile
export const defaultUserProfile = (uid: string, email: string): UserProfile => ({
  uid,
  email,
  education: [],
  workExperience: [],
  projects: [],
  customGenericAnswers: [],
});
