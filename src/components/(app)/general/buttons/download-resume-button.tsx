"use client";

import { Download, Loader2, Printer } from "lucide-react";
import { useState, type RefObject } from "react";

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

interface DownloadResumeButtonProps {
  /** Pass the ref of the TemplateOne root, or use elementId */
  targetRef?: RefObject<HTMLElement | null>;
  /** Default is "resume-page" (matches your TemplateOne) */
  elementId?: string;
  fileName?: string;
  className?: string;
  /** Show both buttons or only one */
  mode?: "both" | "print" | "download";
}

/* ============================================================
   HELPERS
   ============================================================ */

function waitForImages(root: HTMLElement): Promise<void> {
  const images = Array.from(root.querySelectorAll("img"));
  if (images.length === 0) return Promise.resolve();

  return Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }
          const done = () => {
            img.removeEventListener("load", done);
            img.removeEventListener("error", done);
            resolve();
          };
          img.addEventListener("load", done);
          img.addEventListener("error", done);
          setTimeout(done, 8000);
        }),
    ),
  ).then(() => undefined);
}

function waitForFonts(): Promise<void> {
  if (typeof document === "undefined" || !document.fonts) {
    return Promise.resolve();
  }
  return document.fonts.ready.then(() => undefined).catch(() => undefined);
}

function nextFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

function sanitizeFileName(value: string): string {
  return (
    value
      .trim()
      .replace(/\.pdf$/i, "")
      .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
      .replace(/\s+/g, "-") || "resume"
  );
}

/* ============================================================
   COMPONENT
   ============================================================ */

export function DownloadResumeButton({
  targetRef,
  elementId = "resume-page",
  fileName = "resume",
  className = "",
  mode = "both",
}: DownloadResumeButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  /* ----------------------------------------------------------
     HIGH-QUALITY: Browser Print → Save as PDF
     ---------------------------------------------------------- */
  function handlePrint() {
    window.print();
  }

  /* ----------------------------------------------------------
     ONE-CLICK: html2canvas + jsPDF
     ------------------------------------------------------------
     Captures EACH real ".resume-page" div (rendered by
     PaginatedResume, one per A4 page) as its own screenshot and
     adds it as its own PDF page. No pixel-height slicing, so
     nothing can ever be cut mid-item — the page boundaries are
     the real DOM boundaries, not a guess.

     Falls back to whole-element capture (old behavior) only if
     no ".resume-page" children are found, so this still works
     even before you've wired up PaginatedResume.
     ---------------------------------------------------------- */
  async function handleDownload() {
    if (isGenerating) return;

    const root: HTMLElement | null = targetRef?.current ?? document.getElementById(elementId);

    if (!root) {
      alert("Resume element not found. Make sure TemplateOne is rendered.");
      return;
    }

    setIsGenerating(true);

    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas-pro"),
        import("jspdf"),
      ]);

      await waitForFonts();
      await waitForImages(root);
      await nextFrame();

      const pageNodes = Array.from(root.querySelectorAll<HTMLElement>(".resume-page"));

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      if (pageNodes.length > 0) {
        // ---- NEW PATH: one screenshot per real page div ----
        for (let i = 0; i < pageNodes.length; i++) {
          const pageNode = pageNodes[i];

          const canvas = await html2canvas(pageNode, {
            scale: 2.5,
            useCORS: true,
            allowTaint: false,
            backgroundColor: "#ffffff",
            logging: false,
            imageTimeout: 15000,
            removeContainer: true,
            onclone: (doc, el) => {
              el.style.margin = "0";
              el.style.transform = "none";
              el.style.boxShadow = "none";
              el.style.setProperty("print-color-adjust", "exact");
              el.style.setProperty("-webkit-print-color-adjust", "exact");
              doc.querySelectorAll("[data-pdf-hide]").forEach((item) => {
                (item as HTMLElement).style.display = "none";
              });
            },
          });

          if (!canvas.width || !canvas.height) {
            throw new Error(`Could not capture resume page ${i + 1}`);
          }

          const imgData = canvas.toDataURL("image/png", 1.0);

          if (i > 0) pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM, undefined, "FAST");
        }
      } else {
        // ---- FALLBACK: old whole-element capture + fixed-height slicing ----
        const rect = root.getBoundingClientRect();
        const sourceWidth = Math.max(root.scrollWidth, Math.ceil(rect.width));
        const sourceHeight = Math.max(root.scrollHeight, Math.ceil(rect.height));

        if (sourceWidth <= 0 || sourceHeight <= 0) {
          throw new Error("Invalid resume dimensions");
        }

        const canvas = await html2canvas(root, {
          scale: 2.5,
          useCORS: true,
          allowTaint: false,
          backgroundColor: "#ffffff",
          logging: false,
          width: sourceWidth,
          height: sourceHeight,
          x: 0,
          y: 0,
          scrollX: 0,
          scrollY: 0,
          windowWidth: Math.max(document.documentElement.clientWidth, sourceWidth),
          windowHeight: Math.max(document.documentElement.clientHeight, sourceHeight),
          imageTimeout: 15000,
          removeContainer: true,
          onclone: (doc) => {
            const cloned = doc.getElementById(elementId);
            if (!cloned) return;
            const el = cloned as HTMLElement;
            el.style.width = "210mm";
            el.style.minWidth = "210mm";
            el.style.maxWidth = "210mm";
            el.style.margin = "0";
            el.style.transform = "none";
            el.style.boxShadow = "none";
            doc.querySelectorAll("[data-pdf-hide]").forEach((item) => {
              (item as HTMLElement).style.display = "none";
            });
            el.style.setProperty("print-color-adjust", "exact");
            el.style.setProperty("-webkit-print-color-adjust", "exact");
          },
        });

        if (!canvas.width || !canvas.height) {
          throw new Error("Could not capture resume");
        }

        const pixelsPerMm = canvas.width / A4_WIDTH_MM;
        const pageHeightPx = Math.round(A4_HEIGHT_MM * pixelsPerMm);
        const pageCount = Math.max(1, Math.ceil(canvas.height / pageHeightPx));

        for (let i = 0; i < pageCount; i++) {
          const sourceY = i * pageHeightPx;
          const sliceHeight = Math.min(pageHeightPx, canvas.height - sourceY);

          const pageCanvas = document.createElement("canvas");
          pageCanvas.width = canvas.width;
          pageCanvas.height = sliceHeight;

          const ctx = pageCanvas.getContext("2d");
          if (!ctx) throw new Error("Canvas context failed");

          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
          ctx.drawImage(
            canvas,
            0,
            sourceY,
            canvas.width,
            sliceHeight,
            0,
            0,
            canvas.width,
            sliceHeight,
          );

          const imgData = pageCanvas.toDataURL("image/png", 1.0);
          const heightMm = sliceHeight / pixelsPerMm;

          if (i > 0) pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, 0, A4_WIDTH_MM, heightMm, undefined, "FAST");
        }
      }

      pdf.save(`${sanitizeFileName(fileName)}.pdf`);
    } catch (err) {
      console.error(err);
      alert("Failed to generate PDF. Please use the Print option for best quality.");
    } finally {
      setIsGenerating(false);
    }
  }

  /* ----------------------------------------------------------
     RENDER
     ---------------------------------------------------------- */

  const showPrint = mode === "both" || mode === "print";
  const showDownload = mode === "both" || mode === "download";

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {/* HIGH QUALITY – RECOMMENDED */}
      {showPrint && (
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          <Printer className="size-4" />
          Print / Save as PDF
        </button>
      )}

      {/* ONE-CLICK DOWNLOAD */}
      {showDownload && (
        <button
          type="button"
          onClick={handleDownload}
          disabled={isGenerating}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isGenerating ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Generating…
            </>
          ) : (
            <>
              <Download className="size-4" />
              Download PDF
            </>
          )}
        </button>
      )}
    </div>
  );
}

export default DownloadResumeButton;
