"use client";
import React, { useState, useActionState } from "react";
import { handleFormSubmission } from "@/app/actions";

interface ContactFormProps {
  domain: string;
}

const SubmitButton = ({ pending }: { pending: boolean }) => {
  if (pending) {
    return (
      <button
        type="submit"
        disabled
        className="w-full bg-black text-white px-4 py-2 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-slate-500 text-black"
      >
        Submitting...
      </button>
    );
  }

  return (
    <button
      type="submit"
      className="w-full bg-black text-white px-4 py-2 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-slate-500 text-black"
    >
      Submit
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
  };
  const [formValues, setFormValue] = useState(initialState);
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

  return form.valid === true ? (
    <ThankYouMessage />
  ) : (
    <form action={formAction} className="max-w-lg mx-auto p-6">
      {form.message !== "" && (
        <p
          className={`mb-4 p-2 ${form.valid === false ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}
        >
          {form.message}
        </p>
      )}
      <div className="mb-4">
        <label htmlFor="name" className="block text-white font-semibold mb-2">
          Name:
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Your Name"
          className="w-full p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-500 text-black"
          maxLength={50}
          onChange={handleChange}
          value={formValues.name}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-white font-semibold mb-2">
          Email:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Your Email"
          className="w-full p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-500 text-black"
          maxLength={50}
          onChange={handleChange}
          value={formValues.email}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="offer" className="block text-white font-semibold mb-2">
          Offer:
        </label>
        <input
          type="offer"
          id="offer"
          name="offer"
          placeholder="Your Offer"
          className="w-full p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-500 text-black"
          maxLength={50}
          onChange={handleChange}
          value={formValues.offer}
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="yourMessage"
          className="block text-white font-semibold mb-2"
        >
          Message:
        </label>
        <textarea
          id="yourMessage"
          name="yourMessage"
          placeholder="Your Message"
          className="w-full p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-500 text-black"
          maxLength={300}
          onChange={handleChange}
          value={formValues.yourMessage}
          required
        ></textarea>
      </div>
      <div className="mb-4">
        <label
          htmlFor="captchaAnswer"
          className="block text-white font-semibold mb-2"
        >
          What is three + 3?
        </label>
        <input
          type="text"
          id="captchaAnswer"
          name="captchaAnswer"
          placeholder="Your Answer"
          className="w-full p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-500 text-black"
          maxLength={3}
          onChange={handleChange}
          value={formValues.captchaAnswer}
          required
        />
      </div>
      <div className="hidden">
        <label htmlFor="domain" className="block text-white font-semibold mb-2">
          Domain
        </label>
        <input
          type="text"
          id="domain"
          name="domain"
          className="w-full p-2 border border-gray-300"
          maxLength={50}
          defaultValue={formValues.domain}
        />
      </div>
      <div className="hidden">
        <label
          htmlFor="honeypot"
          className="block text-white font-semibold mb-2"
        >
          Leave this field blank
        </label>
        <input
          type="text"
          id="honeypot"
          name="honeypot"
          className="w-full p-2 border border-gray-300"
          maxLength={50}
        />
      </div>
      <SubmitButton pending={pending} />
    </form>
  );
};

export default ContactForm;
