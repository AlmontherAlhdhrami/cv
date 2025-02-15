import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FormSection from '../components/forms/FormSection';
import ResumePreview from '../components/ResumePreview';
import GlobalApi from '../service/GlobalApi';

function EditResume() {
  const { resumeId } = useParams();
  const [resumeInfo, setResumeInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (resumeId) {
      setResumeInfo(null);  // ✅ Clear previous state to avoid flicker
      fetchResumeDetails();
    }
  }, [resumeId]);  // ✅ Re-fetch data when `resumeId` changes

  const fetchResumeDetails = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await GlobalApi.GetResumeById(resumeId);

      if (response && response.data) {
        // ✅ Handle API returning an array instead of an object
        const resumeData = Array.isArray(response.data) ? response.data[0] : response.data;

        if (!resumeData) {
          setError("❌ No resume found.");
        } else {
          setResumeInfo(resumeData);
        }
      } else {
        setError("❌ No resume found.");
      }
    } catch (error) {
      console.error("Error fetching resume details:", error);
      setError("❌ Failed to load resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container mx-auto p-4'>
      <h1 className="text-xl font-bold">Edit Resume</h1>
      
      {loading && <p>Loading resume details...</p>}

      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && resumeInfo && (
        <>
          <FormSection resumeInfo={resumeInfo} setResumeInfo={setResumeInfo} />
          <ResumePreview resumeInfo={resumeInfo} />
        </>
      )}
    </div>
  );
}

export default EditResume;
