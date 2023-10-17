"use client";

import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation"; // Changed from "next/navigation"
import { useState } from "react";
import { useForm } from "react-hook-form";

interface SignUpFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, watch, formState } = useForm<SignUpFormValues>();
  const { signUp } = useSignUp();

  const onSubmit = async ({ email, password }: SignUpFormValues) => {
    try {
      if (!signUp) {
        console.log("Clerk sign up not available");
        return null;
      }

      const response = await signUp.create({
        emailAddress: email,
        password,
      });

      if (response.unverifiedFields.includes("email_address")) {
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });

        router.push("/sign-up/verify-email-address");
      }
    } catch (err) {
      setError("Email address already in use");
      console.error(err);
    }
  };

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  return (
    <form
      className="flex flex-col items-center justify-center w-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-4 w-full">
        <h1 className="text-xl font-bold">Sign Up</h1>
        <div className="flex flex-col">
          <label htmlFor="email">Email Address</label>
          <input
            type="text"
            {...register("email", { required: true })}
            className="text-lg p-2 px-3 rounded-md text-black"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            {...register("password", { required: true })}
            className="text-lg p-2 px-3 rounded-md text-black"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            {...register("confirmPassword", {
              required: true,
              validate: (value) => value === password || "Passwords do not match",
            })}
            className="text-lg p-2 px-3 rounded-md text-black"
          />
        </div>
        {formState.errors.confirmPassword && (
          <p className="text-red-500">{formState.errors.confirmPassword.message}</p>
        )}
        <button
          type="submit"
          className="bg-blue-400 text-white font-medium py-2 rounded-md"
        >
          Continue
        </button>
        {error ? <p className="text-red-500">{error}</p> : null}
      </div>
    </form>
  );
}
