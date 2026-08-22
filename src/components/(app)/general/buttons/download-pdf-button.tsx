"use client";

import { Download, Loader2 } from "lucide-react";
import { useState, type RefObject } from "react";

const A4_WIDTH_MM = 210;

interface DownloadPdfButtonProps {
  targetRef?: RefObject<HTMLElement | null>;
  elementId?: string;
  fileName?: string;
  className?: string;
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

    const node =
      targetRef?.current ??
      (elementId ? document.getElementById(elementId) : null);

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

      // Capture at high quality without changing layout
      const canvas = await html2canvas(node, {
        scale: 2, // 2 is more stable than 3 and still very sharp
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: node.scrollWidth,
        height: node.scrollHeight,
        windowWidth: document.documentElement.clientWidth,
        windowHeight: document.documentElement.clientHeight,
        scrollX: -window.scrollX,
        scrollY: -window.scrollY,
      });

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

      const imageData = canvas.toDataURL("image/png", 1.0);

      // Place the entire capture on the single page, exact size, no cropping
      pdf.addImage(
        imageData,
        "PNG",
        0,
        0,
        pageWidthMm,
        pageHeightMm,
        undefined,
        "FAST",
      );

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
