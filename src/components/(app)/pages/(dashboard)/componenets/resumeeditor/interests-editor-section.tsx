"use client";

import { Plus, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";

interface InterestsEditorSectionProps {
  interests: string[];
  onChange: (interests: string[]) => void;
}

export function InterestsEditorSection({ interests, onChange }: InterestsEditorSectionProps) {
  const [newInterest, setNewInterest] = useState("");

  const safeInterests = Array.isArray(interests) ? interests : [];

  const updateInterest = (index: number, value: string) => {
    const updated = [...safeInterests];
    updated[index] = value;
    onChange(updated);
  };

  const removeInterest = (index: number) => {
    onChange(safeInterests.filter((_, itemIndex) => itemIndex !== index));
  };

  const addInterest = () => {
    const value = newInterest.trim();

    if (!value) return;

    const alreadyExists = safeInterests.some(
      (interest) => interest.trim().toLowerCase() === value.toLowerCase(),
    );

    if (alreadyExists) {
      setNewInterest("");
      return;
    }

    onChange([...safeInterests, value]);
    setNewInterest("");
  };

  const handleNewInterestKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addInterest();
    }
  };

  return (
    <section className="space-y-5">
      {/* Section Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="h-4 w-4" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground">Interests</h3>

              <p className="text-xs text-muted-foreground">
                Add hobbies and interests that help show your personality.
              </p>
            </div>
          </div>
        </div>

        {safeInterests.length > 0 && (
          <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
            {safeInterests.length} {safeInterests.length === 1 ? "interest" : "interests"}
          </span>
        )}
      </div>

      {/* Existing Interests */}
      {safeInterests.length > 0 && (
        <div className="space-y-3">
          {safeInterests.map((interest, index) => (
            <div key={`interest-${index}`} className="group flex items-center gap-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border bg-muted/30 text-xs font-medium text-muted-foreground">
                {index + 1}
              </div>

              <input
                type="text"
                value={interest}
                onChange={(event) => updateInterest(index, event.target.value)}
                placeholder="e.g. Photography"
                className="h-10 min-w-0 flex-1 rounded-md border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
              />

              <button
                type="button"
                onClick={() => removeInterest(index)}
                aria-label={`Remove ${interest || "interest"}`}
                title="Remove interest"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-transparent text-muted-foreground transition-colors hover:border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Interest */}
      <div className="rounded-lg border bg-muted/20 p-3">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={newInterest}
            onChange={(event) => setNewInterest(event.target.value)}
            onKeyDown={handleNewInterestKeyDown}
            placeholder="e.g. Photography, Hiking, Open Source"
            className="h-10 min-w-0 flex-1 rounded-md border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
          />

          <button
            type="button"
            onClick={addInterest}
            disabled={!newInterest.trim()}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Add Interest
          </button>
        </div>

        <p className="mt-2 text-[11px] text-muted-foreground">Press Enter or click Add Interest.</p>
      </div>

      {/* Empty State */}
      {safeInterests.length === 0 && (
        <div className="rounded-lg border border-dashed bg-muted/10 px-4 py-6 text-center">
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Sparkles className="h-4 w-4" />
          </div>

          <p className="mt-3 text-sm font-medium text-foreground">No interests added yet</p>

          <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
            Interests are optional. Add hobbies, activities, or personal interests that are relevant
            to your professional profile.
          </p>
        </div>
      )}
    </section>
  );
}

export default InterestsEditorSection;
