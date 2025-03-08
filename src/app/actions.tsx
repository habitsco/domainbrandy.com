"use server";
import { appendToGoogleSheet } from "@/app/utils";
const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID as string;
import { revalidatePath } from "next/cache";
import validator from "validator";

const validateInput = (
  name: string,
  email: string,
  offer: number,
  message: string,
) => {
  if (!validator.isLength(name, { min: 1, max: 100 })) {
    return {
      valid: false,
      message: "Name must be between 1 and 100 characters",
    };
  }
  if (!validator.isEmail(email)) {
    return { valid: false, message: "Invalid email address" };
  }
  if (!validator.isLength(message, { min: 1, max: 300 })) {
    return {
      valid: false,
      message: "Message must be between 1 and 500 characters",
    };
  }
  if (
    !validator.isNumeric(String(offer)) ||
    !validator.isInt(String(offer), { min: 1 })
  ) {
    return { valid: false, message: "Offer must be valid number" };
  }
  return { valid: true, message: "Form submitted successfully" };
};

const validateCaptcha = (captchaAnswer: number) => {
  return captchaAnswer === 6;
};

type FormSubmissionData = {
  name: string;
  email: string;
  yourMessage: string;
  honeypot?: string;
  offer: number;
  captchaAnswer: string;
  domain: string;
  get: (key: string) => unknown
};

export async function handleFormSubmission(
  prevState: unknown,
  formData: FormData,
) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const yourMessage = formData.get("yourMessage") as string;
  const honeypot = formData.get("honeypot") as string;
  const offer = Number(formData.get("offer")) as number;
  const captchaAnswer = formData.get("captchaAnswer") as string;
  const domain = formData.get("domain") as string;

  console.log('Form Submission', {
    name,
    email,
    yourMessage,
    honeypot,
    captchaAnswer,
    offer,
    domain,
  });

  if (honeypot) {
    return { valid: false, message: "Invalid submission detected." };
  }

  const validation = validateInput(
    name as string,
    email as string,
    offer as number,
    yourMessage as string,
  );

  console.log({ validation });

  if (!validation.valid) {
    return { valid: false, message: validation.message };
  }

  if (!validateCaptcha(parseInt(captchaAnswer))) {
    return { valid: false, message: "Invalid captcha answer." };
  }

  const sanitizedEmail = validator.normalizeEmail(email);
  const sanitizedMessage = validator.escape(yourMessage);
  const sanitizedName = validator.escape(name);
  const sanitizedDomainName = validator.escape(domain);
  const sanitizedOffer = validator.escape(offer.toString());
  const date = new Date();
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  try {
    await appendToGoogleSheet(spreadsheetId, [
      sanitizedDomainName,
      sanitizedName,
      sanitizedEmail,
      sanitizedMessage,
      sanitizedOffer,
      formattedDate,
    ]);
  } catch (error) {
    console.log(error);
    return {
      valid: false,
      message: "Something went wrong. Please try again later.",
    };
  }

  revalidatePath("/");

  return { valid: true, message: "Form submitted successfully" };
}
