"use client";

import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react"; // Added for error handling

interface SignInFormValues {
  email: string;
  password: string;
}

export default function SignInForm() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<SignInFormValues>();
  const { signIn, setActive } = useSignIn();
  const [error, setError] = useState<string | null>(null); // State for error handling

  const onSubmit = async ({ email, password }: SignInFormValues) => {
    try {
      if (!signIn) {
        console.log("Clerk sign in not available");
        return null;
      }

      const response = await signIn.create({
        identifier: email,
        password,
      });

      await setActive({ session: response.createdSessionId });
      router.push("/");

      // Clear any previous error messages
      setError(null);
    } catch (error) {
      if (error.response) {
        // Server returned an error response
        console.error("Server Error:", error.response.data);

        // Display the server error message to the user
        setError("An error occurred during sign-in. Please check your credentials.");
      } else {
        // An error occurred but no response was received (e.g., network error)
        console.error("An error occurred during sign-in:", error);

        // Display a generic error message to the user
        setError("An error occurred during sign-in. Please try again later.");
      }
    }
  };

  return (
    <form
      className="flex flex-col items-center justify-center w-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-4 w-full">
        <h1 className="text-2xl font-bold">Sign In</h1>
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
        <button
          type="submit"
          className="bg-blue-400 text-white font-medium py-2 rounded-md"
        >
          Continue
        </button>
        
        {/* Display error message if an error occurred */}
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </form>
  );
}
