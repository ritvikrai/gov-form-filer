// Common US government forms database
export const FORM_TEMPLATES = {
  'W-4': {
    name: 'Employee\'s Withholding Certificate',
    agency: 'IRS',
    purpose: 'Tell your employer how much federal income tax to withhold',
    fields: [
      { name: 'firstName', label: 'First name', type: 'text', required: true },
      { name: 'lastName', label: 'Last name', type: 'text', required: true },
      { name: 'ssn', label: 'Social Security Number', type: 'ssn', required: true },
      { name: 'address', label: 'Address', type: 'text', required: true },
      { name: 'filingStatus', label: 'Filing status', type: 'select', required: true,
        options: ['Single or Married filing separately', 'Married filing jointly', 'Head of household'] },
      { name: 'multipleJobs', label: 'Multiple jobs?', type: 'boolean' },
      { name: 'dependentCredit', label: 'Dependent credit', type: 'number' },
      { name: 'otherIncome', label: 'Other income', type: 'number' },
      { name: 'deductions', label: 'Deductions', type: 'number' },
      { name: 'extraWithholding', label: 'Extra withholding', type: 'number' },
    ],
    requiredDocs: ['Social Security card', 'Previous W-4 (if updating)'],
  },
  'I-9': {
    name: 'Employment Eligibility Verification',
    agency: 'USCIS',
    purpose: 'Verify identity and employment authorization',
    fields: [
      { name: 'lastName', label: 'Last name', type: 'text', required: true },
      { name: 'firstName', label: 'First name', type: 'text', required: true },
      { name: 'middleInitial', label: 'Middle initial', type: 'text' },
      { name: 'otherLastNames', label: 'Other last names used', type: 'text' },
      { name: 'address', label: 'Address', type: 'text', required: true },
      { name: 'dob', label: 'Date of birth', type: 'date', required: true },
      { name: 'ssn', label: 'Social Security Number', type: 'ssn', required: true },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'phone', label: 'Phone', type: 'phone' },
      { name: 'citizenshipStatus', label: 'Citizenship status', type: 'select', required: true,
        options: ['US Citizen', 'Noncitizen national', 'Lawful permanent resident', 'Alien authorized to work'] },
    ],
    requiredDocs: ['List A document (passport) OR List B + List C documents'],
  },
  'SS-5': {
    name: 'Application for a Social Security Card',
    agency: 'SSA',
    purpose: 'Apply for new, replacement, or corrected Social Security card',
    fields: [
      { name: 'fullName', label: 'Full name', type: 'text', required: true },
      { name: 'nameAtBirth', label: 'Name at birth', type: 'text' },
      { name: 'dob', label: 'Date of birth', type: 'date', required: true },
      { name: 'placeOfBirth', label: 'Place of birth', type: 'text', required: true },
      { name: 'citizenship', label: 'Citizenship', type: 'select', required: true,
        options: ['US Citizen', 'Legal Alien Allowed to Work', 'Legal Alien Not Allowed to Work', 'Other'] },
      { name: 'ethnicity', label: 'Ethnicity', type: 'select', options: ['Hispanic or Latino', 'Not Hispanic or Latino'] },
      { name: 'race', label: 'Race', type: 'multiselect' },
      { name: 'sex', label: 'Sex', type: 'select', required: true, options: ['Male', 'Female'] },
      { name: 'mothersMaidenName', label: 'Mother\'s maiden name', type: 'text' },
      { name: 'fathersName', label: 'Father\'s name', type: 'text' },
      { name: 'previousSSN', label: 'Previous SSN (if any)', type: 'ssn' },
      { name: 'phone', label: 'Phone', type: 'phone', required: true },
    ],
    requiredDocs: ['Proof of citizenship', 'Proof of identity', 'Proof of age'],
  },
};

export function getFormTemplate(formType) {
  return FORM_TEMPLATES[formType] || null;
}

export function getAvailableForms() {
  return Object.entries(FORM_TEMPLATES).map(([key, value]) => ({
    id: key,
    name: value.name,
    agency: value.agency,
    purpose: value.purpose,
  }));
}

export function validateField(field, value) {
  if (field.required && !value) {
    return { valid: false, error: 'This field is required' };
  }
  
  if (field.type === 'ssn' && value) {
    const ssnRegex = /^\d{3}-?\d{2}-?\d{4}$/;
    if (!ssnRegex.test(value)) {
      return { valid: false, error: 'Invalid SSN format (XXX-XX-XXXX)' };
    }
  }
  
  if (field.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return { valid: false, error: 'Invalid email format' };
    }
  }
  
  if (field.type === 'phone' && value) {
    const phoneRegex = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
    if (!phoneRegex.test(value)) {
      return { valid: false, error: 'Invalid phone format' };
    }
  }
  
  return { valid: true };
}
