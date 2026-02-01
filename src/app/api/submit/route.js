import { NextResponse } from 'next/server';
import { validateFormData } from '@/lib/services/openai';
import { validateField, getFormTemplate } from '@/lib/services/forms';
import { saveSubmission, getSubmissions, getSubmission, getProfile } from '@/lib/services/storage';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const formType = searchParams.get('formType');
    const status = searchParams.get('status');

    if (id) {
      const submission = await getSubmission(id);
      if (!submission) {
        return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
      }
      return NextResponse.json({ submission });
    }

    const submissions = await getSubmissions(formType, status);
    return NextResponse.json({ submissions });
  } catch (error) {
    console.error('Get submissions error:', error);
    return NextResponse.json(
      { error: 'Failed to get submissions' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { formType, data, status = 'draft' } = await request.json();

    if (!formType || !data) {
      return NextResponse.json(
        { error: 'Form type and data required' },
        { status: 400 }
      );
    }

    // Validate fields
    const template = getFormTemplate(formType);
    const errors = [];

    if (template) {
      for (const field of template.fields) {
        const validation = validateField(field, data[field.name]);
        if (!validation.valid) {
          errors.push({ field: field.name, error: validation.error });
        }
      }
    }

    if (status === 'complete' && errors.length > 0) {
      return NextResponse.json({
        success: false,
        errors,
        message: 'Please fix validation errors before completing',
      });
    }

    // AI validation if completing
    let aiValidation = null;
    if (status === 'complete' && process.env.OPENAI_API_KEY) {
      aiValidation = await validateFormData(formType, data);
      if (!aiValidation.isValid) {
        return NextResponse.json({
          success: false,
          errors: aiValidation.errors,
          warnings: aiValidation.warnings,
          message: 'AI validation found issues',
        });
      }
    }

    const submission = await saveSubmission({
      formType,
      data,
      status,
      errors: errors.length > 0 ? errors : undefined,
      aiValidation,
    });

    return NextResponse.json({
      success: true,
      submission,
    });
  } catch (error) {
    console.error('Submit error:', error);
    return NextResponse.json(
      { error: 'Failed to save submission', details: error.message },
      { status: 500 }
    );
  }
}
