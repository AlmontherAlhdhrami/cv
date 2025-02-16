import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { LoaderCircle } from 'lucide-react';
import GlobalApi from './../../../../../service/GlobalApi';
import { toast } from 'sonner';

function Education({ resumeId: propresumeId }) {
  // ✅ Ensure resumeId is always available
  const { resumeId: paramresumeId } = useParams();
  const resumeId = propresumeId || paramresumeId || localStorage.getItem("resumeId");

  if (!resumeId) {
    console.error("❌ Resume ID is missing.");
    return <p className="text-red-500">❌ Error: Resume ID is missing.</p>;
  }

  console.log("🔍 Resume ID Found:", resumeId);

  const [loading, setLoading] = useState(false);
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [educationalList, setEducationalList] = useState([
    {
      university_name: '',
      degree: '',
      major: '',
      start_date: '',
      end_date: '',
      description: '',
    },
  ]);

  // ✅ Load education details from context if available
  useEffect(() => {
    if (resumeInfo?.education?.length > 0) {
      setEducationalList(resumeInfo.education);
    }
  }, [resumeInfo]);

  // ✅ Sync with context whenever educationalList changes
  useEffect(() => {
    setResumeInfo((prev) => ({
      ...prev,
      education: educationalList,
    }));
  }, [educationalList, setResumeInfo]);

  // ✅ Handle Input Changes
  const handleChange = (event, index) => {
    const { name, value } = event.target;
    setEducationalList((prev) =>
      prev.map((edu, i) => (i === index ? { ...edu, [name]: value } : edu))
    );
  };

  // ✅ Add New Education Entry
  const AddNewEducation = () => {
    setEducationalList((prev) => [
      ...prev,
      {
        university_name: '',
        degree: '',
        major: '',
        start_date: '',
        end_date: '',
        description: '',
      },
    ]);
  };

  // ✅ Remove Last Education Entry
  const RemoveEducation = () => {
    if (educationalList.length > 1) {
      setEducationalList((prev) => prev.slice(0, -1));
    }
  };

  // ✅ Save Education Details to Database
  const onSave = async () => {
    if (!resumeId) {
      toast.error("❌ Error: Resume ID is missing.");
      return;
    }

    setLoading(true);
    try {
      // Ensure data is correctly formatted
      const educationData = educationalList.map((edu) => ({
        resumeId,
        university_name: edu.university_name,
        degree: edu.degree,
        major: edu.major,
        start_date: edu.start_date,
        end_date: edu.end_date,
        description: edu.description,
      }));

      // ✅ Call API to save data
      await GlobalApi.UpdateEducationDetails(resumeId, educationData);
      toast.success('✅ Education details updated successfully!');
    } catch (error) {
      console.error('❌ Error updating education details:', error);
      toast.error('❌ Error updating education details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Education</h2>
      <p>Add Your Educational Details</p>

      <div>
        {educationalList.map((item, index) => (
          <div key={index} className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
            <div className="col-span-2">
              <label>University Name</label>
              <Input
                name="university_name"
                value={item.university_name}
                onChange={(e) => handleChange(e, index)}
              />
            </div>
            <div>
              <label>Degree</label>
              <Input
                name="degree"
                value={item.degree}
                onChange={(e) => handleChange(e, index)}
              />
            </div>
            <div>
              <label>Major</label>
              <Input
                name="major"
                value={item.major}
                onChange={(e) => handleChange(e, index)}
              />
            </div>
            <div>
              <label>Start Date</label>
              <Input
                type="date"
                name="start_date"
                value={item.start_date}
                onChange={(e) => handleChange(e, index)}
              />
            </div>
            <div>
              <label>End Date</label>
              <Input
                type="date"
                name="end_date"
                value={item.end_date}
                onChange={(e) => handleChange(e, index)}
              />
            </div>
            <div className="col-span-2">
              <label>Description</label>
              <Textarea
                name="description"
                value={item.description}
                onChange={(e) => handleChange(e, index)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" onClick={AddNewEducation} className="text-primary">
            + Add More Education
          </Button>
          <Button variant="outline" onClick={RemoveEducation} className="text-primary">
            - Remove
          </Button>
        </div>

        {/* ✅ Fix: Save Button Now Works */}
        <Button
          type="button"  // ✅ Ensure it's a button (not submit)
          onClick={onSave}
          disabled={loading}
          className="bg-[#4c46bb] text-white hover:bg-[#3b3699] disabled:bg-gray-400"
        >
          {loading ? <LoaderCircle className="animate-spin" /> : 'Save'}
        </Button>
      </div>
    </div>
  );
}

export default Education;
