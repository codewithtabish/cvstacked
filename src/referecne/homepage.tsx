import DownloadPdfButton from "@/components/(app)/general/buttons/download-pdf-button";
import Aurora from "@/components/(app)/general/templates/auora";
import Horizon from "@/components/(app)/general/templates/horizan";
import Nova from "@/components/(app)/general/templates/nova";
import { seniorSoftwareEngineerResume } from "@/data/resume";
// ... other imports

const HomePage = () => {
  const resume = seniorSoftwareEngineerResume;

  return (
    <div className="space-y-12 p-6">
      {/* ... other templates ... */}

      {/* IMPORTANT: id goes directly on <Horizon />, which places it
          on its own 210mm root <article>. Do NOT wrap Horizon in an
          extra <div id="resume-page"> — that div has no width limit
          and stretches to this page's full layout width, so the PDF
          capture would grab that whole wide area (with the 210mm
          page just centered inside it) instead of exactly the page,
          producing empty space around your content in the PDF. */}
      <div className="max-w-4xl mx-auto">
        <Nova resume={seniorSoftwareEngineerResume} />

        <Horizon resume={resume} id="resume-page" />

        <DownloadPdfButton
          elementId="resume-page"
          fileName={`${resume.personal.firstName}-${resume.personal.lastName}-resumes1`}
        />

        <hr />

        <Aurora resume={resume} id="resume-page-two" />

        <DownloadPdfButton
          elementId="resume-page-two"
          fileName={`${resume.personal.firstName}--${resume.personal.lastName}-two`}
        />
      </div>
    </div>
  );
};

export default HomePage;
