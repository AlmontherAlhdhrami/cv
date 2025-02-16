import React, { useContext, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { useParams } from 'react-router-dom';
import GlobalApi from './../../../../../service/GlobalApi';
import { Brain, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { AIChatSession } from './../../../../../service/AIModal';

// ✅ AI Prompt Template
const promptTemplate = 
  "Job Title: {job_title}. Based on the job title, provide a professional summary of 3-4 sentences. Return only plain text.";

function Summery({ enabledNext }) {
  const { resumeId } = useParams();
  const { setResumeInfo } = useContext(ResumeInfoContext);
  
  const [summary, setSummary] = useState('');
  const [jobTitle, setJobTitle] = useState(''); // ✅ Store job title from database
  const [loading, setLoading] = useState(false);
  const [aiGeneratedSummaryList, setAiGeneratedSummaryList] = useState([]);

  useEffect(() => {
    if (resumeId) {
      fetchJobTitle();
      fetchSummary();
    }
  }, [resumeId]);

  // ✅ Fetch Job Title Directly from Database
  const fetchJobTitle = async () => {
    try {
      const personalDetails = await GlobalApi.GetPersonalDetails(resumeId);
      if (personalDetails?.job_title) {
        setJobTitle(personalDetails.job_title.trim());
        console.log("✅ Fetched Job Title:", personalDetails.job_title);
      } else {
        console.log("⚠ No Job Title found.");
      }
    } catch (error) {
      console.error("❌ Error fetching job title:", error);
    }
  };

  // ✅ Fetch Summary from Database
  const fetchSummary = async () => {
    try {
      const data = await GlobalApi.GetSummaryByResumeId(resumeId);
      if (data?.summary) {
        setSummary(data.summary);
        console.log("✅ Fetched Summary:", data.summary);
      } else {
        console.log("⚠ No Summary found.");
      }
    } catch (error) {
      console.error("❌ Error fetching summary:", error);
    }
  };

  // ✅ AI Generation (Uses Job Title from Database)
  const GenerateSummaryFromAI = async () => {
    if (!jobTitle) {
      toast.error("❌ Please add a job title before generating the summary.");
      return;
    }

    setLoading(true);
    const prompt = promptTemplate.replace('{job_title}', jobTitle);

    try {
      const result = await AIChatSession.sendMessage(prompt);
      let responseText = await result.response.text();
      console.log("🟢 AI Response:", responseText);

      setSummary(responseText.trim());
    } catch (error) {
      console.error("❌ AI Generation Error:", error);
      toast.error("❌ Failed to generate summary from AI.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Save Summary to Database
  const onSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await GlobalApi.SaveSummary(resumeId, summary);
      setResumeInfo((prev) => ({ ...prev, summary }));
      enabledNext(true);
      toast.success("✅ Summary updated successfully!");
    } catch (error) {
      console.error('❌ Error updating summary:', error);
      toast.error("❌ Failed to update summary.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
        <h2 className='font-bold text-lg'>Summary</h2>
        <p>Add a summary for your job title</p>

        <form className='mt-7' onSubmit={onSave}>
          <div className='flex justify-between items-end'>
            <label>Job Title: {jobTitle || "N/A"}</label> {/* ✅ Displays Job Title */}
            <Button
              variant="outline"
              onClick={GenerateSummaryFromAI}
              type="button"
              size="sm"
              className="border-primary text-primary flex gap-2"
              disabled={loading}
            >
              {loading ? (
                <LoaderCircle className='animate-spin' />
              ) : (
                <>
                  <Brain className='h-4 w-4' /> Generate from AI
                </>
              )}
            </Button>
          </div>
          <Textarea
            className="mt-5"
            required
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
          <div className='mt-2 flex justify-end'>
            <Button 
              type="submit" 
              disabled={loading} 
              className={`bg-[#4c46bb] text-white hover:bg-[#3b3699] disabled:bg-gray-400 disabled:cursor-not-allowed`}
            >
              {loading ? <LoaderCircle className="animate-spin" /> : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Summery;
