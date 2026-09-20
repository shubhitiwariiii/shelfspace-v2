"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Circle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, PasswordField } from "@/components/auth/form-fields";
import { signUp } from "@/lib/auth";
import { signupSchema, type SignupValues } from "@/lib/schemas/auth";
import { cn } from "@/lib/utils";

export function SignupForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const password = watch("password");
  const checks = [
    { label: "At least 8 characters", ok: password.length >= 8 },
    { label: "A letter", ok: /[A-Za-z]/.test(password) },
    { label: "A number", ok: /\d/.test(password) },
  ];

  async function onSubmit(values: SignupValues) {
    setServerError(null);
    const result = await signUp(values);
    if (!result.ok) setServerError(result.message);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <Field id="name" label="Full name" error={errors.name?.message}>
        <Input
          id="name"
          autoComplete="name"
          placeholder="Your name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          className="h-11"
          {...register("name")}
        />
      </Field>

      <Field id="email" label="Email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className="h-11"
          {...register("email")}
        />
      </Field>

      <div>
        <Field id="password" label="Password" error={errors.password?.message}>
          <PasswordField
            id="password"
            autoComplete="new-password"
            invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
            {...register("password")}
          />
        </Field>
        <ul aria-label="Password requirements" className="mt-2 space-y-1">
          {checks.map((c) => (
            <li
              key={c.label}
              className={cn("flex items-center gap-2 text-xs", c.ok ? "text-primary" : "text-muted-foreground")}
            >
              {c.ok ? <Check className="size-3.5" aria-hidden /> : <Circle className="size-3.5" aria-hidden />}
              {c.label}
              <span className="sr-only">{c.ok ? "(done)" : "(not yet)"}</span>
            </li>
          ))}
        </ul>
      </div>

      <Field id="confirmPassword" label="Confirm password" error={errors.confirmPassword?.message}>
        <PasswordField
          id="confirmPassword"
          autoComplete="new-password"
          invalid={!!errors.confirmPassword}
          aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
          {...register("confirmPassword")}
        />
      </Field>

      {serverError && (
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {serverError}
        </p>
      )}

      <Button type="submit" className="h-11 w-full text-base" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />}
        {isSubmitting ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}