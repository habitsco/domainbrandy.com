export interface FormData {
  name: string;
  email: string;
  offer: number;
  yourMessage: string;
  honeypot?: string;
  captchaAnswer?: string;
  domain: string;
}

export interface FormField {
  name: string;
  value: string | number;
}

export interface FormState {
  name: string;
  email: string;
  yourMessage: string;
  honeypot?: string;
  offer: number;
  captchaAnswer: number;
  domain: string;
}

