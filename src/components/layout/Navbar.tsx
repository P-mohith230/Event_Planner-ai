import React from "react";
import { EventType } from "@/types/schema";
import { Sparkles, CalendarHeart, RotateCcw, PlusCircle, Compass } from "lucide-react";

interface NavbarProps {
  currentType: EventType;
  onSwitchType: (type: EventType) => void;
  onOpenNewEvent: () => void;
  onReset: () => void;
}

export function Navbar({
  currentType,
  onSwitchType,
  onOpenNewEvent,
  onReset,
}: NavbarProps) {
  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-sm" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-violet-600 flex items-center justify-center text-white shadow-sm">
              <Compass className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-stone-900 tracking-tight">EventPilot</span>
                <span className="text-xs bg-violet-100 text-violet-800 font-semibold px-2 py-0.5 rounded-full border border-violet-200">
                  Challenge 5
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium">The Living Plan • Constraint-Aware GenAI Workspace</p>
            </div>
          </div>

          {/* Quick Archetype Switcher */}
          <nav className="hidden md:flex items-center gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200" aria-label="Event Archetypes">
            <button
              onClick={() => onSwitchType("wedding")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                currentType === "wedding"
                  ? "bg-white text-stone-900 shadow-sm font-bold"
                  : "text-stone-600 hover:text-stone-900"
              }`}
              aria-current={currentType === "wedding" ? "true" : undefined}
            >
              Wedding
            </button>
            <button
              onClick={() => onSwitchType("birthday")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                currentType === "birthday"
                  ? "bg-white text-stone-900 shadow-sm font-bold"
                  : "text-stone-600 hover:text-stone-900"
              }`}
              aria-current={currentType === "birthday" ? "true" : undefined}
            >
              Birthday
            </button>
            <button
              onClick={() => onSwitchType("community")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                currentType === "community"
                  ? "bg-white text-stone-900 shadow-sm font-bold"
                  : "text-stone-600 hover:text-stone-900"
              }`}
              aria-current={currentType === "community" ? "true" : undefined}
            >
              Community Gala
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenNewEvent}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 text-white hover:bg-violet-700 text-xs font-semibold rounded-lg shadow-sm transition-colors"
              aria-label="Create new custom event plan"
            >
              <PlusCircle className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">New Event</span>
            </button>

            <button
              onClick={onReset}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 text-xs font-medium rounded-lg border border-stone-200 transition-colors"
              title="Reset plan to original sample template"
              aria-label="Reset plan"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

