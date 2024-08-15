'use server';
import {FormData, FormState, FormField} from '@/app/config/types';
const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID as string;
import { revalidatePath } from 'next/cache';
import validator from 'validator';

const pluckValues = (formData: FormData, fields: string[]): FormState => {
  const symbols = Object.getOwnPropertySymbols(formData);
  const state = symbols.length > 0 ? (formData[symbols[0]] as FormField[]) : [];

  return fields.reduce((acc, field) => {
    const found = state.find(item => item.name === field);
    if (found) {
      acc[field as keyof FormState] = found.value;
    }
    return acc;
  }, {} as FormState);
};

import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

let auth: JWT | null = null;

export const getAuth = async (): Promise<JWT> => {
  if (!auth) {
    auth = new google.auth.JWT({
      email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      key: process.env.GOOGLE_SHEETS_PRIVATE_KEY,
      scopes: SCOPES,
    });
  }
  console.log('auth', process.env.GOOGLE_SHEETS_CLIENT_EMAIL, process.env.GOOGLE_SHEETS_PRIVATE_KEY)
  ;
  return auth;
};

const appendToGoogleSheet = async (spreadsheetId: string, values: any[]) => {
  const auth = await getAuth();
  const sheets = google.sheets({ version: 'v4', auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'Sheet1!A1',
    valueInputOption: 'RAW',
    requestBody: {
      values: [values],
    },
  });
};

const validateInput = (name: string, email: string, offer: number, message: string) => {
  if (!validator.isLength(name, { min: 1, max: 100 })) {
    return { valid: false, message: 'Name must be between 1 and 100 characters' };
  }
  if (!validator.isEmail(email)) {
    return { valid: false, message: 'Invalid email address' };
  }
  if (!validator.isLength(message, { min: 1, max: 300 })) {
    return { valid: false, message: 'Message must be between 1 and 500 characters' };
  }
  if (!validator.isNumeric(String(offer)) || !validator.isInt(String(offer), { min: 1 })) {
    return { valid: false, message: 'Offer must be valid number' };
  }
  return { valid: true };
};

const validateCaptcha = (captchaAnswer: number) => {
  return captchaAnswer === 6;
};


export async function handleFormSubmission(prevState: {
  message: string;
  valid: boolean;
}, formData: FormData) {
  console.log(process.env);
    const { name, email, yourMessage, honeypot, offer, captchaAnswer, domain } = pluckValues(formData, ['name', 'email', 'yourMessage', 'honeypot', 'offer','captchaAnswer', 'domain']);
    console.log({ name, email, yourMessage, honeypot, captchaAnswer, offer, domain });

    if (honeypot) {
      return { valid: false, message: 'Invalid submission detected.' };
    }

    const validation = validateInput(name as string, email as string, offer as number, yourMessage as string);
    console.log(validation);
    if (!validation.valid) {
      return { valid: false, message: validation.message };
    }

    if (!validateCaptcha(parseInt(String(captchaAnswer)))) {
      return { valid: false, message: 'Invalid captcha answer.' };
    }

    const sanitizedEmail = validator.normalizeEmail(email);
    const sanitizedMessage = validator.escape(yourMessage);
    const sanitizedName = validator.escape(name);
    const sanitizedDomainName = validator.escape(domain);
    const sanitizedOffer = validator.escape(offer);
  const date = new Date();
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

    try {
      await appendToGoogleSheet(spreadsheetId, [sanitizedDomainName,sanitizedName, sanitizedEmail, sanitizedMessage, sanitizedOffer, formattedDate]);
    } catch (error) {
      console.log(error);
      return { valid: false, message: 'Something went wrong. Please try again later.' };
    }

    revalidatePath('/');

    return { valid: true, message: 'Form submitted successfully' };
    }
