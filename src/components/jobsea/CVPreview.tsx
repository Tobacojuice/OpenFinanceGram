interface CVPreviewProps {
  cvData: {
    fullName: string;
    email: string;
    phone: string;
    linkedin: string;
    summary: string;
    experience: Array<{
      title: string;
      company: string;
      startDate: string;
      endDate: string;
      description: string;
    }>;
    education: Array<{
      degree: string;
      institution: string;
      year: string;
      gpa?: string;
    }>;
    skills: string[];
    certifications: string[];
  };
  templateId: string;
}

export default function CVPreview({ cvData, templateId }: CVPreviewProps) {
  // Simple, clean, ATS-friendly layout
  return (
    <div className="bg-white text-black p-8 shadow-lg rounded-lg min-h-[800px] font-serif">
      {/* Header Section */}
      <div className="border-b-2 border-gray-800 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {cvData.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-700">
          {cvData.email && <span>{cvData.email}</span>}
          {cvData.phone && <span>•</span>}
          {cvData.phone && <span>{cvData.phone}</span>}
          {cvData.linkedin && <span>•</span>}
          {cvData.linkedin && <span className="break-all">{cvData.linkedin}</span>}
        </div>
      </div>

      {/* Professional Summary */}
      {cvData.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2 uppercase tracking-wide border-b border-gray-300 pb-1">
            Professional Summary
          </h2>
          <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
            {cvData.summary}
          </p>
        </div>
      )}

      {/* Experience Section */}
      {cvData.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide border-b border-gray-300 pb-1">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {cvData.experience.map((exp, idx) => (
              <div key={idx} className="text-sm">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold text-gray-900">{exp.title || "Position Title"}</h3>
                    <p className="text-gray-700 font-semibold">{exp.company || "Company Name"}</p>
                  </div>
                  <span className="text-gray-600 text-xs whitespace-nowrap">
                    {exp.startDate || "Start"} - {exp.endDate || "Present"}
                  </span>
                </div>
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {exp.description || "Job description and achievements..."}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education Section */}
      {cvData.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide border-b border-gray-300 pb-1">
            Education
          </h2>
          <div className="space-y-3">
            {cvData.education.map((edu, idx) => (
              <div key={idx} className="text-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{edu.degree || "Degree"}</h3>
                    <p className="text-gray-700">{edu.institution || "Institution"}</p>
                    {edu.gpa && <p className="text-gray-600 text-xs">GPA: {edu.gpa}</p>}
                  </div>
                  <span className="text-gray-600 text-xs whitespace-nowrap">
                    {edu.year || "Year"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills Section */}
      {cvData.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2 uppercase tracking-wide border-b border-gray-300 pb-1">
            Skills
          </h2>
          <p className="text-sm text-gray-800">
            {cvData.skills.join(" • ")}
          </p>
        </div>
      )}

      {/* Certifications Section */}
      {cvData.certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2 uppercase tracking-wide border-b border-gray-300 pb-1">
            Certifications
          </h2>
          <ul className="text-sm text-gray-800 space-y-1">
            {cvData.certifications.map((cert, idx) => (
              <li key={idx}>• {cert}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ATS-Friendly Note */}
      <div className="mt-8 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          This CV uses an ATS-optimized format based on {templateId} template
        </p>
      </div>
    </div>
  );
}
