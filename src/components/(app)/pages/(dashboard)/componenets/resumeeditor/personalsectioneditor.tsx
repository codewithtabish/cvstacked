"use client";

import { Camera, CheckCircle2, Trash2, Upload, X } from "lucide-react";
import Image from "next/image";
import type { ChangeEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { ResumeData, ResumePersonalInfo } from "@/types/resume";

export interface PersonalValidationErrors {
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  email?: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

interface PersonalSectionEditorProps {
  resume: ResumeData;
  onChange: (next: ResumeData) => void;
  errors?: PersonalValidationErrors;
  onValidate?: (errors: PersonalValidationErrors) => void;
}

/* ==========================================================
   VALIDATION
========================================================== */

const EMAIL_REGEX =
  /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$/i;

const PHONE_REGEX = /^\+?[1-9]\d{7,14}$/;

const URL_REGEX = /^(https?:\/\/)?((www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(\/[^\s]*)?$/;

function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value.trim());
}

function isValidPhone(value: string): boolean {
  return PHONE_REGEX.test(value.trim());
}

function isValidUrl(value: string): boolean {
  return URL_REGEX.test(value.trim());
}

export function validatePersonalInfo(personal: ResumePersonalInfo): PersonalValidationErrors {
  const errors: PersonalValidationErrors = {};

  const firstName = personal.firstName?.trim() ?? "";
  const lastName = personal.lastName?.trim() ?? "";
  const jobTitle = personal.jobTitle?.trim() ?? "";
  const email = personal.email?.trim() ?? "";
  const phone = personal.phone?.trim() ?? "";
  const website = personal.website?.trim() ?? "";
  const linkedin = personal.linkedin?.trim() ?? "";
  const github = personal.github?.trim() ?? "";
  const portfolio = personal.portfolio?.trim() ?? "";

  /* Required fields */

  if (!firstName) {
    errors.firstName = "First name is required.";
  }

  if (!lastName) {
    errors.lastName = "Last name is required.";
  }

  if (!jobTitle) {
    errors.jobTitle = "Job title is required.";
  }

  if (!email) {
    errors.email = "Email address is required.";
  } else if (!isValidEmail(email)) {
    errors.email = "Enter a valid email address.";
  }

  /* Optional fields */

  if (phone && !isValidPhone(phone)) {
    errors.phone = "Enter a valid phone number, for example +9231690009190.";
  }

  if (website && !isValidUrl(website)) {
    errors.website = "Enter a valid website URL.";
  }

  if (linkedin && !isValidUrl(linkedin)) {
    errors.linkedin = "Enter a valid LinkedIn URL.";
  }

  if (github && !isValidUrl(github)) {
    errors.github = "Enter a valid GitHub URL.";
  }

  if (portfolio && !isValidUrl(portfolio)) {
    errors.portfolio = "Enter a valid portfolio URL.";
  }

  return errors;
}

export function isPersonalInfoValid(personal: ResumePersonalInfo): boolean {
  return Object.keys(validatePersonalInfo(personal)).length === 0;
}

/* ==========================================================
   OUTSIDE COMPONENT HELPERS
========================================================== */

type PersonalErrorField = keyof PersonalValidationErrors;

interface FieldErrorProps {
  field: PersonalErrorField;
  errors?: PersonalValidationErrors;
}

function FieldError({ field, errors }: FieldErrorProps) {
  const message = errors?.[field];

  if (!message) {
    return null;
  }

  return (
    <p id={`${field}-error`} className="text-xs font-medium text-destructive" role="alert">
      {message}
    </p>
  );
}

interface ClearButtonProps {
  label: string;
  onClick: () => void;
}

function ClearButton({ label, onClick }: ClearButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="absolute right-1 top-1 h-8 w-8 text-muted-foreground hover:text-destructive"
      onClick={onClick}
      aria-label={`Clear ${label}`}
      title={`Clear ${label}`}
    >
      <X className="h-4 w-4" />
    </Button>
  );
}

/* ==========================================================
   COMPONENT
========================================================== */

export function PersonalSectionEditor({
  resume,
  onChange,
  errors = {},
  onValidate,
}: PersonalSectionEditorProps) {
  const personal = resume.personal;

  const updatePersonal = (updates: Partial<ResumePersonalInfo>) => {
    const nextPersonal = {
      ...personal,
      ...updates,
    };

    const nextResume: ResumeData = {
      ...resume,
      personal: nextPersonal,
    };

    onChange(nextResume);

    /*
     * Keep errors synchronized while typing.
     *
     * This does not prevent the user from typing.
     * Required fields become valid as soon as their
     * values are corrected.
     */
    if (onValidate) {
      onValidate(validatePersonalInfo(nextPersonal));
    }
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const url = URL.createObjectURL(file);

    updatePersonal({
      photo: url,
    });
  };

  const removePhoto = () => {
    updatePersonal({
      photo: "",
    });
  };

  return (
    <div className="space-y-6">
      {/* ======================================================
          HEADER
      ======================================================= */}

      <div>
        <h2 className="text-base font-semibold tracking-tight">Personal Information</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Basic details that appear at the top of your resume.
        </p>
      </div>

      <Separator />

      {/* ======================================================
          PHOTO
      ======================================================= */}

      <div className="flex items-start gap-5">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
          {personal.photo ? (
            <Image
              src={personal.photo}
              alt="Profile photo"
              fill
              className="object-cover"
              sizes="80px"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <Camera className="h-7 w-7" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <label>
              <Button variant="outline" size="sm" asChild>
                <span className="cursor-pointer">
                  <Upload className="mr-2 h-3.5 w-3.5" />
                  {personal.photo ? "Replace photo" : "Upload photo"}
                </span>
              </Button>

              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </label>

            {personal.photo && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={removePhoto}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Remove
              </Button>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            Recommended: square image, at least 400×400px.
          </p>
        </div>
      </div>

      {/* ======================================================
          NAME
      ======================================================= */}

      <div className="grid gap-4 sm:grid-cols-2">
        {/* First Name */}

        <div className="space-y-2">
          <Label htmlFor="firstName">
            First name <span className="text-destructive">*</span>
          </Label>

          <Input
            id="firstName"
            value={personal.firstName}
            onChange={(event) =>
              updatePersonal({
                firstName: event.target.value,
              })
            }
            placeholder="Alexander"
            aria-invalid={Boolean(errors.firstName)}
            aria-describedby={errors.firstName ? "firstName-error" : undefined}
            className={
              errors.firstName ? "border-destructive focus-visible:ring-destructive" : undefined
            }
          />

          <FieldError field="firstName" errors={errors} />
        </div>

        {/* Last Name */}

        <div className="space-y-2">
          <Label htmlFor="lastName">
            Last name <span className="text-destructive">*</span>
          </Label>

          <Input
            id="lastName"
            value={personal.lastName}
            onChange={(event) =>
              updatePersonal({
                lastName: event.target.value,
              })
            }
            placeholder="Morgan"
            aria-invalid={Boolean(errors.lastName)}
            aria-describedby={errors.lastName ? "lastName-error" : undefined}
            className={
              errors.lastName ? "border-destructive focus-visible:ring-destructive" : undefined
            }
          />

          <FieldError field="lastName" errors={errors} />
        </div>
      </div>

      {/* ======================================================
          JOB TITLE
      ======================================================= */}

      <div className="space-y-2">
        <Label htmlFor="jobTitle">
          Job title <span className="text-destructive">*</span>
        </Label>

        <Input
          id="jobTitle"
          value={personal.jobTitle}
          onChange={(event) =>
            updatePersonal({
              jobTitle: event.target.value,
            })
          }
          placeholder="Senior Software Engineer"
          aria-invalid={Boolean(errors.jobTitle)}
          aria-describedby={errors.jobTitle ? "jobTitle-error" : undefined}
          className={
            errors.jobTitle ? "border-destructive focus-visible:ring-destructive" : undefined
          }
        />

        <FieldError field="jobTitle" errors={errors} />
      </div>

      <Separator />

      {/* ======================================================
          CONTACT
      ======================================================= */}

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Email */}

        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-destructive">*</span>
          </Label>

          <Input
            id="email"
            type="email"
            value={personal.email}
            onChange={(event) =>
              updatePersonal({
                email: event.target.value,
              })
            }
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={
              errors.email ? "border-destructive focus-visible:ring-destructive" : undefined
            }
          />

          <FieldError field="email" errors={errors} />
        </div>

        {/* Phone */}

        <div className="space-y-2">
          <Label htmlFor="phone">
            Phone <span className="text-xs font-normal text-muted-foreground">(optional)</span>
          </Label>

          <div className="relative">
            <Input
              id="phone"
              type="tel"
              value={personal.phone}
              onChange={(event) =>
                updatePersonal({
                  phone: event.target.value,
                })
              }
              placeholder="+9231690009190"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              className={
                personal.phone
                  ? `pr-10 ${
                      errors.phone ? "border-destructive focus-visible:ring-destructive" : ""
                    }`
                  : errors.phone
                    ? "border-destructive focus-visible:ring-destructive"
                    : undefined
              }
            />

            {personal.phone && (
              <ClearButton
                label="phone"
                onClick={() =>
                  updatePersonal({
                    phone: "",
                  })
                }
              />
            )}
          </div>

          <FieldError field="phone" errors={errors} />
        </div>
      </div>

      {/* ======================================================
          LOCATION
      ======================================================= */}

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Location */}

        <div className="space-y-2">
          <Label htmlFor="location">
            Location <span className="text-xs font-normal text-muted-foreground">(optional)</span>
          </Label>

          <div className="relative">
            <Input
              id="location"
              value={personal.location}
              onChange={(event) =>
                updatePersonal({
                  location: event.target.value,
                })
              }
              placeholder="San Francisco, CA"
              className={personal.location ? "pr-10" : undefined}
            />

            {personal.location && (
              <ClearButton
                label="location"
                onClick={() =>
                  updatePersonal({
                    location: "",
                  })
                }
              />
            )}
          </div>
        </div>

        {/* Address */}

        <div className="space-y-2">
          <Label htmlFor="address">
            Address <span className="text-xs font-normal text-muted-foreground">(optional)</span>
          </Label>

          <div className="relative">
            <Input
              id="address"
              value={personal.address || ""}
              onChange={(event) =>
                updatePersonal({
                  address: event.target.value,
                })
              }
              placeholder="Street, City, Country"
              className={personal.address ? "pr-10" : undefined}
            />

            {personal.address && (
              <ClearButton
                label="address"
                onClick={() =>
                  updatePersonal({
                    address: "",
                  })
                }
              />
            )}
          </div>
        </div>
      </div>

      <Separator />

      {/* ======================================================
          LINKS
      ======================================================= */}

      <div className="space-y-4">
        {/* Website */}

        <div className="space-y-2">
          <Label htmlFor="website">
            Website <span className="text-xs font-normal text-muted-foreground">(optional)</span>
          </Label>

          <div className="relative">
            <Input
              id="website"
              value={personal.website || ""}
              onChange={(event) =>
                updatePersonal({
                  website: event.target.value,
                })
              }
              placeholder="https://yourwebsite.com"
              aria-invalid={Boolean(errors.website)}
              aria-describedby={errors.website ? "website-error" : undefined}
              className={
                personal.website
                  ? `pr-10 ${
                      errors.website ? "border-destructive focus-visible:ring-destructive" : ""
                    }`
                  : errors.website
                    ? "border-destructive focus-visible:ring-destructive"
                    : undefined
              }
            />

            {personal.website && (
              <ClearButton
                label="website"
                onClick={() =>
                  updatePersonal({
                    website: "",
                  })
                }
              />
            )}
          </div>

          <FieldError field="website" errors={errors} />
        </div>

        {/* LinkedIn */}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="linkedin">
              LinkedIn <span className="text-xs font-normal text-muted-foreground">(optional)</span>
            </Label>

            <div className="relative">
              <Input
                id="linkedin"
                value={personal.linkedin || ""}
                onChange={(event) =>
                  updatePersonal({
                    linkedin: event.target.value,
                  })
                }
                placeholder="linkedin.com/in/username"
                aria-invalid={Boolean(errors.linkedin)}
                aria-describedby={errors.linkedin ? "linkedin-error" : undefined}
                className={
                  personal.linkedin
                    ? `pr-10 ${
                        errors.linkedin ? "border-destructive focus-visible:ring-destructive" : ""
                      }`
                    : errors.linkedin
                      ? "border-destructive focus-visible:ring-destructive"
                      : undefined
                }
              />

              {personal.linkedin && (
                <ClearButton
                  label="LinkedIn"
                  onClick={() =>
                    updatePersonal({
                      linkedin: "",
                    })
                  }
                />
              )}
            </div>

            <FieldError field="linkedin" errors={errors} />
          </div>

          {/* GitHub */}

          <div className="space-y-2">
            <Label htmlFor="github">
              GitHub <span className="text-xs font-normal text-muted-foreground">(optional)</span>
            </Label>

            <div className="relative">
              <Input
                id="github"
                value={personal.github || ""}
                onChange={(event) =>
                  updatePersonal({
                    github: event.target.value,
                  })
                }
                placeholder="github.com/username"
                aria-invalid={Boolean(errors.github)}
                aria-describedby={errors.github ? "github-error" : undefined}
                className={
                  personal.github
                    ? `pr-10 ${
                        errors.github ? "border-destructive focus-visible:ring-destructive" : ""
                      }`
                    : errors.github
                      ? "border-destructive focus-visible:ring-destructive"
                      : undefined
                }
              />

              {personal.github && (
                <ClearButton
                  label="GitHub"
                  onClick={() =>
                    updatePersonal({
                      github: "",
                    })
                  }
                />
              )}
            </div>

            <FieldError field="github" errors={errors} />
          </div>
        </div>

        {/* Portfolio */}

        <div className="space-y-2">
          <Label htmlFor="portfolio">
            Portfolio <span className="text-xs font-normal text-muted-foreground">(optional)</span>
          </Label>

          <div className="relative">
            <Input
              id="portfolio"
              value={personal.portfolio || ""}
              onChange={(event) =>
                updatePersonal({
                  portfolio: event.target.value,
                })
              }
              placeholder="https://yourportfolio.com"
              aria-invalid={Boolean(errors.portfolio)}
              aria-describedby={errors.portfolio ? "portfolio-error" : undefined}
              className={
                personal.portfolio
                  ? `pr-10 ${
                      errors.portfolio ? "border-destructive focus-visible:ring-destructive" : ""
                    }`
                  : errors.portfolio
                    ? "border-destructive focus-visible:ring-destructive"
                    : undefined
              }
            />

            {personal.portfolio && (
              <ClearButton
                label="portfolio"
                onClick={() =>
                  updatePersonal({
                    portfolio: "",
                  })
                }
              />
            )}
          </div>

          <FieldError field="portfolio" errors={errors} />
        </div>
      </div>

      {/* ======================================================
          VALIDATION STATUS
      ======================================================= */}

      {Object.keys(errors).length === 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-xs text-muted-foreground">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          <span>Your personal information is ready to continue.</span>
        </div>
      )}
    </div>
  );
}
