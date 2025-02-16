import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import GlobalApi from './../../../../../service/GlobalApi';
import { toast } from 'sonner';

function Skills() {
  const { resumeId: paramresumeId } = useParams();
  const resumeId = paramresumeId || localStorage.getItem("resumeId");

  if (!resumeId) {
    console.error("❌ Resume ID is missing.");
    return <p className="text-red-500">❌ Error: Resume ID is missing.</p>;
  }

  console.log("🔍 Resume ID Found:", resumeId);

  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [skillsList, setSkillsList] = useState([{ name: '', rating: 0 }]);
  const [loading, setLoading] = useState(false);

  // ✅ Load skills data if available in context
  useEffect(() => {
    if (resumeInfo?.skills?.length > 0) {
      setSkillsList(resumeInfo.skills);
    }
  }, [resumeInfo]);

  // ✅ Sync context when skills list changes
  useEffect(() => {
    setResumeInfo((prev) => ({
      ...prev,
      skills: skillsList,
    }));
  }, [skillsList, setResumeInfo]);

  // ✅ Handle Input Change
  const handleChange = (index, field, value) => {
    setSkillsList((prev) =>
      prev.map((skill, i) => (i === index ? { ...skill, [field]: value } : skill))
    );
  };

  // ✅ Add New Skill Entry
  const AddNewSkill = () => {
    setSkillsList([...skillsList, { name: '', rating: 0 }]);
  };

  // ✅ Remove Last Skill Entry
  const RemoveSkill = () => {
    if (skillsList.length > 1) {
      setSkillsList((prev) => prev.slice(0, -1));
    }
  };

  // ✅ Save Skills Data to Database
  const onSave = async () => {
    if (!resumeId) {
      toast.error("❌ Error: Resume ID is missing.");
      return;
    }

    setLoading(true);
    try {
      await GlobalApi.UpdateSkillsDetails(resumeId, skillsList);
      toast.success('✅ Skills updated successfully!');
    } catch (error) {
      console.error('❌ Error updating skills:', error);
      toast.error('❌ Failed to update skills. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Skills</h2>
      <p>Add Your Top Professional Skills</p>

      <div>
        {skillsList.map((item, index) => (
          <div key={index} className="flex justify-between mb-2 border rounded-lg p-3">
            <div className="flex-1 mr-3">
              <label className="text-xs">Skill Name</label>
              <Input
                className="w-full"
                value={item.name}
                onChange={(e) => handleChange(index, 'name', e.target.value)}
              />
            </div>
            <Rating
              style={{ maxWidth: 120 }}
              value={item.rating}
              onChange={(v) => handleChange(index, 'rating', v)}
            />
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" onClick={AddNewSkill} className="text-primary">
            + Add More Skill
          </Button>
          <Button variant="outline" onClick={RemoveSkill} className="text-primary">
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

export default Skills;
