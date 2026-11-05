import { z } from "zod";
import { createClient } from "@/lib/supabase/client";

const email = z
  .string()
  .trim()
  .min(1, "Enter your email")
  .email("Enter a valid email address");

function friendlyError(message: string): string {
  if (message.toLowerCase().includes("rate limit")) {
    return "Too many requests. Please try again later.";
  }
  return "Something went wrong. Please try again.";
}

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password"),
});

export const signupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Enter your name")
      .max(60, "That name is too long"),
    email,
    password: z
      .string()
      .min(8, "Use at least 8 characters")
      .regex(/[A-Za-z]/, "Include at least one letter")
      .regex(/\d/, "Include at least one number"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type SignupValues = z.infer<typeof signupSchema>;

export type AuthResult =
  | { ok: true; message?: string }
  | { ok: false; message: string };

export async function requestPasswordReset(email: string): Promise<AuthResult> {
  const supabase = createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    // after the email link is clicked, the callback route signs the user in, then sends them to /reset-password
    redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
  });

  if (error) {
    if (error.message.toLowerCase().includes("rate limit")) {
      return { ok: false, message: friendlyError(error.message) };
    }
    // For other errors we still show the same "check your email" message, so nobody can
    // use this form to find out which emails have accounts. The real reason goes to the console.
    console.warn("Password reset request error:", error.message);
  }
  return { ok: true };
}

export async function updatePassword(password: string): Promise<AuthResult> {
  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    if (error.message.toLowerCase().includes("different")) {
      return {
        ok: false,
        message: "Choose a password that is different from your old one.",
      };
    }
    return {
      ok: false,
      message:
        "Couldn't update your password. The link may have expired, so request a new one.",
    };
  }
  return { ok: true };
}

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Use at least 8 characters")
      .regex(/[A-Za-z]/, "Include at least one letter")
      .regex(/\d/, "Include at least one number"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  });

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
