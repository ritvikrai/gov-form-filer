import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const PROFILES_FILE = path.join(DATA_DIR, 'profiles.json');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (e) {}
}

// User profiles (to auto-fill common fields)
export async function getProfile(userId = 'default') {
  await ensureDataDir();
  try {
    const file = await fs.readFile(PROFILES_FILE, 'utf-8');
    const data = JSON.parse(file);
    return data.profiles[userId] || {};
  } catch (e) {
    return {};
  }
}

export async function saveProfile(userId = 'default', profile) {
  await ensureDataDir();
  let data;
  try {
    const file = await fs.readFile(PROFILES_FILE, 'utf-8');
    data = JSON.parse(file);
  } catch (e) {
    data = { profiles: {} };
  }
  
  data.profiles[userId] = {
    ...data.profiles[userId],
    ...profile,
    updatedAt: new Date().toISOString(),
  };
  
  await fs.writeFile(PROFILES_FILE, JSON.stringify(data, null, 2));
  return data.profiles[userId];
}

// Form submissions (drafts and completed)
export async function saveSubmission(submission) {
  await ensureDataDir();
  let data;
  try {
    const file = await fs.readFile(SUBMISSIONS_FILE, 'utf-8');
    data = JSON.parse(file);
  } catch (e) {
    data = { submissions: [] };
  }
  
  const entry = {
    id: submission.id || Date.now().toString(),
    ...submission,
    updatedAt: new Date().toISOString(),
  };
  
  if (!submission.id) {
    entry.createdAt = new Date().toISOString();
    data.submissions.unshift(entry);
  } else {
    const index = data.submissions.findIndex(s => s.id === submission.id);
    if (index >= 0) {
      data.submissions[index] = entry;
    } else {
      data.submissions.unshift(entry);
    }
  }
  
  await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify(data, null, 2));
  return entry;
}

export async function getSubmissions(formType = null, status = null) {
  await ensureDataDir();
  try {
    const file = await fs.readFile(SUBMISSIONS_FILE, 'utf-8');
    let submissions = JSON.parse(file).submissions;
    
    if (formType) {
      submissions = submissions.filter(s => s.formType === formType);
    }
    if (status) {
      submissions = submissions.filter(s => s.status === status);
    }
    
    return submissions;
  } catch (e) {
    return [];
  }
}

export async function getSubmission(id) {
  await ensureDataDir();
  try {
    const file = await fs.readFile(SUBMISSIONS_FILE, 'utf-8');
    const data = JSON.parse(file);
    return data.submissions.find(s => s.id === id);
  } catch (e) {
    return null;
  }
}
