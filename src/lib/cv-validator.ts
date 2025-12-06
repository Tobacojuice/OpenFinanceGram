export interface CVData {
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  summary?: string;
  education: Array<{
    school: string;
    degree: string;
    gpa?: string;
    location: string;
    dates: string;
    honors?: string[];
  }>;
  experience: Array<{
    company: string;
    title: string;
    location: string;
    dates: string;
    bullets: string[];
  }>;
  skills: string[];
  certifications?: string[];
  interests?: string[];
}

export const validateIBCV = (data: CVData, templateId: string): string[] => {
  const warnings: string[] = [];

  // ONE PAGE RULE for IB templates
  if (templateId.includes('-ib') || templateId.includes('openbb-quant')) {
    const estimatedLength = 
      data.experience.reduce((acc, exp) => acc + exp.bullets.length * 0.15, 0) +
      data.education.length * 0.2 +
      0.5; // header + skills

    if (estimatedLength > 1.0) {
      warnings.push('⚠️ CV exceeds one page - remove non-essential bullets or shorten descriptions');
    }
  }

  // DEAL BULLETS REQUIRED for IB roles
  if (templateId.includes('-ib')) {
    data.experience.forEach((exp) => {
      const hasDealBullet = exp.bullets.some(b => 
        b.includes('$') || 
        b.includes('transaction') || 
        b.includes('deal') ||
        b.includes('M&A') ||
        b.includes('billion') ||
        b.includes('million')
      );
      
      const isFinanceRole = exp.company.toLowerCase().includes('goldman') ||
        exp.company.toLowerCase().includes('morgan') ||
        exp.company.toLowerCase().includes('bank');
      
      if (isFinanceRole && !hasDealBullet) {
        warnings.push(`⚠️ ${exp.company}: Missing dollar amounts or deal details in bullets`);
      }
    });
  }

  // GPA CHECK for IB roles
  if (templateId.includes('-ib')) {
    data.education.forEach(edu => {
      if (!edu.gpa && edu.school.toLowerCase().includes('university')) {
        warnings.push(`⚠️ ${edu.school}: GPA missing (include if >3.5 for IB roles)`);
      }
      
      if (edu.gpa) {
        const gpaValue = parseFloat(edu.gpa.split('/')[0]);
        if (gpaValue < 3.5) {
          warnings.push(`ℹ️ ${edu.school}: GPA below 3.5 may be omitted for IB roles`);
        }
      }
    });
  }

  // CONTACT INFO VALIDATION
  if (!data.fullName) warnings.push('❌ Full name is required');
  if (!data.email || !data.email.includes('@')) warnings.push('❌ Valid email is required');
  if (!data.phone) warnings.push('❌ Phone number is required');
  if (!data.linkedin) warnings.push('⚠️ LinkedIn URL is recommended');

  // EXPERIENCE VALIDATION
  if (data.experience.length === 0) {
    warnings.push('❌ At least one experience entry is required');
  }

  data.experience.forEach((exp, idx) => {
    if (!exp.company || !exp.title || !exp.dates) {
      warnings.push(`❌ Experience #${idx + 1}: Missing company, title, or dates`);
    }
    if (exp.bullets.length === 0) {
      warnings.push(`⚠️ ${exp.company}: No bullet points added`);
    }
    if (exp.bullets.length < 3) {
      warnings.push(`ℹ️ ${exp.company}: Consider adding more bullet points (3-5 recommended)`);
    }
  });

  // EDUCATION VALIDATION
  if (data.education.length === 0) {
    warnings.push('❌ At least one education entry is required');
  }

  // SKILLS VALIDATION for tech roles
  if (templateId.includes('tech') || templateId.includes('eng')) {
    if (data.skills.length < 5) {
      warnings.push('⚠️ Tech roles should list at least 5 technical skills');
    }
  }

  return warnings;
};

export const calculateATSScore = (data: CVData): number => {
  let score = 0;

  // Contact Information (30 points)
  if (data.fullName && data.fullName.length > 0) score += 10;
  if (data.email && data.email.includes('@')) score += 10;
  if (data.phone) score += 5;
  if (data.linkedin) score += 5;

  // Experience (35 points)
  if (data.experience.length > 0) score += 10;
  if (data.experience.length >= 2) score += 5;
  const totalBullets = data.experience.reduce((acc, exp) => acc + exp.bullets.length, 0);
  if (totalBullets >= 5) score += 10;
  if (totalBullets >= 10) score += 5;
  if (data.experience.some(exp => exp.bullets.some(b => b.includes('$')))) score += 5;

  // Education (20 points)
  if (data.education.length > 0) score += 10;
  if (data.education.some(edu => edu.gpa)) score += 5;
  if (data.education.some(edu => edu.honors && edu.honors.length > 0)) score += 5;

  // Skills (15 points)
  if (data.skills.length >= 3) score += 5;
  if (data.skills.length >= 5) score += 5;
  if (data.skills.length >= 8) score += 5;

  return Math.min(100, score);
};
