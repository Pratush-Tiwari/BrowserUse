// src/ui/src/components/Profile/ProfileManagement.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/firebase';
import { UserProfile, defaultUserProfile, EducationEntry, WorkExperienceEntry, ProjectEntry } from '@/types/profile';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs for list items

// Helper to create a styled input field (mimicking Shadcn's Input)
const StyledInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, id, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
    <input
      id={id}
      {...props}
      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50"
    />
  </div>
);

// Helper for Textarea
const StyledTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, id, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
    <textarea
      id={id}
      rows={3}
      {...props}
      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
    />
  </div>
);

// Helper for Button (mimicking Shadcn's Button)
const StyledButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => (
  <button
    {...props}
    className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 ${props.className || ''}`}
  >
    {children}
  </button>
);


const ProfileManagement: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentUser = auth.currentUser;

  const loadProfile = useCallback(async () => {
    if (!currentUser) {
      setError("No user logged in.");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const profileDocRef = doc(db, 'profiles', currentUser.uid);
      const docSnap = await getDoc(profileDocRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data() as UserProfile);
      } else {
        // Create a default profile if one doesn't exist
        const newProfile = defaultUserProfile(currentUser.uid, currentUser.email || '');
        await setDoc(profileDocRef, newProfile);
        setProfile(newProfile);
        console.log("No profile found, created a default one.");
      }
    } catch (err: any) {
      console.error("Error loading profile:", err);
      setError("Failed to load profile: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!profile) return;
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleNestedInputChange = (section: keyof UserProfile, index: number, field: string, value: string) => {
    if (!profile) return;
    const sectionData = profile[section] as Array<any> | undefined;
    if (sectionData) {
      const updatedSection = [...sectionData];
      updatedSection[index] = { ...updatedSection[index], [field]: value };
      setProfile({ ...profile, [section]: updatedSection });
    }
  };

  const addNestedItem = (section: keyof UserProfile, newItem: EducationEntry | WorkExperienceEntry | ProjectEntry) => {
    if (!profile) return;
    const sectionData = profile[section] as Array<any> | undefined;
    const updatedSection = sectionData ? [...sectionData, newItem] : [newItem];
    setProfile({ ...profile, [section]: updatedSection });
  };

  const removeNestedItem = (section: keyof UserProfile, index: number) => {
    if (!profile) return;
    const sectionData = profile[section] as Array<any> | undefined;
    if (sectionData) {
      const updatedSection = sectionData.filter((_, i) => i !== index);
      setProfile({ ...profile, [section]: updatedSection });
    }
  };


  const handleSaveProfile = async () => {
    if (!currentUser || !profile) {
      setError("No user or profile data to save.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const profileDocRef = doc(db, 'profiles', currentUser.uid);
      await updateDoc(profileDocRef, { ...profile }); // Using updateDoc for existing doc
      alert('Profile saved successfully!');
    } catch (err: any) {
      console.error("Error saving profile:", err);
      setError("Failed to save profile: " + err.message);
      alert('Error saving profile: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center p-4">Loading profile...</p>;
  if (error) return <p className="text-center p-4 text-red-500">Error: {error}</p>;
  if (!profile) return <p className="text-center p-4">No profile data available. Try reloading.</p>;

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">Manage Your Profile</h2>

      <form onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }} className="space-y-6">
        {/* Personal Details */}
        <fieldset className="border p-4 rounded-md">
          <legend className="text-lg font-medium text-gray-700 dark:text-gray-300 px-2">Personal Details</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <StyledInput label="Full Name" id="fullName" name="fullName" value={profile.fullName || ''} onChange={handleInputChange} />
            <StyledInput label="Email" id="email" name="email" type="email" value={profile.email} disabled />
            <StyledInput label="Phone Number" id="phoneNumber" name="phoneNumber" value={profile.phoneNumber || ''} onChange={handleInputChange} />
            <StyledTextarea label="Address" id="address" name="address" value={profile.address || ''} onChange={handleInputChange} />
            <StyledInput label="LinkedIn Profile URL" id="linkedInProfile" name="linkedInProfile" value={profile.linkedInProfile || ''} onChange={handleInputChange} />
            <StyledInput label="GitHub Profile URL" id="githubProfile" name="githubProfile" value={profile.githubProfile || ''} onChange={handleInputChange} />
            <StyledInput label="Personal Website URL" id="personalWebsite" name="personalWebsite" value={profile.personalWebsite || ''} onChange={handleInputChange} />
          </div>
        </fieldset>

        {/* Education */}
        <fieldset className="border p-4 rounded-md">
          <legend className="text-lg font-medium text-gray-700 dark:text-gray-300 px-2">Education</legend>
          {profile.education?.map((edu, index) => (
            <div key={edu.id || index} className="border-b pb-4 mb-4 space-y-2">
              <StyledInput label="Institution" id={`edu-inst-${index}`} value={edu.institution} onChange={e => handleNestedInputChange('education', index, 'institution', e.target.value)} />
              <StyledInput label="Degree" id={`edu-degree-${index}`} value={edu.degree} onChange={e => handleNestedInputChange('education', index, 'degree', e.target.value)} />
              <StyledInput label="Graduation Date" id={`edu-grad-${index}`} type="month" value={edu.graduationDate} onChange={e => handleNestedInputChange('education', index, 'graduationDate', e.target.value)} />
              <StyledButton type="button" onClick={() => removeNestedItem('education', index)} className="bg-red-500 hover:bg-red-600 text-xs">Remove</StyledButton>
            </div>
          ))}
          <StyledButton type="button" onClick={() => addNestedItem('education', { id: uuidv4(), institution: '', degree: '', graduationDate: '' })}>Add Education</StyledButton>
        </fieldset>

        {/* Work Experience - Similar structure to Education */}
        <fieldset className="border p-4 rounded-md">
            <legend className="text-lg font-medium text-gray-700 dark:text-gray-300 px-2">Work Experience</legend>
            {profile.workExperience?.map((exp, index) => (
                <div key={exp.id || index} className="border-b pb-4 mb-4 space-y-2">
                    <StyledInput label="Company" id={`work-company-${index}`} value={exp.company} onChange={e => handleNestedInputChange('workExperience', index, 'company', e.target.value)} />
                    <StyledInput label="Job Title" id={`work-title-${index}`} value={exp.jobTitle} onChange={e => handleNestedInputChange('workExperience', index, 'jobTitle', e.target.value)} />
                    <StyledInput label="Start Date" id={`work-start-${index}`} type="month" value={exp.startDate} onChange={e => handleNestedInputChange('workExperience', index, 'startDate', e.target.value)} />
                    <StyledInput label="End Date (leave blank if current)" id={`work-end-${index}`} type="month" value={exp.endDate || ''} onChange={e => handleNestedInputChange('workExperience', index, 'endDate', e.target.value)} />
                    <StyledTextarea label="Responsibilities (one per line)" id={`work-resp-${index}`} value={exp.responsibilities} onChange={e => handleNestedInputChange('workExperience', index, 'responsibilities', e.target.value)} />
                    <StyledButton type="button" onClick={() => removeNestedItem('workExperience', index)} className="bg-red-500 hover:bg-red-600 text-xs">Remove</StyledButton>
                </div>
            ))}
            <StyledButton type="button" onClick={() => addNestedItem('workExperience', { id: uuidv4(), company: '', jobTitle: '', startDate: '', responsibilities: '' })}>Add Work Experience</StyledButton>
        </fieldset>

        {/* Projects - Similar structure */}
         <fieldset className="border p-4 rounded-md">
            <legend className="text-lg font-medium text-gray-700 dark:text-gray-300 px-2">Projects</legend>
            {profile.projects?.map((proj, index) => (
                <div key={proj.id || index} className="border-b pb-4 mb-4 space-y-2">
                    <StyledInput label="Project Name" id={`proj-name-${index}`} value={proj.projectName} onChange={e => handleNestedInputChange('projects', index, 'projectName', e.target.value)} />
                    <StyledTextarea label="Description" id={`proj-desc-${index}`} value={proj.description} onChange={e => handleNestedInputChange('projects', index, 'description', e.target.value)} />
                    <StyledInput label="Technologies Used (comma-separated)" id={`proj-tech-${index}`} value={proj.technologiesUsed} onChange={e => handleNestedInputChange('projects', index, 'technologiesUsed', e.target.value)} />
                    <StyledButton type="button" onClick={() => removeNestedItem('projects', index)} className="bg-red-500 hover:bg-red-600 text-xs">Remove</StyledButton>
                </div>
            ))}
            <StyledButton type="button" onClick={() => addNestedItem('projects', { id: uuidv4(), projectName: '', description: '', technologiesUsed: '' })}>Add Project</StyledButton>
        </fieldset>


        {/* Skills */}
        <fieldset className="border p-4 rounded-md">
          <legend className="text-lg font-medium text-gray-700 dark:text-gray-300 px-2">Skills</legend>
          <StyledTextarea label="Technical Skills (comma or newline separated)" id="technicalSkills" name="technicalSkills" value={profile.technicalSkills || ''} onChange={handleInputChange} />
          <StyledTextarea label="Soft Skills (comma or newline separated)" id="softSkills" name="softSkills" value={profile.softSkills || ''} onChange={handleInputChange} />
        </fieldset>

        {/* Certifications/Awards */}
        <fieldset className="border p-4 rounded-md">
          <legend className="text-lg font-medium text-gray-700 dark:text-gray-300 px-2">Certifications & Awards</legend>
          <StyledTextarea label="List your certifications and awards" id="certificationsAwards" name="certificationsAwards" value={profile.certificationsAwards || ''} onChange={handleInputChange} />
        </fieldset>

        {/* Generic Answers */}
        <fieldset className="border p-4 rounded-md">
          <legend className="text-lg font-medium text-gray-700 dark:text-gray-300 px-2">Generic Answers</legend>
          <StyledTextarea label="Strengths" id="strengths" name="strengths" value={profile.strengths || ''} onChange={handleInputChange} />
          <StyledTextarea label="Weaknesses" id="weaknesses" name="weaknesses" value={profile.weaknesses || ''} onChange={handleInputChange} />
          <StyledTextarea label="Career Goals" id="careerGoals" name="careerGoals" value={profile.careerGoals || ''} onChange={handleInputChange} />
           {/* TODO: Add UI for customGenericAnswers array */}
        </fieldset>

        {/* API Key */}
        <fieldset className="border p-4 rounded-md">
          <legend className="text-lg font-medium text-gray-700 dark:text-gray-300 px-2">External API Key</legend>
          <StyledInput label="API Key (e.g., for AI services)" id="externalApiKey" name="externalApiKey" type="password" value={profile.externalApiKey || ''} onChange={handleInputChange} placeholder="Paste your API key here" />
           <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This key will be stored securely and used for advanced automation tasks.</p>
        </fieldset>

        <div className="flex justify-end pt-4">
          <StyledButton type="submit" disabled={saving || loading}>
            {saving ? 'Saving...' : 'Save Profile'}
          </StyledButton>
        </div>
      </form>
    </div>
  );
};

export default ProfileManagement;
