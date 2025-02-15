import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import AddResume from "../components/AddResume";  // تأكد من أن المسار صحيح
import ResumeCardItem from "../components/ResumeCardItem";  // تأكد من أن المسار صحيح
import GlobalApi from "../service/GlobalApi";

function Dashboard() {
  const { user } = useUser(); // جلب بيانات المستخدم من Clerk
  const [resumeList, setResumeList] = useState([]);

  useEffect(() => {
    if (user) {
      getResumesList();
    }
  }, [user]);

  const getResumesList = async () => {
    try {
      const response = await GlobalApi.GetUserResumes(user.primaryEmailAddress.emailAddress);
      setResumeList(response.data || []);
    } catch (error) {
      console.error("Error fetching resumes:", error);
    }
  };

  return (
    <div className="p-10 md:px-20 lg:px-32">
      <h2 className="font-bold text-3xl">My Resumes</h2>
      <p>Start creating or edit your resumes.</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-10">
        <AddResume />
        {resumeList.length > 0 ? (
          resumeList.map((resume, index) => (
            <ResumeCardItem key={index} resume={resume} refreshData={getResumesList} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No resumes found.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
