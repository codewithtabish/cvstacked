// // import DownloadPdfButton from "@/components/(app)/general/buttons/download-pdf-button";
// // import Horizon from "@/components/(app)/general/templates/horizan";
// // import Nova from "@/components/(app)/general/templates/nova";
// // import TemplateFifteen from "@/components/(app)/general/templates/template-fifteen";
// // import { seniorSoftwareEngineerResume } from "@/data/resume";
// // // ... other imports

// // const HomePage = () => {
// //   const resume = seniorSoftwareEngineerResume;

// //   return (
// //     <div className="space-y-12 p-6">
// //       {/* ... other templates ... */}

// //       {/* IMPORTANT: id goes directly on <Horizon />, which places it
// //           on its own 210mm root <article>. Do NOT wrap Horizon in an
// //           extra <div id="resume-page"> — that div has no width limit
// //           and stretches to this page's full layout width, so the PDF
// //           capture would grab that whole wide area (with the 210mm
// //           page just centered inside it) instead of exactly the page,
// //           producing empty space around your content in the PDF. */}
// //       <div className="max-w-4xl mx-auto">
// //         <Nova resume={seniorSoftwareEngineerResume} />

// //         <Horizon resume={resume} id="resume-page" />

// //         <DownloadPdfButton
// //           elementId="resume-page"
// //           fileName={`${resume.personal.firstName}-${resume.personal.lastName}-resumes1`}
// //         />

// //         <hr />

// //         <TemplateFifteen resume={resume} id="templte id" />

// //         <DownloadPdfButton
// //           elementId="templateid"
// //           fileName={`${resume.personal.firstName}--${resume.personal.lastName}-two`}
// //         />
// //       </div>
// //     </div>
// //   );
// // };

// // export default HomePage;

// // // for thee e color chnage is used his one

// // //  <div className="mx-auto mb-6 flex w-full max-w-[1200px] items-center justify-end px-4">
// // //     <ResumeAppearanceDialog
// // //       resume={resume}
// // //       onChange={setResume}
// // //     >
// // //       <button
// // //         type="button"
// // //         className="inline-flex h-10 items-center gap-2 rounded-lg border bg-background px-4 text-sm font-medium shadow-sm transition-colors hover:bg-muted"
// // //       >
// // //         <Palette className="size-4" />
// // //         Change appearance
// // //       </button>
// // //     </ResumeAppearanceDialog>
// // //   </div>

// // //   const [resume, setResume] = useState<ResumeData>(
// // // seniorSoftwareEngineerResume,
// // // );

// "use client";

// import { Download, Loader2 } from "lucide-react";
// import { useState, type RefObject } from "react";

// const A4_WIDTH_MM = 210;

// interface DownloadPdfButtonProps {
//   targetRef?: RefObject<HTMLElement | null>;
//   elementId?: string;
//   fileName?: string;
//   className?: string;
// }

// export function DownloadPdfButton({
//   targetRef,
//   elementId,
//   fileName = "resume",
//   className = "",
// }: DownloadPdfButtonProps) {
//   const [isGenerating, setIsGenerating] = useState(false);

//   async function handleDownload() {
//     if (isGenerating) return;

//     const node = targetRef?.current ?? (elementId ? document.getElementById(elementId) : null);

//     if (!node) {
//       console.error(
//         "DownloadPdfButton: no element to capture. Pass either targetRef or elementId.",
//       );
//       alert("Resume element not found");
//       return;
//     }

//     setIsGenerating(true);

//     try {
//       const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
//         import("html2canvas-pro"),
//         import("jspdf"),
//       ]);

//       // Capture at high quality without changing layout
//       const canvas = await html2canvas(node, {
//         scale: 2, // 2 is more stable than 3 and still very sharp
//         useCORS: true,
//         backgroundColor: "#ffffff",
//         logging: false,
//         width: node.scrollWidth,
//         height: node.scrollHeight,
//         windowWidth: document.documentElement.clientWidth,
//         windowHeight: document.documentElement.clientHeight,
//         scrollX: -window.scrollX,
//         scrollY: -window.scrollY,
//       });

//       // How many pixels = 1mm at the captured width
//       const pixelsPerMm = canvas.width / A4_WIDTH_MM;

//       // Convert the FULL captured height into mm — this becomes the height
//       // of a single, continuous PDF page. No slicing, no page breaks.
//       const pageWidthMm = A4_WIDTH_MM;
//       const pageHeightMm = canvas.height / pixelsPerMm;

//       const pdf = new jsPDF({
//         orientation: pageHeightMm >= pageWidthMm ? "portrait" : "landscape",
//         unit: "mm",
//         format: [pageWidthMm, pageHeightMm],
//         compress: true,
//       });

//       const imageData = canvas.toDataURL("image/png", 1.0);

//       // Place the entire capture on the single page, exact size, no cropping
//       pdf.addImage(imageData, "PNG", 0, 0, pageWidthMm, pageHeightMm, undefined, "FAST");

//       pdf.save(`${fileName}.pdf`);
//     } catch (error) {
//       console.error("Failed to generate PDF:", error);
//       alert("Failed to generate PDF. Please try again.");
//     } finally {
//       setIsGenerating(false);
//     }
//   }

//   return (
//     <button
//       type="button"
//       onClick={handleDownload}
//       disabled={isGenerating}
//       className={`inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
//     >
//       {isGenerating ? (
//         <>
//           <Loader2 className="size-4 animate-spin" />
//           Generating PDF…
//         </>
//       ) : (
//         <>
//           <Download className="size-4" />
//           Download PDF
//         </>
//       )}
//     </button>
//   );
// }

// export default DownloadPdfButton;
