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
  // ✅ Get `resumeId` from URL params or fallback to prop
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

  useEffect(() => {
    if (resumeInfo?.education) {
      setEducationalList(resumeInfo.education);
    }
  }, [resumeInfo]);

  const handleChange = (event, index) => {
    const newEntries = [...educationalList];
    const { name, value } = event.target;
    newEntries[index][name] = value;
    setEducationalList(newEntries);
  };

  const AddNewEducation = () => {
    setEducationalList([
      ...educationalList,
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

  const RemoveEducation = () => {
    if (educationalList.length > 1) {
      setEducationalList(educationalList.slice(0, -1));
    }
  };

  const onSave = async () => {
    if (!resumeId) {
      toast.error("❌ Error: Resume ID is missing.");
      return;
    }
  
    setLoading(true);
    try {
      // Ensure education details are correctly formatted
      const educationData = educationalList.map((edu) => ({
        resumeId, // Ensure resumeId is assigned
        university_name: edu.university_name,
        degree: edu.degree,
        major: edu.major,
        start_date: edu.start_date,
        end_date: edu.end_date,
        description: edu.description,
      }));
  
      // ✅ Call the function correctly
      await GlobalApi.UpdateEducationDetails(resumeId, educationData);
      toast('✅ Education details updated successfully!');
    } catch (error) {
      console.error('❌ Error updating education details:', error);
      toast('❌ Error updating education details. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    setResumeInfo((prev) => ({
      ...prev,
      education: educationalList,
    }));
  }, [educationalList]);

  return (
    <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
      <h2 className='font-bold text-lg'>Education</h2>
      <p>Add Your educational details</p>

      <div>
        {educationalList.map((item, index) => (
          <div key={index} className='grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg'>
            <div className='col-span-2'>
              <label>University Name</label>
              <Input
                name='university_name'
                onChange={(e) => handleChange(e, index)}
                value={item.university_name}
              />
            </div>
            <div>
              <label>Degree</label>
              <Input
                name='degree'
                onChange={(e) => handleChange(e, index)}
                value={item.degree}
              />
            </div>
            <div>
              <label>Major</label>
              <Input
                name='major'
                onChange={(e) => handleChange(e, index)}
                value={item.major}
              />
            </div>
            <div>
              <label>Start Date</label>
              <Input
                type='date'
                name='start_date'
                onChange={(e) => handleChange(e, index)}
                value={item.start_date}
              />
            </div>
            <div>
              <label>End Date</label>
              <Input
                type='date'
                name='end_date'
                onChange={(e) => handleChange(e, index)}
                value={item.end_date}
              />
            </div>
            <div className='col-span-2'>
              <label>Description</label>
              <Textarea
                name='description'
                onChange={(e) => handleChange(e, index)}
                value={item.description}
              />
            </div>
          </div>
        ))}
      </div>

      <div className='flex justify-between'>
        <div className='flex gap-2'>
          <Button variant='outline' onClick={AddNewEducation} className='text-primary'>
            + Add More Education
          </Button>
          <Button variant='outline' onClick={RemoveEducation} className='text-primary'>
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

export default Education;
