import { createClient } from "@/lib/supabase/client";
import type { LoginValues, SignupValues } from "@/lib/schemas/auth";

export type AuthResult =
  | { ok: true; needsEmailConfirmation?: boolean }
  | { ok: false; message: string };

// Turn Supabase's technical errors into messages a student can understand
function friendlyError(message: string) {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "Incorrect email or password.";
  if (m.includes("already registered") || m.includes("already been registered"))
    return "An account with this email already exists. Try logging in instead.";
  if (m.includes("rate limit")) return "Too many attempts. Please wait a few minutes and try again.";
  if (m.includes("email not confirmed")) return "Please confirm your email first. Check your inbox.";
  return "Something went wrong. Please try again.";
}

export async function signIn({ email, password }: LoginValues): Promise<AuthResult> {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, message: friendlyError(error.message) };
  return { ok: true };
}

export async function signUp({ name, email, password }: SignupValues): Promise<AuthResult> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  });
  if (error) return { ok: false, message: friendlyError(error.message) };
  // With email confirmation ON there is a user but no session yet
  return { ok: true, needsEmailConfirmation: !data.session };
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
}

export async function requestPasswordReset(email: string): Promise<AuthResult> {
  const supabase = createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
  });

  if (error) {
    if (error.message.toLowerCase().includes("rate limit")) {
      return { ok: false, message: friendlyError(error.message) };
    }
    console.warn("Password reset request error:", error.message);
    // While developing, show the real reason on screen
    if (process.env.NODE_ENV === "development") {
      return { ok: false, message: `Dev only: ${error.message}` };
    }
  }
  // In production we show the same success message for every email, so the form can't reveal who has an account
  return { ok: true };
}

export async function updatePassword(password: string): Promise<AuthResult> {
  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    if (error.message.toLowerCase().includes("different")) {
      return { ok: false, message: "Choose a password that is different from your old one." };
    }
    return {
      ok: false,
      message: "Couldn't update your password. The link may have expired, so request a new one.",
    };
  }
  return { ok: true };
}