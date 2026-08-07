"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUp, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SeoBrainPulse } from "@/components/dashboard/seo-brain-pulse";
import { buildMockSeoBrainResponse } from "@/lib/seo-brain/mock-response";
import {
  buildFollowUpSuggestions,
  buildSeoBrainPulseContent,
} from "@/lib/seo-brain/pulse";
import type { CommandCenterData } from "@/lib/gsc/command-center";
import { cn } from "@/lib/utils";
import { settingsPaths } from "@/lib/data/dashboard";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type SeoBrainPanelProps = {
  projectName: string;
  loading?: boolean;
  connected?: boolean;
  command?: CommandCenterData | null;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  className?: string;
};

function GrowseoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-[22%] shadow-sm ring-1 ring-border",
        className
      )}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logos/growseo-icon.png"
        alt=""
        width={36}
        height={36}
        className="size-full object-cover"
      />
    </span>
  );
}

function SeoBrainSkeleton() {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-3">
        <div className="size-9 shrink-0 animate-pulse rounded-[22%] bg-muted/40" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 animate-pulse rounded bg-muted/40" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-muted/30" />
        </div>
      </div>
      <div className="mt-5 h-11 animate-pulse rounded-full bg-muted/30" />
      <div className="mt-3 flex gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-8 w-28 animate-pulse rounded-full bg-muted/20" />
        ))}
      </div>
    </div>
  );
}

export function SeoBrainPanel({
  projectName,
  loading = false,
  connected = false,
  command = null,
  expanded = false,
  onExpandedChange,
  className,
}: SeoBrainPanelProps) {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [thinking, setThinking] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const pulse = buildSeoBrainPulseContent(projectName, command, connected);
  const suggestions = buildFollowUpSuggestions(command);
  const sources = command?.connectedIntegrations ?? [];
  const isOpen = expanded || messages.length > 0;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, thinking]);

  function submit(text: string) {
    const trimmed = text.trim();
    if (!trimmed || thinking) return;
    if (!connected) return;

    onExpandedChange?.(true);

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };

    setQuery("");
    setMessages((prev) => [...prev, userMessage]);
    setThinking(true);

    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: buildMockSeoBrainResponse(trimmed, command),
        },
      ]);
      setThinking(false);
    }, 700);
  }

  function handleBlur() {
    window.setTimeout(() => {
      if (messages.length > 0) return;
      if (panelRef.current?.contains(document.activeElement)) return;
      onExpandedChange?.(false);
    }, 120);
  }

  if (loading) {
    return <SeoBrainSkeleton />;
  }

  return (
    <motion.section
      ref={panelRef}
      layout
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6",
        isOpen &&
          "flex h-[min(520px,calc(100dvh-13rem))] flex-col shadow-md ring-1 ring-brand/10 sm:h-[min(560px,calc(100dvh-12rem))]",
        className
      )}
    >
      {!isOpen && (
        <div className="flex items-center gap-3">
          <GrowseoMark className="size-9 shrink-0 self-center" />
          <SeoBrainPulse content={pulse} />
        </div>
      )}

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-4 flex items-center gap-3 border-b border-border/60 pb-4"
        >
          <GrowseoMark className="size-8 shrink-0 self-center" />
          <SeoBrainPulse content={pulse} muted />
        </motion.div>
      )}

      {isOpen && messages.length === 0 && !thinking && (
        <div className="min-h-0 flex-1" aria-hidden />
      )}

      {(messages.length > 0 || thinking) && (
        <div
          ref={scrollRef}
          className={cn(
            "min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain pr-1",
            isOpen ? "mb-4" : "mt-5 max-h-48 border-t border-border/60 pt-5"
          )}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start gap-2"
              )}
            >
              {message.role === "assistant" && isOpen && (
                <GrowseoMark className="mt-1 size-7" />
              )}
              <div
                className={cn(
                  "max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[85%]",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-foreground"
                )}
              >
                {message.content}
              </div>
            </div>
          ))}

          {thinking && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin text-brand" />
              Thinking…
            </div>
          )}

          {!thinking && messages.at(-1)?.role === "assistant" && sources.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pl-9">
              {sources.map((name) => (
                <Badge key={name} variant="secondary" className="h-6 font-normal">
                  {name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}

      <form
        className={cn("flex gap-2", isOpen ? "mt-auto shrink-0" : "mt-5")}
        onSubmit={(e) => {
          e.preventDefault();
          submit(query);
        }}
      >
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => onExpandedChange?.(true)}
          onBlur={handleBlur}
          placeholder={
            connected
              ? "Ask anything about your SEO…"
              : "Connect Search Console to ask questions"
          }
          disabled={!connected || thinking}
          className={cn(
            "rounded-full px-4",
            isOpen ? "h-12 text-base" : "h-11"
          )}
        />
        <Button
          type="submit"
          size="icon"
          disabled={!connected || thinking || !query.trim()}
          className={cn(
            "shrink-0 rounded-full shadow-sm",
            isOpen ? "size-12" : "size-11"
          )}
        >
          <ArrowUp className="size-4" />
        </Button>
      </form>

      {!isOpen && (
        <div className="mt-3 flex flex-wrap gap-2">
          {connected ? (
            suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                disabled={thinking}
                onClick={() => submit(suggestion)}
                className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-brand/30 hover:text-foreground disabled:opacity-50"
              >
                {suggestion}
              </button>
            ))
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="h-8 rounded-full border-border text-xs"
              asChild
            >
              <Link href={settingsPaths.root}>Connect Search Console</Link>
            </Button>
          )}
        </div>
      )}

      {isOpen && connected && (
        <div className="mt-3 flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              disabled={thinking}
              onClick={() => submit(suggestion)}
              className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-brand/30 hover:text-foreground disabled:opacity-50"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </motion.section>
  );
}
