import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useContext, useEffect, useState } from "react";
import RichTextEditor from "../RichTextEditor";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { useParams } from "react-router-dom";
import GlobalApi from "./../../../../../service/GlobalApi";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";

function Experience() {
  const { resumeId } = useParams();
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [loading, setLoading] = useState(false);

  // Initialize experience list or load from context
  const [experienceList, setExperienceList] = useState([
    {
      title: "",
      company: "",
      city: "",
      state: "",
      start_date: "",
      end_date: "",
      currently_working: false,
      description: "",
    },
  ]);

  // Load experience from context if available
  useEffect(() => {
    if (resumeInfo?.experience?.length > 0) {
      setExperienceList(resumeInfo.experience);
    }
  }, [resumeInfo]);

  // Update experience in context
  useEffect(() => {
    setResumeInfo((prev) => ({
      ...prev,
      experience: experienceList,
    }));
  }, [experienceList, setResumeInfo]);

  // Handle text and date inputs
  const handleChange = (index, event) => {
    const { name, value } = event.target;
    setExperienceList((prev) =>
      prev.map((exp, i) => (i === index ? { ...exp, [name]: value } : exp))
    );
  };

  // Handle RichTextEditor for 'description'
  const handleRichTextEditor = (newString, index) => {
    setExperienceList((prev) =>
      prev.map((exp, i) =>
        i === index ? { ...exp, description: newString } : exp
      )
    );
  };

  // Add new experience entry
  const AddNewExperience = () => {
    setExperienceList((prev) => [
      ...prev,
      {
        title: "",
        company: "",
        city: "",
        state: "",
        start_date: "",
        end_date: "",
        currently_working: false,
        description: "",
      },
    ]);
  };

  // Remove last experience entry
  const RemoveExperience = () => {
    if (experienceList.length > 1) {
      setExperienceList((prev) => prev.slice(0, -1));
    }
  };

  // Save experience to the database
  const onSave = async () => {
    if (!resumeId) {
      toast.error("❌ Error: Resume ID is missing.");
      return;
    }

    setLoading(true);
    try {
      await GlobalApi.UpdateExperienceDetails(resumeId, experienceList);
      toast.success("✅ Experience details updated successfully!");
    } catch (error) {
      console.error("❌ Error updating experience details:", error);
      toast.error("❌ Error updating experience details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Professional Experience</h2>
      <p>Add Your Previous Job Experience</p>
      <div>
        {experienceList.map((item, index) => (
          <div key={index} className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
            {/* Title */}
            <div>
              <label className="text-xs">Position Title</label>
              <Input
                name="title"
                value={item.title}
                onChange={(event) => handleChange(index, event)}
              />
            </div>
            {/* Company */}
            <div>
              <label className="text-xs">Company Name</label>
              <Input
                name="company"
                value={item.company}
                onChange={(event) => handleChange(index, event)}
              />
            </div>
            {/* City */}
            <div>
              <label className="text-xs">City</label>
              <Input
                name="city"
                value={item.city}
                onChange={(event) => handleChange(index, event)}
              />
            </div>
            {/* State */}
            <div>
              <label className="text-xs">State</label>
              <Input
                name="state"
                value={item.state}
                onChange={(event) => handleChange(index, event)}
              />
            </div>
            {/* Start Date */}
            <div>
              <label className="text-xs">Start Date</label>
              <Input
                type="date"
                name="start_date"
                value={item.start_date}
                onChange={(event) => handleChange(index, event)}
              />
            </div>
            {/* End Date */}
            <div>
              <label className="text-xs">End Date</label>
              <Input
                type="date"
                name="end_date"
                value={item.end_date}
                onChange={(event) => handleChange(index, event)}
              />
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label className="text-xs">Job Description</label>
              <RichTextEditor
                index={index}
                defaultValue={item.description}
                onRichTextEditorChange={(val) => handleRichTextEditor(val, index)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" onClick={AddNewExperience}>
            + Add More Experience
          </Button>
          <Button variant="outline" onClick={RemoveExperience}>
            - Remove
          </Button>
        </div>

        {/* ✅ Fix: Ensure `onClick` triggers `onSave` */}
        <Button 
          type="button"  // ✅ Fix: Ensure this is a button, not a submit
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

export default Experience;
