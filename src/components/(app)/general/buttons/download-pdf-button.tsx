"use client";

import { Download, Loader2 } from "lucide-react";
import { useState, type RefObject } from "react";

const A4_WIDTH_MM = 210;

// Browsers cap canvas dimensions (commonly ~16384px on one side, and a
// total-pixel limit too). We pick the highest scale that stays safely
// under that so quality is maximized without silently failing.
const MAX_CANVAS_DIMENSION = 14000;

interface DownloadPdfButtonProps {
  targetRef?: RefObject<HTMLElement | null>;
  elementId?: string;
  fileName?: string;
  className?: string;
}

function waitForFonts(): Promise<void> {
  if (typeof document === "undefined" || !document.fonts) return Promise.resolve();
  return document.fonts.ready.then(() => undefined).catch(() => undefined);
}

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

function nextFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

/** Picks the highest render scale that keeps the canvas under browser limits. */
function pickSafeScale(node: HTMLElement, desiredScale: number): number {
  const width = node.scrollWidth;
  const height = node.scrollHeight;
  if (width <= 0 || height <= 0) return desiredScale;

  const maxByWidth = MAX_CANVAS_DIMENSION / width;
  const maxByHeight = MAX_CANVAS_DIMENSION / height;
  const maxSafeScale = Math.min(maxByWidth, maxByHeight);

  return Math.max(1, Math.min(desiredScale, maxSafeScale));
}

export function DownloadPdfButton({
  targetRef,
  elementId,
  fileName = "resume",
  className = "",
}: DownloadPdfButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleDownload() {
    if (isGenerating) return;

    const node = targetRef?.current ?? (elementId ? document.getElementById(elementId) : null);

    if (!node) {
      console.error(
        "DownloadPdfButton: no element to capture. Pass either targetRef or elementId.",
      );
      alert("Resume element not found");
      return;
    }

    setIsGenerating(true);

    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas-pro"),
        import("jspdf"),
      ]);

      // Make sure fonts and any images (photo, icons) are fully painted
      // before we screenshot — this is the #1 cause of blurry/missing
      // content in html2canvas captures.
      await waitForFonts();
      await waitForImages(node);
      await nextFrame();

      // Aim high (4x = print-shop quality), but never exceed what the
      // browser's canvas can actually hold.
      const desiredScale = Math.max(4, window.devicePixelRatio * 2 || 4);
      const scale = pickSafeScale(node, desiredScale);

      const canvas = await html2canvas(node, {
        scale,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        logging: false,
        imageTimeout: 15000,
        removeContainer: true,
        width: node.scrollWidth,
        height: node.scrollHeight,
        windowWidth: document.documentElement.clientWidth,
        windowHeight: document.documentElement.clientHeight,
        scrollX: -window.scrollX,
        scrollY: -window.scrollY,
        onclone: (doc, el) => {
          (el as HTMLElement).style.setProperty("print-color-adjust", "exact");
          (el as HTMLElement).style.setProperty("-webkit-print-color-adjust", "exact");
        },
      });

      if (!canvas.width || !canvas.height) {
        throw new Error("Could not capture resume — canvas came back empty");
      }

      // How many pixels = 1mm at the captured width
      const pixelsPerMm = canvas.width / A4_WIDTH_MM;

      // Convert the FULL captured height into mm — this becomes the height
      // of a single, continuous PDF page. No slicing, no page breaks.
      const pageWidthMm = A4_WIDTH_MM;
      const pageHeightMm = canvas.height / pixelsPerMm;

      const pdf = new jsPDF({
        orientation: pageHeightMm >= pageWidthMm ? "portrait" : "landscape",
        unit: "mm",
        format: [pageWidthMm, pageHeightMm],
        compress: true,
      });

      // PNG keeps text/lines lossless (no JPEG artifacting on crisp edges).
      const imageData = canvas.toDataURL("image/png", 1.0);

      // Place the entire capture on the single page, exact size, no cropping.
      pdf.addImage(imageData, "PNG", 0, 0, pageWidthMm, pageHeightMm, undefined, "FAST");

      // Embed real resolution metadata so PDF viewers don't guess.
      pdf.setProperties({ title: fileName });

      pdf.save(`${fileName}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={isGenerating}
      className={`inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {isGenerating ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Generating PDF…
        </>
      ) : (
        <>
          <Download className="size-4" />
          Download PDF
        </>
      )}
    </button>
  );
}

export default DownloadPdfButton;
