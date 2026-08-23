// import DownloadPdfButton from "@/components/(app)/general/buttons/download-pdf-button";
// import Horizon from "@/components/(app)/general/templates/horizan";
// import Nova from "@/components/(app)/general/templates/nova";
// import TemplateFifteen from "@/components/(app)/general/templates/template-fifteen";
// import { seniorSoftwareEngineerResume } from "@/data/resume";
// // ... other imports

// const HomePage = () => {
//   const resume = seniorSoftwareEngineerResume;

//   return (
//     <div className="space-y-12 p-6">
//       {/* ... other templates ... */}

//       {/* IMPORTANT: id goes directly on <Horizon />, which places it
//           on its own 210mm root <article>. Do NOT wrap Horizon in an
//           extra <div id="resume-page"> — that div has no width limit
//           and stretches to this page's full layout width, so the PDF
//           capture would grab that whole wide area (with the 210mm
//           page just centered inside it) instead of exactly the page,
//           producing empty space around your content in the PDF. */}
//       <div className="max-w-4xl mx-auto">
//         <Nova resume={seniorSoftwareEngineerResume} />

//         <Horizon resume={resume} id="resume-page" />

//         <DownloadPdfButton
//           elementId="resume-page"
//           fileName={`${resume.personal.firstName}-${resume.personal.lastName}-resumes1`}
//         />

//         <hr />

//         <TemplateFifteen resume={resume} id="templte id" />

//         <DownloadPdfButton
//           elementId="templateid"
//           fileName={`${resume.personal.firstName}--${resume.personal.lastName}-two`}
//         />
//       </div>
//     </div>
//   );
// };

// export default HomePage;

// // for thee e color chnage is used his one

// //  <div className="mx-auto mb-6 flex w-full max-w-[1200px] items-center justify-end px-4">
// //     <ResumeAppearanceDialog
// //       resume={resume}
// //       onChange={setResume}
// //     >
// //       <button
// //         type="button"
// //         className="inline-flex h-10 items-center gap-2 rounded-lg border bg-background px-4 text-sm font-medium shadow-sm transition-colors hover:bg-muted"
// //       >
// //         <Palette className="size-4" />
// //         Change appearance
// //       </button>
// //     </ResumeAppearanceDialog>
// //   </div>

// //   const [resume, setResume] = useState<ResumeData>(
// // seniorSoftwareEngineerResume,
// // );
