import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GlobalApi from "./../../../../service/GlobalApi";
import ResumePreview from "@/dashboard/resume/components/ResumePreview";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { Button } from "@/components/ui/button";
import { RWebShare } from "react-web-share";
import Header from "@/components/custom/Header";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function ViewResume() {
  const { resumeId } = useParams();
  const [resumeInfo, setResumeInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (resumeId) {
      getFullResumeInfo();
    }
  }, [resumeId]);

  const getFullResumeInfo = async () => {
    setLoading(true);
    setError("");

    try {
      const mainResume = await GlobalApi.GetResumeById(resumeId);
      if (!mainResume) {
        setError("❌ No resume found.");
        setResumeInfo(null);
        return;
      }

      // Fetch personal details separately
      const personalDetails = await GlobalApi.GetPersonalDetails(resumeId);

      // Fetch other data
      const [experience, education, skills] = await Promise.all([
        GlobalApi.GetExperienceDetails(resumeId),
        GlobalApi.GetEducationDetails(resumeId),
        GlobalApi.GetSkillsByResumeId(resumeId),
      ]);

      // Fetch summary
      const summary = await GlobalApi.GetSummaryByResumeId(resumeId);

      // Merge everything
      const combined = {
        ...mainResume,   // includes themecolor from 'resumes'
        personalDetails, // from 'personal_details'
        experience,
        education,
        skills,
        summary,
      };

      setResumeInfo(combined);
    } catch (err) {
      console.error("❌ Error fetching resume:", err);
      setError("❌ Error loading resume.");
      setResumeInfo(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ تحميل ملف PDF مع تفعيل الخلفيات تلقائيًا عند الضغط على زر "Download"
  const handleDownload = async () => {
    const element = document.getElementById("print-area");

    // 🎯 أخذ لقطة شاشة للـ CV مع الحفاظ على جودة الطباعة
    const canvas = await html2canvas(element, {
      scale: 2,        // تحسين الجودة
      useCORS: true,   // حل مشكلة الصور الخارجية
      backgroundColor: null, // الحفاظ على خلفية شفافة
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210; // عرض PDF بالـ mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width; // الحفاظ على الأبعاد

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save("Resume.pdf"); // 🛑 حفظ ملف PDF تلقائيًا عند الضغط على زر التحميل
  };

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div id="no-print">
        <Header />
        <div className="my-10 mx-10 md:mx-20 lg:mx-36">
          <h4 className="text-center text-2xl font-medium">شكرا لك لإستخدامك منصة رفاد</h4>

          <h2 className="text-center text-2xl font-medium">🎉 Congrats! Your CV's Ready!</h2>
          <p className="text-center text-gray-400">
            Now you can download your CV or share your unique URL with others.
          </p>

          <div className="flex justify-center gap-5 my-10">
            <Button onClick={handleDownload}>Download</Button>

            {resumeId && navigator.share ? (
              <Button
                onClick={() => {
                  navigator.share({
                    title: "📄 Check out my resume!",
                    text: "View my resume online.",
                    url: `${import.meta.env.VITE_BASE_URL}/my-resume/${resumeId}/view`,
                  })
                    .then(() => console.log("✅ Resume shared successfully!"))
                    .catch((error) => console.error("❌ Error sharing:", error));
                }}
              >
                Share
              </Button>
            ) : (
              <RWebShare
                data={{
                  text: "📄 Check out my resume!",
                  url: `${import.meta.env.VITE_BASE_URL}/my-resume/${resumeId}/view`,
                  title: resumeInfo?.personalDetails
                    ? `${resumeInfo?.personalDetails?.first_name || ""} ${resumeInfo?.personalDetails?.last_name || ""} Resume`
                    : "My Resume",
                }}
                onClick={() => console.log("✅ Resume shared successfully!")}
              >
                <Button>Share</Button>
              </RWebShare>
            )}
          </div>
        </div>
      </div>

      <div className="my-10 mx-10 md:mx-20 lg:mx-36">
        {loading ? (
          <p className="text-center text-gray-500">Loading resume...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : resumeInfo ? (
          <div id="print-area">
            <ResumePreview resumeInfo={resumeInfo} />
          </div>
        ) : (
          <p className="text-center text-gray-500">No resume found.</p>
        )}
      </div>
    </ResumeInfoContext.Provider>
  );
}

export default ViewResume;
