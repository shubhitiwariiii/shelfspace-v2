import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const metadata = { title: "Set a new password | ShelfSpace" };

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return (
      <AuthShell
        title="Link expired"
        subtitle="This password reset link is invalid or has already been used."
        footer={
          <Link href="/login" className="font-medium text-primary hover:underline">
            Back to log in
          </Link>
        }
      >
        <Link href="/forgot-password" className={cn(buttonVariants(), "h-11 w-full text-base")}>
          Request a new link
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Set a new password"
      subtitle="Choose a strong password you haven't used before."
      footer={
        <Link href="/dashboard" className="font-medium text-primary hover:underline">
          Cancel
        </Link>
      }
    >
      <ResetPasswordForm />
    </AuthShell>
  );
}