import React from 'react';

function EducationalPreview({ resumeInfo }) {
  return (
    <div className="my-6">
      <h2
        className="text-center font-bold text-lg mb-2"
        style={{ color: resumeInfo?.themecolor }}
      >
        Education
      </h2>
      <hr style={{ borderColor: resumeInfo?.themecolor }} />

      {resumeInfo?.education?.length > 0 ? (
        resumeInfo.education.map((education, index) => (
          <div key={index} className="my-5">
            <h2
              className="text-lg font-bold"
              style={{ color: resumeInfo?.themecolor }}
            >
              {education.university_name}
            </h2>
            <h2 className="text-lg flex justify-between">
              {education?.degree} in {education?.major}
              <span>
                {education?.start_date} - {education?.end_date}
              </span>
            </h2>
            {education?.description && (
              <p className="text-lg my-2">{education?.description}</p>
            )}
          </div>
        ))
      ) : (
        <p className="text-xs text-gray-500 text-center">No education details available.</p>
      )}
    </div>
  );
}

export default EducationalPreview;
