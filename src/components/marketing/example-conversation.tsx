"use client";

import { motion } from "framer-motion";
import { conversationExample } from "@/lib/data/dashboard";

export function ExampleConversation() {
  return (
    <section className="border-t border-border py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-brand">In practice</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Ask once. Get a week of growth work.
          </h2>
          <p className="mt-4 text-muted-foreground">
            With GrowthMCP connected, your agent answers with concrete pages,
            content, and experiments—not generic advice.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-14 max-w-3xl overflow-hidden rounded-2xl border border-border bg-card/60 shadow-xl shadow-black/20"
        >
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <span className="size-2 rounded-full bg-success/80" />
            <span className="text-xs text-muted-foreground">
              Cursor · GrowthMCP tools available
            </span>
          </div>

          <div className="space-y-6 p-5 sm:p-6">
            <div className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-br-md bg-brand/15 px-4 py-3 text-sm text-foreground">
                {conversationExample.user}
              </div>
            </div>

            <div className="max-w-[95%] space-y-4 rounded-2xl rounded-bl-md border border-border bg-background/70 p-4 sm:p-5">
              <p className="text-sm text-muted-foreground">
                Based on Search Console, Trends, and social signals this week:
              </p>
              {conversationExample.assistant.map((block) => (
                <div key={block.title}>
                  <p className="text-sm font-semibold text-foreground">
                    {block.title}
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {block.items.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2 text-sm leading-relaxed text-muted-foreground"
                      >
                        <span className="mt-2 size-1 shrink-0 rounded-full bg-brand" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
