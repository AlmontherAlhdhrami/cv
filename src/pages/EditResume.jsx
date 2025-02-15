import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GlobalApi from '../service/GlobalApi';
import FormSection from '../components/forms/FormSection'; // تأكد من صحة المسار
import ResumePreview from '../components/ResumePreview'; // تأكد من صحة المسار

function EditResume() {
  const { resumeId } = useParams();
  const [resumeInfo, setResumeInfo] = useState(null);

  useEffect(() => {
    fetchResumeDetails();
  }, [resumeId]);

  const fetchResumeDetails = async () => {
    try {
      const response = await GlobalApi.GetResumeById(resumeId);
      setResumeInfo(response.data || {}); // التأكد من أن البيانات ليست `undefined`
    } catch (error) {
      console.error("Error fetching resume details:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Resume</h1>
      {resumeInfo ? (
        <>
          <FormSection resumeInfo={resumeInfo} setResumeInfo={setResumeInfo} />
          <ResumePreview resumeInfo={resumeInfo} />
        </>
      ) : (
        <p className="text-gray-500">Loading resume details...</p>
      )}
    </div>
  );
}

export default EditResume;
