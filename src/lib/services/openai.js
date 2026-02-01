import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeFormRequirements(formName, formDescription) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are an expert in government forms and documentation. Analyze form requirements and provide guidance.

Return JSON:
{
  "formName": "Official form name",
  "purpose": "What this form is for",
  "eligibility": ["Who can/should file this"],
  "requiredFields": [
    {"field": "Field name", "type": "text/date/number/selection", "required": true, "help": "Guidance"}
  ],
  "requiredDocuments": ["Document 1", "Document 2"],
  "commonMistakes": ["Mistake to avoid"],
  "deadline": "If applicable",
  "estimatedTime": "15-30 minutes",
  "tips": ["Helpful tip"]
}`,
      },
      {
        role: 'user',
        content: `Analyze this government form:\nName: ${formName}\nDescription: ${formDescription}`,
      },
    ],
    max_tokens: 1500,
    temperature: 0.3,
  });

  const content = response.choices[0].message.content;
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {}
  
  return { formName, tips: [content] };
}

export async function suggestFieldValue(fieldName, context, userProfile) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'Based on the user profile and context, suggest appropriate values for government form fields.',
      },
      {
        role: 'user',
        content: `Field: ${fieldName}\nContext: ${context}\nUser profile: ${JSON.stringify(userProfile)}`,
      },
    ],
    max_tokens: 200,
  });

  return response.choices[0].message.content;
}

export async function validateFormData(formType, data) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Validate form data and identify issues. Return JSON:
{
  "isValid": true/false,
  "errors": [{"field": "Field name", "issue": "What's wrong", "fix": "How to fix"}],
  "warnings": [{"field": "Field", "warning": "Potential issue"}],
  "suggestions": ["Improvement suggestions"]
}`,
      },
      {
        role: 'user',
        content: `Form type: ${formType}\nData to validate:\n${JSON.stringify(data, null, 2)}`,
      },
    ],
    max_tokens: 800,
  });

  const content = response.choices[0].message.content;
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {}
  
  return { isValid: true, errors: [], warnings: [] };
}
