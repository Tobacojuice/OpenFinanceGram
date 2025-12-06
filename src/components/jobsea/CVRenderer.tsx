import { useState, useEffect, useRef } from 'react';
import { CVTemplate } from '@/lib/cv-templates';
import { CVData } from '@/lib/cv-validator';
import { AlertCircle } from 'lucide-react';
import '@/styles/cv-renderer.css';

interface CVRendererProps {
  template: CVTemplate;
  data: CVData;
}

export const CVRenderer = ({ template, data }: CVRendererProps) => {
  const [pageCount, setPageCount] = useState(1);
  const cvRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Calculate page count
    if (cvRef.current) {
      const height = cvRef.current.scrollHeight;
      const pageHeight = 1056; // 11 inches at 96 DPI
      const calculatedPages = Math.ceil(height / pageHeight);
      setPageCount(calculatedPages);
    }
  }, [template, data]);

  const isIBTemplate = template.id.includes('-ib') || template.id === 'openbb-quant';
  const excedsPageLimit = pageCount > template.pageLimit;

  return (
    <div className="relative">
      {excedsPageLimit && (
        <div className="absolute -top-16 left-0 right-0 bg-destructive/10 border-2 border-destructive text-destructive px-4 py-3 rounded-lg flex items-start gap-3 animate-pulse">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Page Limit Exceeded!</p>
            <p className="text-sm mt-1">
              This CV is {pageCount} pages but {template.name} requires {template.pageLimit} page{template.pageLimit > 1 ? 's' : ''}.
              {isIBTemplate && ' IB CVs MUST be 1 page - remove bullets or shorten content.'}
            </p>
          </div>
        </div>
      )}

      <div
        ref={cvRef}
        className="bg-white shadow-2xl cv-document"
        style={{
          fontFamily: template.fontFamily,
          fontSize: template.fontSize.body,
          lineHeight: template.lineHeight,
          color: template.colors.primary,
          padding: template.margins,
          minHeight: '11in',
          width: '8.5in',
        }}
      >
        {/* Header - Name and Contact */}
        <div className="text-center mb-4">
          <div
            className={isIBTemplate ? 'cv-ib-name' : 'cv-tech-name'}
            style={{ fontSize: template.fontSize.name, fontWeight: 600 }}
          >
            {data.fullName.toUpperCase()}
          </div>
          <div
            className="mt-2"
            style={{
              fontSize: template.fontSize.metadata,
              fontFamily: template.fontFamily,
            }}
          >
            {data.email} • {data.phone} • {data.linkedin}
          </div>
        </div>

        {/* Summary (for tech roles) */}
        {template.sections.includes('Summary') && data.summary && (
          <Section template={template} title="SUMMARY" isIB={isIBTemplate}>
            <p style={{ fontSize: template.fontSize.body }}>{data.summary}</p>
          </Section>
        )}

        {/* Education Section */}
        {template.sections.some(s => s.includes('Education')) && data.education?.length > 0 && (
          <Section template={template} title="EDUCATION" isIB={isIBTemplate}>
            {data.education.map((edu, i) => (
              <div key={i} className="mb-3 cv-no-break">
                <div className="flex justify-between items-baseline">
                  <span
                    className={isIBTemplate ? 'cv-ib-company' : 'cv-tech-company'}
                    style={{ fontSize: template.fontSize.companies, fontWeight: 600 }}
                  >
                    {edu.school}
                  </span>
                  <span className="cv-date-right" style={{ fontSize: template.fontSize.metadata }}>
                    {edu.dates}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ fontStyle: 'italic' }}>
                    {edu.degree}
                    {edu.gpa ? ` — GPA: ${edu.gpa}` : ''}
                  </span>
                  <span style={{ fontSize: template.fontSize.metadata }}>{edu.location}</span>
                </div>
                {edu.honors && edu.honors.length > 0 && (
                  <div className="mt-1" style={{ fontSize: template.fontSize.metadata }}>
                    • {edu.honors.join(' • ')}
                  </div>
                )}
              </div>
            ))}
          </Section>
        )}

        {/* Experience Section */}
        {template.sections.some(s => s.includes('Experience')) && data.experience?.length > 0 && (
          <Section template={template} title={template.sections.find(s => s.includes('Experience')) || 'EXPERIENCE'} isIB={isIBTemplate}>
            {data.experience.map((exp, i) => (
              <div key={i} className="mb-4 cv-no-break">
                <div className="flex justify-between items-baseline">
                  <span
                    className={isIBTemplate ? 'cv-ib-company' : 'cv-tech-company'}
                    style={{ fontSize: template.fontSize.companies, fontWeight: 600 }}
                  >
                    {exp.company}
                  </span>
                  <span className="cv-date-right" style={{ fontSize: template.fontSize.metadata }}>
                    {exp.dates}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ fontStyle: 'italic' }}>{exp.title}</span>
                  <span style={{ fontSize: template.fontSize.metadata }}>{exp.location}</span>
                </div>
                {exp.bullets.length > 0 && (
                  <ul className="cv-bullets mt-2" style={{ listStyleType: 'disc' }}>
                    {exp.bullets.map((bullet, j) => (
                      <li key={j} style={{ fontSize: template.fontSize.body }}>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </Section>
        )}

        {/* Skills Section */}
        {template.sections.some(s => s.includes('Skills')) && data.skills?.length > 0 && (
          <Section template={template} title={template.sections.find(s => s.includes('Skills')) || 'SKILLS'} isIB={isIBTemplate}>
            {isIBTemplate ? (
              <div>
                <div style={{ fontSize: template.fontSize.body }}>
                  <span style={{ fontWeight: 600 }}>Languages: </span>
                  {data.skills.filter(s => 
                    s.toLowerCase().includes('english') || 
                    s.toLowerCase().includes('spanish') || 
                    s.toLowerCase().includes('french') ||
                    s.toLowerCase().includes('german') ||
                    s.toLowerCase().includes('chinese')
                  ).join(', ') || 'English (Native)'}
                </div>
                <div className="mt-2" style={{ fontSize: template.fontSize.body }}>
                  <span style={{ fontWeight: 600 }}>Technical: </span>
                  {data.skills.filter(s => 
                    !s.toLowerCase().includes('english') && 
                    !s.toLowerCase().includes('spanish') && 
                    !s.toLowerCase().includes('french')
                  ).join(', ')}
                </div>
                {data.interests && data.interests.length > 0 && (
                  <div className="mt-2" style={{ fontSize: template.fontSize.body }}>
                    <span style={{ fontWeight: 600 }}>Interests: </span>
                    {data.interests.join(', ')}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ fontSize: template.fontSize.body }}>
                {data.skills.join(' • ')}
              </div>
            )}
          </Section>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <Section template={template} title="CERTIFICATIONS" isIB={isIBTemplate}>
            <div style={{ fontSize: template.fontSize.body }}>
              {data.certifications.join(' • ')}
            </div>
          </Section>
        )}

        {/* Footer Note */}
        <div className="mt-6 pt-3 border-t border-gray-200 text-center">
          <p style={{ fontSize: '8px', color: '#999' }}>
            ATS-optimized format • {template.name}
          </p>
        </div>
      </div>
    </div>
  );
};

interface SectionProps {
  template: CVTemplate;
  title: string;
  isIB: boolean;
  children: React.ReactNode;
}

const Section = ({ template, title, isIB, children }: SectionProps) => (
  <div className="cv-section mb-4">
    <h2
      className={isIB ? 'cv-ib-header' : 'cv-tech-header'}
      style={{
        fontSize: template.fontSize.headers,
        fontWeight: 600,
        borderBottom: `1pt solid ${template.colors.primary}`,
      }}
    >
      {title.toUpperCase()}
    </h2>
    <div className="mt-2">{children}</div>
  </div>
);
