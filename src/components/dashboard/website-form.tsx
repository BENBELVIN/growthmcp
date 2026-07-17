"use client";

import { useActionState } from "react";
import {
  createWebsite,
  updateWebsite,
  type WebsiteActionState,
} from "@/lib/websites/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: WebsiteActionState = {};

export function WebsiteForm({
  mode,
  websiteId,
  defaultName = "",
  defaultUrl = "",
}: {
  mode: "create" | "edit";
  websiteId?: string;
  defaultName?: string;
  defaultUrl?: string;
}) {
  const action =
    mode === "create"
      ? createWebsite
      : updateWebsite.bind(null, websiteId!);

  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Website Name</Label>
        <Input
          id="name"
          name="name"
          required
          defaultValue={defaultName}
          placeholder="GLPPal"
          autoComplete="organization"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">Website URL</Label>
        <Input
          id="url"
          name="url"
          type="text"
          required
          defaultValue={defaultUrl}
          placeholder="https://glppal.app"
          autoComplete="url"
          inputMode="url"
        />
      </div>

      {state.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}

      <Button
        type="submit"
        disabled={pending}
        className="h-11 w-full rounded-full bg-primary text-primary-foreground"
      >
        {pending
          ? mode === "create"
            ? "Adding…"
            : "Saving…"
          : mode === "create"
            ? "Add Website"
            : "Save changes"}
      </Button>
    </form>
  );
}
