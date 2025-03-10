export interface FormField {
  name: string;
  value: string | number;
  disabled?: boolean;
}

export interface FormState {
  name: string;
  email: string;
  yourMessage: string;
  honeypot?: string;
  offer: number;
  captchaAnswer: number;
  domain: string;
  disabled?: boolean;
}
