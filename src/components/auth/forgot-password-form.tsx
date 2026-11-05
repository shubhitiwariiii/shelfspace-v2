"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/auth/form-fields";
import { requestPasswordReset } from "@/lib/auth";
import { forgotPasswordSchema, type ForgotPasswordValues } from "@/lib/schemas/auth";

export function ForgotPasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onTouched",
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ForgotPasswordValues) {
    setServerError(null);
    const result = await requestPasswordReset(values.email);
    if (!result.ok) {
      setServerError(result.message);
      return;
    }
    setSentTo(values.email);
  }

  if (sentTo) {
    return (
      <div role="status" className="rounded-xl border border-primary/30 bg-primary/10 p-5 text-sm">
        <MailCheck className="size-6 text-primary" aria-hidden />
        <p className="mt-3 font-medium">Check your email</p>
        <p className="mt-1 text-muted-foreground">
          If an account exists for <span className="font-medium text-foreground">{sentTo}</span>, we&apos;ve
          sent a link to reset your password. Open it in this same browser. It expires soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
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
        {isSubmitting ? "Sending..." : "Send reset link"}
      </Button>
    </form>
  );
}