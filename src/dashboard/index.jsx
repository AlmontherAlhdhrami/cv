import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import AddResume from "./components/AddResume";
import ResumeCardItem from "./components/ResumeCardItem";
import GlobalApi from "../../service/GlobalApi";

function Dashboard() {
  const { user } = useUser();
  const [resumeList, setResumeList] = useState([]);

  useEffect(() => {
    if (user) {
      getResumesList();
    }
  }, [user]);

  const getResumesList = async () => {
    try {
      const response = await GlobalApi.GetUserResumes(user.primaryEmailAddress.emailAddress);

      console.log("🔥 Full API Response:", response);

      if (!response || response.length === 0) {
        console.error("❌ No data returned from API.");
        setResumeList([]);  // Ensuring state updates correctly
      } else {
        console.log("✅ Successfully fetched resumes:", response);
        setResumeList(response); // ✅ Updating state correctly
      }
    } catch (error) {
      console.error("❌ Error fetching resumes:", error);
      setResumeList([]); // Handle errors gracefully
    }
  };

  return (
    <div className='p-10 md:px-20 lg:px-32'>
      <h2 className='font-bold text-3xl'>My cv's سيرتي الذاتية</h2>
      <p>Start creating or edit your CV's.</p>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-10'>
        <AddResume refreshData={getResumesList} />
        {resumeList.length > 0 ? (
          resumeList.map((resume, index) => (
            <ResumeCardItem key={index} resume={resume} refreshData={getResumesList} />
          ))
        ) : (
          <p className="text-center col-span-2 md:col-span-3 lg:col-span-4">No cv's found.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
