import React from 'react';

function PersonalDetailPreview({ resumeInfo }) {
  // ✅ Use `personalDetails` if available
  const personalDetails = resumeInfo?.personalDetails || {};
  const themecolor = resumeInfo?.themecolor || "#000";

  return (
    <div>
      {/* ✅ Full Name */}
      <h2 className='font-bold text-xl text-center' style={{ color: themecolor }}>
        {personalDetails?.first_name || "N/A"} {personalDetails?.last_name || "N/A"}
      </h2>

      {/* ✅ Job Title */}
      <h2 className='text-center text-lg font-medium'>
        {personalDetails?.job_title || "N/A"}
      </h2>

      {/* ✅ Address */}
      <h2 className='text-center font-normal text-lg' style={{ color: themecolor }}>
        {personalDetails?.address || "N/A"}
      </h2>

      {/* ✅ Contact Details (Phone & Email) */}
      <div className='flex justify-between mt-1'>
        <h2 className='font-normal text-lg' style={{ color: themecolor }}>
          📞 {personalDetails?.phone || "N/A"}
        </h2>
        <h2 className='font-normal text-lg' style={{ color: themecolor }}>
          📧 {personalDetails?.email || "N/A"}
        </h2>
      </div>

      {/* ✅ Divider */}
      <hr className='border-[1.5px] my-2' style={{ borderColor: themecolor }} />
    </div>
  );
}

export default PersonalDetailPreview;
