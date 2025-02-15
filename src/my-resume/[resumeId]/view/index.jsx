import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GlobalApi from "./../../../../service/GlobalApi";
import ResumePreview from "@/dashboard/resume/components/ResumePreview";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { Button } from "@/components/ui/button";
import { RWebShare } from "react-web-share";
import Header from "@/components/custom/Header";

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

  const handleDownload = () => {
    window.print();
  };

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div id="no-print">
        <Header />
        <div className="my-10 mx-10 md:mx-20 lg:mx-36">
        <h4 className="text-center text-2xl font-medium">شكرا لك لإستخدامك منصة رفاد </h4>

          <h2 className="text-center text-2xl font-medium">🎉 Congrats! Your CV's Ready!</h2>
          <p className="text-center text-gray-400">
            Now you can download your CV or share your unique URL with others.
          </p>

          <div className="flex justify-center gap-5 my-10">
            <Button onClick={handleDownload}>Download</Button>
            {resumeId && (
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
