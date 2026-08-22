"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";

interface DownloadResumeButtonProps {
  targetId: string;
  fileName?: string;
  className?: string;
}

export function DownloadResumeButton({
  targetId,
  fileName = "Resume",
  className,
}: DownloadResumeButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    const element = document.getElementById(targetId);
    if (!element) {
      alert("Resume not found");
      return;
    }

    try {
      setIsGenerating(true);

      // Create a clean off-screen clone
      const clone = element.cloneNode(true) as HTMLElement;

      // Force exact A4 dimensions
      clone.style.cssText = `
        width: 210mm !important;
        max-width: 210mm !important;
        min-width: 210mm !important;
        margin: 0 !important;
        padding: 0 !important;
        position: absolute !important;
        left: -9999px !important;
        top: 0 !important;
        transform: none !important;
        box-shadow: none !important;
        background: white !important;
      `;

      document.body.appendChild(clone);

      // Give the browser time to apply styles
      await new Promise((r) => setTimeout(r, 150));

      const dataUrl = await toPng(clone, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: "#ffffff",
      });

      document.body.removeChild(clone);

      // Create real A4 PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const pageWidth = 210;
      const pageHeight = 297;

      const imgProps = pdf.getImageProperties(dataUrl);
      const imgWidth = pageWidth;
      const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

      // If content is taller than one page → multi-page
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(dataUrl, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(dataUrl, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${fileName}.pdf`);
    } catch (error) {
      console.error(error);
      alert("Failed to generate PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isGenerating}
      className={className}
      size="lg"
    >
      {isGenerating ? (
        <>
          <Loader2 className="mr-2 size-4 animate-spin" />
          Generating PDF...
        </>
      ) : (
        <>
          <Download className="mr-2 size-4" />
          Download Resume
        </>
      )}
    </Button>
  );
}
