"use client";

import type { DailyPatientUpdate } from "@/contracts/patient";
import { EmptyState } from "@/components/feedback/empty-state";
import { formatDateTime, formatRelative } from "@/lib/utils/date";
import { User, Users, Lock, MessageSquareText } from "lucide-react";

export function DailyUpdatesTimeline({ updates }: { updates: DailyPatientUpdate[] }) {
  if (updates.length === 0) {
    return (
      <EmptyState
        icon={MessageSquareText}
        title="No daily updates recorded yet"
        description="Clinical and family-visible updates will appear here when they are added."
      />
    );
  }

  // Sort newest first
  const sortedUpdates = [...updates].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {sortedUpdates.map((update, idx) => (
          <li key={update.id}>
            <div className="relative pb-8">
              {idx !== sortedUpdates.length - 1 ? (
                <span
                  className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-slate-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 ring-8 ring-white">
                    <User className="h-4 w-4 text-slate-500" aria-hidden="true" />
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-slate-900">
                      <span className="font-medium text-slate-900">
                        {update.authorRole.replace(/_/g, " ")}
                      </span>{" "}
                      added an update
                      <span className="ml-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                        {update.visibility === "FAMILY" ? (
                          <span className="inline-flex items-center text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full font-medium ring-1 ring-inset ring-sky-500/20">
                            <Users className="mr-1 h-3 w-3" /> Family Visible
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium ring-1 ring-inset ring-amber-500/20">
                            <Lock className="mr-1 h-3 w-3" /> Staff Only
                          </span>
                        )}
                      </span>
                    </p>
                    <div className="mt-2 text-sm text-slate-700 bg-slate-50 p-3 rounded-md border border-slate-100 whitespace-pre-wrap">
                      {update.content}
                    </div>
                  </div>
                  <div className="whitespace-nowrap text-right text-xs text-slate-500">
                    <time dateTime={update.createdAt} title={formatDateTime(update.createdAt)}>
                      {formatRelative(update.createdAt)}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
