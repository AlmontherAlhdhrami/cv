import React from 'react';

function SummeryPreview({ resumeInfo }) {
  return (
    <p className='text-xs'>
      {/* ✅ إضافة قيمة افتراضية إذا لم يكن هناك ملخص */}
      {resumeInfo?.summary?.trim() 
        ? <span dangerouslySetInnerHTML={{ __html: resumeInfo.summary }} /> 
        : "No summary available"}
    </p>
  );
}

export default SummeryPreview;
