"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ShareButton({ title, text }: { title: string; text: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {
        // user closed the share sheet: nothing to do
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked
    }
  }

  return (
    <>
      <Button type="button" variant="outline" onClick={share}>
        {copied ? <Check className="mr-2 size-4" aria-hidden /> : <Share2 className="mr-2 size-4" aria-hidden />}
        {copied ? "Link copied" : "Share"}
      </Button>
      <span role="status" className="sr-only">
        {copied ? "Link copied to clipboard" : ""}
      </span>
    </>
  );
}