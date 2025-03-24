import React from 'react';

function SkillsPreview({ resumeInfo }) {
  return (
    <div className='my-6'>
      {/* ✅ تعديل العنوان إلى "Skills" بدلًا من "Education" */}
      <h2 className='text-center font-bold text-lg mb-2'
        style={{
          color: resumeInfo?.themecolor
        }}
      >Skills</h2>
      <hr style={{
        borderColor: resumeInfo?.themecolor
      }} />

      <div className='grid grid-cols-2 gap-3 my-4'>
        {resumeInfo?.skills?.length > 0 ? (
          resumeInfo?.skills.map((skill, index) => (
            <div key={index} className='flex items-center justify-between'>
              {/* ✅ إضافة قيمة افتراضية في حالة عدم توفر اسم المهارة */}
              <h2 className='text-lg'>{skill?.name ?? "N/A"}</h2>
              <div className='h-2 bg-gray-200 w-[120px]'>
                <div className='h-2'
                  style={{
                    backgroundColor: resumeInfo?.themecolor,
                    width: (skill?.rating ?? 0) * 20 + '%'
                  }}
                >
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-center">No skills added</p>
        )}
      </div>
    </div>
  );
}

export default SkillsPreview;
