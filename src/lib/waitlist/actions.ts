"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { getFromEmail, getResendClient } from "@/lib/email/resend";
import {
  buildWaitlistConfirmationEmail,
  waitlistConfirmationSubject,
} from "@/lib/email/waitlist-confirmation";

const joinWaitlistSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  source: z.string().trim().max(64).optional(),
  referralCode: z.string().trim().max(32).optional(),
  utmSource: z.string().trim().max(128).optional(),
  utmMedium: z.string().trim().max(128).optional(),
  utmCampaign: z.string().trim().max(128).optional(),
});

export type JoinWaitlistResult =
  | {
      ok: true;
      position: number;
      isNew: boolean;
    }
  | {
      ok: false;
      error: string;
    };

async function resolveReferrerId(referralCode?: string) {
  if (!referralCode) return null;

  const admin = createAdminClient();
  const { data } = await admin
    .from("waitlist_signups")
    .select("id")
    .eq("referral_code", referralCode)
    .maybeSingle();

  return data?.id ?? null;
}

async function sendConfirmationEmail(
  email: string,
  position: number,
  referralCode: string,
  isNew: boolean
) {
  const resend = getResendClient();
  if (!resend) {
    console.warn(
      "[waitlist] RESEND_API_KEY not set — signup saved but no email sent"
    );
    return;
  }

  const { error } = await resend.emails.send({
    from: getFromEmail(),
    to: email,
    subject: waitlistConfirmationSubject(position),
    html: buildWaitlistConfirmationEmail({
      email,
      position,
      referralCode,
      isNew,
    }),
  });

  if (error) {
    console.error("[waitlist] Resend error:", error);
  }
}

export async function joinWaitlist(
  input: z.infer<typeof joinWaitlistSchema>
): Promise<JoinWaitlistResult> {
  const parsed = joinWaitlistSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const email = parsed.data.email.toLowerCase();
  const admin = createAdminClient();

  const { data: existing, error: existingError } = await admin
    .from("waitlist_signups")
    .select("id, email, position, referral_code")
    .eq("email", email)
    .maybeSingle();

  if (existingError) {
    console.error("[waitlist] lookup error:", existingError);
    return { ok: false, error: "Something went wrong. Please try again." };
  }

  if (existing) {
    await sendConfirmationEmail(
      existing.email,
      existing.position,
      existing.referral_code,
      false
    );

    return {
      ok: true,
      position: existing.position,
      isNew: false,
    };
  }

  const referredBy = await resolveReferrerId(parsed.data.referralCode);

  const { data, error } = await admin
    .from("waitlist_signups")
    .insert({
      email,
      source: parsed.data.source ?? "hero",
      referred_by: referredBy,
      utm_source: parsed.data.utmSource ?? null,
      utm_medium: parsed.data.utmMedium ?? null,
      utm_campaign: parsed.data.utmCampaign ?? null,
    })
    .select("id, email, position, referral_code")
    .single();

  if (error) {
    if (error.code === "23505") {
      const { data: retry } = await admin
        .from("waitlist_signups")
        .select("email, position, referral_code")
        .eq("email", email)
        .single();

      if (retry) {
        await sendConfirmationEmail(
          retry.email,
          retry.position,
          retry.referral_code,
          false
        );
        return {
          ok: true,
          position: retry.position,
          isNew: false,
        };
      }
    }

    console.error("[waitlist] insert error:", error);
    return { ok: false, error: "Something went wrong. Please try again." };
  }

  await sendConfirmationEmail(
    data.email,
    data.position,
    data.referral_code,
    true
  );

  return {
    ok: true,
    position: data.position,
    isNew: true,
  };
}
