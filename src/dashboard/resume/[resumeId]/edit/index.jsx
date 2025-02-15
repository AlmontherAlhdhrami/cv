import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FormSection from '../../components/FormSection';
import ResumePreview from '../../components/ResumePreview';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import GlobalApi from '../../../../../service/GlobalApi';

function EditResume() {
  const { resumeId } = useParams(); // ✅ Ensure correct param name

  const [resumeInfo, setResumeInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (resumeId) {
      getResumeInfo(resumeId);
    }
  }, [resumeId]);

  const getResumeInfo = async (id) => {
    setLoading(true);
    setError('');

    try {
      const resumeData = await GlobalApi.GetResumeById(id);

      if (!resumeData) {
        setError("❌ No resume found.");
      } else {
        setResumeInfo(resumeData);
      }
    } catch (err) {
      console.error('❌ Error fetching resume info:', err);
      setError("❌ Error loading resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div className="grid grid-cols-1 md:grid-cols-2 p-10 gap-10">
        {loading ? (
          <p>Loading resume details...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <FormSection />
            <ResumePreview />
          </>
        )}
      </div>
    </ResumeInfoContext.Provider>
  );
}

export default EditResume;
