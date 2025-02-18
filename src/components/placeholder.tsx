"use client";

import React from "react";

export function Placeholder() {
  return (
    <div className="animate-pulse grid grid-cols-3 gap-4">
      <div className="aspect-video rounded-xl bg-muted" />
      <div className="aspect-video rounded-xl bg-muted" />
      <div className="aspect-video rounded-xl bg-muted" />
      <div className="w-full min-h-[50vh] rounded-xl bg-muted col-span-full" />
    </div>
  );
}
