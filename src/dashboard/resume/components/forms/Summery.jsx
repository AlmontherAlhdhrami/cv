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
  "Job Title: {job_title} . Based on the job title, provide a list of 3 experience levels: Senior, Mid-Level, and Fresher, with a 3-4 line summary for each in an array format, including summary and experience_level fields in JSON format.";

function Summery({ enabledNext }) {
  const { resumeId } = useParams();
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiGeneratedSummaryList, setAiGeneratedSummaryList] = useState([]);

  useEffect(() => {
    if (resumeId) {
      fetchSummary();
    }
  }, [resumeId]);

  // ✅ Fetch Summary from Database
  const fetchSummary = async () => {
    try {
      const data = await GlobalApi.GetSummaryByResumeId(resumeId);
      if (data) {
        setSummary(data);
      }
    } catch (error) {
      console.error("❌ Error fetching summary:", error);
    }
  };

  const GenerateSummaryFromAI = async () => {
    if (!resumeInfo?.job_title) {
      toast('❌ Please add a job title before generating the summary.');
      return;
    }
  
    setLoading(true);
  
    const prompt = promptTemplate.replace('{job_title}', resumeInfo.job_title);
  
    try {
      const result = await AIChatSession.sendMessage(prompt);
      let responseText = await result.response.text();
  
      console.log("🟢 Raw AI Response:", responseText); // Debugging AI response
  
      // ✅ Remove markdown formatting (` ```json ` and ` ``` `)
      responseText = responseText.replace(/```json|```/g, "").trim();
  
      let responseData;
  
      // ✅ Ensure response is valid JSON
      try {
        responseData = JSON.parse(responseText);
      } catch (jsonError) {
        console.error("❌ Error parsing AI response:", jsonError);
        toast("❌ AI response is not valid JSON.");
        return;
      }
  
      // ✅ Ensure response is in correct array format
      if (!Array.isArray(responseData)) {
        console.error("❌ AI response is not an array:", responseData);
        toast("❌ AI response format error.");
        return;
      }
  
      setAiGeneratedSummaryList(responseData);
    } catch (error) {
      console.error("❌ AI Generation Error:", error);
      toast('❌ Failed to generate summary from AI.');
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
      toast("✅ Summary updated successfully!");
    } catch (error) {
      console.error('❌ Error updating summary:', error);
      toast("❌ Failed to update summary.");
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
            <label>Add Summary</label>
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
            <Button type="submit" disabled={loading}>
              {loading ? <LoaderCircle className='animate-spin' /> : 'Save'}
            </Button>
          </div>
        </form>
      </div>

      {aiGeneratedSummaryList.length > 0 && (
        <div className='my-5'>
          <h2 className='font-bold text-lg'>Suggestions</h2>
          {aiGeneratedSummaryList.map((item, index) => (
            <div
              key={index}
              onClick={() => setSummary(item?.summary)}
              className='p-5 shadow-lg my-4 rounded-lg cursor-pointer'
            >
              <h2 className='font-bold my-1 text-primary'>Level: {item?.experience_level}</h2>
              <p>{item?.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Summery;
