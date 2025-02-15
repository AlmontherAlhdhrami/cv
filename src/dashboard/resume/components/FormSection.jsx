import React, { useState } from 'react';
import PersonalDetail from './forms/PersonalDetail';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Home, LayoutGrid } from 'lucide-react';
import Summery from './forms/Summery';
import Experience from './forms/Experience';
import Education from './forms/Education';
import Skills from './forms/Skills';
import { Link, Navigate, useParams } from 'react-router-dom';
import ThemeColor from './ThemeColor';

function FormSection() {
  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const [enableNext, setEnableNext] = useState(false); // default to false
  const { resumeId } = useParams(); // Updated to camelCase

  // Handler to move to the next step
  const goNext = () => {
    setActiveFormIndex((prev) => prev + 1);
    setEnableNext(false); 
  };

  // Handler to move to the previous step
  const goPrev = () => {
    setActiveFormIndex((prev) => prev - 1);
  };

  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
        <div className='flex gap-5'>
          <Link to="/dashboard">
            <Button><Home /></Button>
          </Link>
          <ThemeColor />
        </div>
        <div className='flex gap-2'>
          {activeFormIndex > 1 && (
            <Button size="sm" onClick={goPrev}>
              <ArrowLeft />
            </Button>
          )}
          <Button
            className="flex gap-2" 
            size="sm"
            onClick={goNext}
          >
            Next <ArrowRight />
          </Button>
        </div>
      </div>

      {/* Render the form step */}
      {activeFormIndex === 1 ? (
        /* 
          PersonalDetail has 'enabledNext={(v) => setEnableNext(v)}'
          So once the user enters valid data or saves, 
          it calls 'setEnableNext(true)' 
        */
        <PersonalDetail enabledNext={setEnableNext} />
      ) : activeFormIndex === 2 ? (
        <Summery enabledNext={setEnableNext} />
      ) : activeFormIndex === 3 ? (
        <Experience />
      ) : activeFormIndex === 4 ? (
        <Education />
      ) : activeFormIndex === 5 ? (
        <Skills />
      ) : activeFormIndex === 6 ? (
        <Navigate to={`/my-resume/${resumeId}/view`} />
      ) : null}
    </div>
  );
}

export default FormSection;
