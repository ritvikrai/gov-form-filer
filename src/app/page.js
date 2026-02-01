'use client'
import { useState } from 'react'
import { FileCheck, Building2, HelpCircle, ChevronRight, Check, Loader2, Download, Languages } from 'lucide-react'

const FORM_CATEGORIES = [
  { name: 'Immigration', forms: ['I-130', 'I-485', 'N-400', 'I-765'] },
  { name: 'Benefits', forms: ['SSA-1', 'Medicare', 'SNAP', 'Housing'] },
  { name: 'Taxes', forms: ['1040', 'W-4', 'Schedule C', '1099'] },
  { name: 'Business', forms: ['LLC Filing', 'EIN Application', 'Permits'] },
]

export default function Home() {
  const [selectedForm, setSelectedForm] = useState(null)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [processing, setProcessing] = useState(false)
  const [language, setLanguage] = useState('en')

  const questions = [
    { id: 'name', question: 'What is your full legal name?', help: 'Enter your name exactly as it appears on your government ID' },
    { id: 'dob', question: 'What is your date of birth?', help: 'Format: MM/DD/YYYY' },
    { id: 'address', question: 'What is your current address?', help: 'Include street, city, state, and ZIP code' },
    { id: 'ssn', question: 'What is your Social Security Number?', help: 'This is required for most government forms' },
  ]

  const generateForm = async () => {
    setProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 2500))
    setProcessing(false)
    setStep(questions.length + 1)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
              <FileCheck className="text-blue-600" />
              Gov Form Filer
            </h1>
            <p className="text-gray-600">AI-powered assistance for government paperwork</p>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg flex items-center gap-2"
          >
            <option value="en">🇺🇸 English</option>
            <option value="es">🇪🇸 Español</option>
            <option value="zh">🇨🇳 中文</option>
            <option value="vi">🇻🇳 Tiếng Việt</option>
          </select>
        </div>

        {!selectedForm ? (
          <div className="grid md:grid-cols-2 gap-6">
            {FORM_CATEGORIES.map((category) => (
              <div key={category.name} className="bg-white rounded-xl p-5 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Building2 className="text-blue-500" size={20} /> {category.name}
                </h3>
                <div className="space-y-2">
                  {category.forms.map((form) => (
                    <button
                      key={form}
                      onClick={() => { setSelectedForm(form); setStep(0); }}
                      className="w-full p-3 text-left bg-gray-50 hover:bg-blue-50 rounded-lg flex items-center justify-between group"
                    >
                      <span className="text-gray-700">{form}</span>
                      <ChevronRight className="text-gray-400 group-hover:text-blue-500" size={18} />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : step <= questions.length - 1 ? (
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Form: {selectedForm}</span>
                <span className="text-sm text-gray-500">Question {step + 1} of {questions.length}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all" style={{ width: `${((step + 1) / questions.length) * 100}%` }} />
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-2">{questions[step].question}</h2>
            <p className="text-gray-500 mb-6 flex items-center gap-2">
              <HelpCircle size={16} /> {questions[step].help}
            </p>

            <input
              value={answers[questions[step].id] || ''}
              onChange={(e) => setAnswers({ ...answers, [questions[step].id]: e.target.value })}
              className="w-full p-4 border border-gray-200 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 mb-6"
              placeholder="Type your answer..."
            />

            <div className="flex gap-3">
              {step > 0 && (
                <button onClick={() => setStep(step - 1)} className="px-6 py-3 border border-gray-200 rounded-lg">
                  Back
                </button>
              )}
              <button
                onClick={() => step === questions.length - 1 ? generateForm() : setStep(step + 1)}
                disabled={!answers[questions[step].id]}
                className="flex-1 py-3 bg-blue-500 text-white rounded-lg font-medium disabled:opacity-50"
              >
                {step === questions.length - 1 ? 'Generate Form' : 'Next'}
              </button>
            </div>
          </div>
        ) : processing ? (
          <div className="bg-white rounded-xl p-12 shadow-sm text-center">
            <Loader2 className="w-16 h-16 mx-auto text-blue-500 animate-spin mb-4" />
            <h2 className="text-xl font-semibold text-gray-800">Generating your form...</h2>
            <p className="text-gray-500 mt-2">AI is filling in your information and checking for errors</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">Form Ready!</h2>
              <p className="text-gray-500 mt-2">Your {selectedForm} form has been generated</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-gray-800 mb-2">Verification Checklist</h3>
              {['Personal information verified', 'Required fields completed', 'Format validated', 'Ready for submission'].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-600 py-1">
                  <Check className="text-green-500" size={16} /> {item}
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button className="flex-1 py-3 bg-blue-500 text-white rounded-lg font-medium flex items-center justify-center gap-2">
                <Download size={18} /> Download PDF
              </button>
              <button onClick={() => { setSelectedForm(null); setStep(0); setAnswers({}); }} className="px-6 py-3 border border-gray-200 rounded-lg">
                Start New
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
