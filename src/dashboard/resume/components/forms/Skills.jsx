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
  const { resumeId } = useParams(); // ✅ Ensure correct param name
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [skillsList, setSkillsList] = useState([{ name: '', rating: 0 }]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch Skills Data on Component Mount
  useEffect(() => {
    if (resumeInfo?.skills) {
      setSkillsList(resumeInfo.skills);
    }
  }, [resumeInfo]);

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

  // ✅ Save Skills Data to Supabase
  const onSave = async () => {
    if (!resumeId) {
      toast.error("❌ Error: Resume ID is missing.");
      return;
    }

    setLoading(true);
    try {
      await GlobalApi.UpdateSkillsDetails(resumeId, skillsList);
      setResumeInfo((prev) => ({ ...prev, skills: skillsList }));
      toast('✅ Skills updated successfully!');
    } catch (error) {
      console.error('❌ Error updating skills:', error);
      toast('❌ Failed to update skills. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
      <h2 className='font-bold text-lg'>Skills</h2>
      <p>Add Your Top Professional Skills</p>

      <div>
        {skillsList.map((item, index) => (
          <div key={index} className='flex justify-between mb-2 border rounded-lg p-3'>
            <div>
              <label className='text-xs'>Skill Name</label>
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

      <div className='flex justify-between'>
        <div className='flex gap-2'>
          <Button variant="outline" onClick={AddNewSkill} className="text-primary">
            + Add More Skill
          </Button>
          <Button variant="outline" onClick={RemoveSkill} className="text-primary">
            - Remove
          </Button>
        </div>
        <Button disabled={loading} onClick={onSave}>
          {loading ? <LoaderCircle className='animate-spin' /> : 'Save'}
        </Button>
      </div>
    </div>
  );
}

export default Skills;
