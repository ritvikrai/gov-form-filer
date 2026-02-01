import { NextResponse } from 'next/server';
import { getAvailableForms, getFormTemplate } from '@/lib/services/forms';
import { analyzeFormRequirements } from '@/lib/services/openai';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const formType = searchParams.get('type');

    if (formType) {
      const template = getFormTemplate(formType);
      
      if (!template) {
        // Try AI analysis for unknown forms
        if (process.env.OPENAI_API_KEY) {
          const analysis = await analyzeFormRequirements(formType, '');
          return NextResponse.json({ form: analysis, source: 'ai' });
        }
        return NextResponse.json({ error: 'Form not found' }, { status: 404 });
      }
      
      return NextResponse.json({ form: template, source: 'database' });
    }

    const forms = getAvailableForms();
    return NextResponse.json({ forms });
  } catch (error) {
    console.error('Get forms error:', error);
    return NextResponse.json(
      { error: 'Failed to get forms' },
      { status: 500 }
    );
  }
}
