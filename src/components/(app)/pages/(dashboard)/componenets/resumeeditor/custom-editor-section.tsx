"use client";

import { Plus, Trash2, Wrench } from "lucide-react";

import type { ResumeData } from "@/types/resume";

interface CustomEditorSectionProps {
  customSections: ResumeData["customSections"];
  onChange: (customSections: ResumeData["customSections"]) => void;
}

export function CustomEditorSection({ customSections, onChange }: CustomEditorSectionProps) {
  const safeSections = Array.isArray(customSections) ? customSections : [];

  const addSection = () => {
    onChange([
      ...safeSections,
      {
        id: crypto.randomUUID(),
        title: "",
        items: [],
      },
    ]);
  };

  const updateSectionTitle = (index: number, title: string) => {
    const updated = safeSections.map((section, sectionIndex) =>
      sectionIndex === index
        ? {
            ...section,
            title,
          }
        : section,
    );

    onChange(updated);
  };

  const addItem = (sectionIndex: number) => {
    const updated = safeSections.map((section, index) => {
      if (index !== sectionIndex) {
        return section;
      }

      return {
        ...section,
        items: [
          ...(Array.isArray(section.items) ? section.items : []),
          {
            id: crypto.randomUUID(),
            title: "",
            description: "",
          },
        ],
      };
    });

    onChange(updated);
  };

  const updateItem = (
    sectionIndex: number,
    itemIndex: number,
    field: "title" | "description",
    value: string,
  ) => {
    const updated = safeSections.map((section, index) => {
      if (index !== sectionIndex) {
        return section;
      }

      const items = Array.isArray(section.items) ? section.items : [];

      return {
        ...section,
        items: items.map((item, currentItemIndex) =>
          currentItemIndex === itemIndex
            ? {
                ...item,
                [field]: value,
              }
            : item,
        ),
      };
    });

    onChange(updated);
  };

  const removeItem = (sectionIndex: number, itemIndex: number) => {
    const updated = safeSections.map((section, index) => {
      if (index !== sectionIndex) {
        return section;
      }

      const items = Array.isArray(section.items) ? section.items : [];

      return {
        ...section,
        items: items.filter((_, currentItemIndex) => currentItemIndex !== itemIndex),
      };
    });

    onChange(updated);
  };

  const removeSection = (sectionIndex: number) => {
    onChange(safeSections.filter((_, currentSectionIndex) => currentSectionIndex !== sectionIndex));
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Wrench className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-foreground">Custom Sections</h3>

              <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                Add additional resume information that does not fit into the standard sections.
              </p>
            </div>
          </div>
        </div>

        {safeSections.length > 0 && (
          <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
            {safeSections.length} {safeSections.length === 1 ? "section" : "sections"}
          </span>
        )}
      </div>

      {/* Existing Custom Sections */}
      {safeSections.length > 0 && (
        <div className="space-y-5">
          {safeSections.map((section, sectionIndex) => {
            const items = Array.isArray(section.items) ? section.items : [];

            return (
              <div
                key={section.id || `custom-section-${sectionIndex}`}
                className="rounded-xl border bg-muted/10 p-4 sm:p-5"
              >
                {/* Section Header */}
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border bg-background text-xs font-medium text-muted-foreground">
                      {sectionIndex + 1}
                    </div>

                    <span className="truncate text-xs font-medium text-muted-foreground">
                      Custom Section
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeSection(sectionIndex)}
                    aria-label={`Remove custom section ${sectionIndex + 1}`}
                    title="Remove custom section"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-transparent text-muted-foreground transition-colors hover:border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Section Title */}
                <div className="space-y-2">
                  <label
                    htmlFor={`custom-section-title-${sectionIndex}`}
                    className="text-xs font-medium text-foreground"
                  >
                    Section Title
                  </label>

                  <input
                    id={`custom-section-title-${sectionIndex}`}
                    type="text"
                    value={section.title ?? ""}
                    onChange={(event) => updateSectionTitle(sectionIndex, event.target.value)}
                    placeholder="e.g. Leadership, Activities, Community Work"
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                {/* Items */}
                <div className="mt-5 space-y-3">
                  {items.length > 0 && (
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-foreground">Items</p>

                      <span className="text-[11px] text-muted-foreground">
                        {items.length} {items.length === 1 ? "item" : "items"}
                      </span>
                    </div>
                  )}

                  {items.map((item, itemIndex) => (
                    <div
                      key={item.id || `custom-${sectionIndex}-item-${itemIndex}`}
                      className="rounded-lg border bg-background p-4"
                    >
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted text-[10px] font-medium text-muted-foreground">
                            {itemIndex + 1}
                          </div>

                          <span className="text-[11px] font-medium text-muted-foreground">
                            Item {itemIndex + 1}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(sectionIndex, itemIndex)}
                          aria-label={`Remove item ${itemIndex + 1}`}
                          title="Remove item"
                          className="flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-muted-foreground transition-colors hover:border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="space-y-4">
                        {/* Item Title */}
                        <div className="space-y-2">
                          <label
                            htmlFor={`custom-item-title-${sectionIndex}-${itemIndex}`}
                            className="text-xs font-medium text-foreground"
                          >
                            Title
                          </label>

                          <input
                            id={`custom-item-title-${sectionIndex}-${itemIndex}`}
                            type="text"
                            value={item.title ?? ""}
                            onChange={(event) =>
                              updateItem(sectionIndex, itemIndex, "title", event.target.value)
                            }
                            placeholder="e.g. Student Mentor"
                            className="h-10 w-full rounded-md border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
                          />
                        </div>

                        {/* Item Description */}
                        <div className="space-y-2">
                          <label
                            htmlFor={`custom-item-description-${sectionIndex}-${itemIndex}`}
                            className="text-xs font-medium text-foreground"
                          >
                            Description
                          </label>

                          <textarea
                            id={`custom-item-description-${sectionIndex}-${itemIndex}`}
                            value={item.description ?? ""}
                            onChange={(event) =>
                              updateItem(sectionIndex, itemIndex, "description", event.target.value)
                            }
                            placeholder="Describe this experience, activity, achievement, or information..."
                            rows={4}
                            className="min-h-[100px] w-full resize-y rounded-md border bg-background px-3 py-2.5 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add Item */}
                  <button
                    type="button"
                    onClick={() => addItem(sectionIndex)}
                    className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border border-dashed bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted/40"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Item
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Custom Section */}
      <button
        type="button"
        onClick={addSection}
        className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-dashed bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted/40"
      >
        <Plus className="h-4 w-4" />
        Add Custom Section
      </button>

      {/* Empty State */}
      {safeSections.length === 0 && (
        <div className="rounded-xl border border-dashed bg-muted/10 px-5 py-8 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Wrench className="h-4 w-4" />
          </div>

          <p className="mt-3 text-sm font-medium text-foreground">No custom sections added yet</p>

          <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-muted-foreground">
            Create your own resume section for information such as leadership, activities, community
            work, memberships, or anything else that does not belong in the standard sections.
          </p>

          <button
            type="button"
            onClick={addSection}
            className="mt-4 inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-3.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Custom Section
          </button>
        </div>
      )}
    </section>
  );
}

export default CustomEditorSection;
