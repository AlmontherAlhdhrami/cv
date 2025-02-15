import React from "react";

function ExperiencePreview({ resumeInfo }) {
  return (
    <div className="my-6">
      <h2
        className="text-center font-bold text-sm mb-2"
        style={{ color: resumeInfo?.themecolor }}
      >
        Professional Experience
      </h2>
      <hr style={{ borderColor: resumeInfo?.themecolor }} />

      {resumeInfo?.experience?.length > 0 ? (
        resumeInfo.experience.map((exp, index) => (
          <div key={index} className="my-5">
            <h2 className="text-sm font-bold" style={{ color: resumeInfo?.themecolor }}>
              {exp?.title}
            </h2>
            <h2 className="text-xs flex justify-between">
              {exp?.company}, {exp?.city}, {exp?.state}
              <span>
                {exp?.start_date} -{" "}
                {exp?.currently_working ? "Present" : exp?.end_date}
              </span>
            </h2>
            {exp?.description && (
              <div
                className="text-xs my-2"
                dangerouslySetInnerHTML={{ __html: exp.description }}
              />
            )}
          </div>
        ))
      ) : (
        <p className="text-xs text-gray-500 text-center">No experience available.</p>
      )}
    </div>
  );
}

export default ExperiencePreview;
