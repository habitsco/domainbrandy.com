"use client";
import React, { useState, useActionState } from "react";
import { handleFormSubmission } from "@/app/actions";

interface ContactFormProps {
  domain: string;
}

const SubmitButton = ({
  pending,
  disabled,
}: {
  pending: boolean;
  disabled: boolean;
}) => {
  if (pending) {
    return (
      <button
        type="submit"
        disabled={disabled}
        className="w-full bg-gradient-to-r from-[#b0944c] to-[#8a7439] text-white px-4 py-3 rounded-md shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
      >
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Submitting...
      </button>
    );
  }

  return (
    <button
      type="submit"
      disabled={disabled}
      className="bg-gradient-to-r from-[#b0944c] to-[#8a7439] text-white px-8 py-4 rounded-md shadow-md hover:shadow-lg hover:from-[#9a8142] hover:to-[#756331] transition-all duration-300 text-center font-semibold w-full"
    >
      Make Offer
    </button>
  );
};

const ThankYouMessage = () => {
  return (
    <p className="mb-4 p-2 bg-green-100 text-green-600 text-center">
      Thank you for your submission. We will get back to you shortly.
    </p>
  );
};

const ContactForm: React.FC<ContactFormProps> = ({ domain }) => {
  const initialState = {
    name: "",
    email: "",
    offer: 1000,
    honeypot: "",
    yourMessage: "",
    captchaAnswer: "",
    domain,
  };
  const initialFormState = {
    message: "",
    valid: false,
    disabled: false,
  };
  const [formValues, setFormValue] = useState(initialState);
  const [dateNow] = useState(Date.now());
  const [form, formAction, pending] = useActionState(
    handleFormSubmission,
    initialFormState,
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormValue((prevState) => ({ ...prevState, [name]: value }));
  };

  const FormLabel = ({
    htmlFor,
    label,
  }: {
    htmlFor: string;
    label: string;
  }) => (
    <label
      htmlFor={htmlFor}
      className="block text-[#444444] dark:text-[#dcc397] font-semibold mb-2"
    >
      {label} <span className="text-red-400 ml-1">*</span>
    </label>
  );

  return form.valid === true ? (
    <ThankYouMessage />
  ) : (
    <form
      action={formAction}
      className="max-w-lg mx-auto p-4 bg-white dark:bg-[#2b2c2a] rounded-lg"
    >
      <h2 className="text-2xl font-bold text-[#444444] dark:text-[#dcc397] text-center">
        Make an Offer
      </h2>

      {form.message !== "" && (
        <p
          className={`mb-6 p-3 rounded-md ${form.valid === false ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}
        >
          {form.message}
        </p>
      )}

      <div className="mb-5">
        <FormLabel htmlFor="name" label="Name" />
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Your Name"
          className="w-full p-3 border border-gray-300 dark:border-[#444444] rounded-md focus:outline-none focus:ring-2 focus:ring-[#b0944c] text-black dark:text-white dark:bg-[#24201c]"
          maxLength={50}
          onChange={handleChange}
          value={formValues.name}
          required
        />
      </div>

      <div className="mb-5">
        <FormLabel htmlFor="email" label="Email" />
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Your Email"
          className="w-full p-3 border border-gray-300 dark:border-[#444444] rounded-md focus:outline-none focus:ring-2 focus:ring-[#b0944c] text-black dark:text-white dark:bg-[#24201c]"
          maxLength={50}
          onChange={handleChange}
          value={formValues.email}
          required
        />
      </div>

      <div className="mb-5">
        <FormLabel htmlFor="offer" label="Offer" />
        <div className="relative">
          <span className="absolute left-3 top-3 text-gray-500 dark:text-gray-400">
            $
          </span>
          <input
            type="number"
            id="offer"
            name="offer"
            placeholder="Your Offer"
            className="w-full p-3 pl-8 border border-gray-300 dark:border-[#444444] rounded-md focus:outline-none focus:ring-2 focus:ring-[#b0944c] text-black dark:text-white dark:bg-[#24201c]"
            onChange={handleChange}
            value={formValues.offer}
            required
          />
        </div>
      </div>

      <div className="mb-5">
        <FormLabel htmlFor="yourMessage" label="Message" />
        <textarea
          id="yourMessage"
          name="yourMessage"
          placeholder="Your Message"
          className="w-full p-3 border border-gray-300 dark:border-[#444444] rounded-md focus:outline-none focus:ring-2 focus:ring-[#b0944c] text-black dark:text-white dark:bg-[#24201c] min-h-[120px]"
          maxLength={300}
          onChange={handleChange}
          value={formValues.yourMessage}
          required
        ></textarea>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
          {formValues.yourMessage.length}/300
        </div>
      </div>

      <div className="mb-5">
        <FormLabel htmlFor="captchaAnswer" label="What is three + 3?" />
        <input
          type="text"
          id="captchaAnswer"
          name="captchaAnswer"
          placeholder="Your Answer"
          className="w-full p-3 border border-gray-300 dark:border-[#444444] rounded-md focus:outline-none focus:ring-2 focus:ring-[#b0944c] text-black dark:text-white dark:bg-[#24201c]"
          maxLength={3}
          onChange={handleChange}
          value={formValues.captchaAnswer}
          required
        />
      </div>

      <div className="hidden">
        <label
          htmlFor="domain"
          className="block text-[#444444] dark:text-[#dcc397] font-semibold mb-2"
        >
          Domain
        </label>
        <input
          type="text"
          id="domain"
          name="domain"
          className="w-full p-2 border border-gray-300 dark:border-[#444444]"
          maxLength={50}
          defaultValue={formValues.domain}
        />
      </div>

      <div className="hidden">
        <label
          htmlFor="honeypot"
          className="block text-[#444444] dark:text-[#dcc397] font-semibold mb-2"
        >
          Leave this field blank
        </label>
        <input
          type="text"
          id="honeypot"
          name="honeypot"
          className="w-full p-2 border border-gray-300 dark:border-[#444444]"
          maxLength={50}
        />
      </div>
      <div className="hidden">
        <label
          htmlFor="formLoadTime"
          className="block text-[#444444] dark:text-[#dcc397] font-semibold mb-2"
        >
          Leave this field blank
        </label>
        <input
          type="hidden"
          name="formLoadTime"
          value={dateNow}
          maxLength={50}
        />
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
        Fields marked with <span className="text-red-400">*</span> are required
      </div>

      <SubmitButton pending={pending} disabled={form.disabled || false} />
    </form>
  );
};

export default ContactForm;
