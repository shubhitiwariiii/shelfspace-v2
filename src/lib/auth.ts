import type { LoginValues, SignupValues } from "@/lib/schemas/auth";

export type AuthResult = { ok: true } | { ok: false; message: string };

const NOT_CONNECTED =
  "Accounts aren't connected yet. This form is ready and will work once the backend is added.";

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Later: replace the bodies with Supabase calls. The forms won't change.
export async function signIn(values: LoginValues): Promise<AuthResult> {
  void values;
  await pause(700); // lets you see the loading state
  return { ok: false, message: NOT_CONNECTED };
}

export async function signUp(values: SignupValues): Promise<AuthResult> {
  void values;
  await pause(700);
  return { ok: false, message: NOT_CONNECTED };
}