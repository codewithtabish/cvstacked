"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

import { seniorSoftwareEngineerResume } from "@/data/resume";
import Prism from "../templates/prisma";

export default function PrismPdfDownload() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    const element = document.getElementById("prism-resume-pdf");

    if (!element) {
      console.error("Prism resume element was not found.");
      return;
    }

    try {
      setIsDownloading(true);

      // Make sure browser has finished rendering the resume.
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            resolve();
          });
        });
      });

      // Wait for resume images.
      const images = element.querySelectorAll<HTMLImageElement>("img");

      await Promise.all(
        Array.from(images).map((img) => {
          if (img.complete) {
            return Promise.resolve();
          }

          return new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          });
        }),
      );

      /*
       * html2canvas-pro supports:
       * lab()
       * lch()
       * oklab()
       * oklch()
       *
       * So your Shadcn primary color can remain
       * exactly as it is.
       */
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        logging: false,

        imageTimeout: 15000,

        width: element.scrollWidth,
        height: element.scrollHeight,

        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      /*
       * Create actual PDF.
       */
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const pageWidth = 210;
      const pageHeight = 297;

      const imageWidth = pageWidth;

      const imageHeight = (canvas.height * imageWidth) / canvas.width;

      const imageData = canvas.toDataURL("image/png", 1.0);

      let heightLeft = imageHeight;
      let position = 0;

      /*
       * FIRST PAGE
       */
      pdf.addImage(
        imageData,
        "PNG",
        0,
        position,
        imageWidth,
        imageHeight,
        undefined,
        "FAST",
      );

      heightLeft -= pageHeight;

      /*
       * ADDITIONAL PAGES
       */
      while (heightLeft > 0) {
        position = heightLeft - imageHeight;

        pdf.addPage();

        pdf.addImage(
          imageData,
          "PNG",
          0,
          position,
          imageWidth,
          imageHeight,
          undefined,
          "FAST",
        );

        heightLeft -= pageHeight;
      }

      /*
       * Filename.
       */
      const firstName =
        seniorSoftwareEngineerResume.personal.firstName || "Resume";

      const lastName = seniorSoftwareEngineerResume.personal.lastName || "";

      const filename = `${firstName}_${lastName}_Resume`
        .replace(/\s+/g, "_")
        .replace(/[^a-zA-Z0-9_-]/g, "");

      /*
       * THIS IS THE ACTUAL PDF DOWNLOAD.
       *
       * It creates:
       *
       * Alexander_Morgan_Resume.pdf
       */
      pdf.save(`${filename || "Resume"}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF:", error);

      alert("PDF generation failed. Check the browser console for details.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* DOWNLOAD BUTTON */}

      <button
        type="button"
        onClick={handleDownload}
        disabled={isDownloading}
        className="
          inline-flex
          items-center
          justify-center
          gap-2
          rounded-lg
          bg-primary
          px-4
          py-2.5
          text-sm
          font-semibold
          text-primary-foreground
          transition-opacity
          hover:opacity-90
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {isDownloading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Generating PDF...
          </>
        ) : (
          <>
            <Download className="size-4" />
            Download PDF
          </>
        )}
      </button>

      {/* 
        PRISM TEMPLATE

        This is the ONLY template used by this downloader.
      */}

      <div id="prism-resume-pdf" className="w-full">
        <Prism resume={seniorSoftwareEngineerResume} />
      </div>
    </div>
  );
}
