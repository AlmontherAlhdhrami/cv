import { createClient } from '@supabase/supabase-js';

// ✅ Supabase Configuration
const supabaseUrl = 'https://uhlpflsohoygitixgmny.supabase.co';
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVobHBmbHNvaG95Z2l0aXhnbW55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyNTc0MjAsImV4cCI6MjA1NDgzMzQyMH0.aFvtPP5N58xahdWshsd93qROcQFNRyv0UCk2E4Fi11Q";

if (!supabaseAnonKey) {
  console.error("❌ Missing Supabase Key! Check your .env file.");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

//
// ────────────────────────────────────────────────────────────────────
// ✅ RESUME FUNCTIONS
// ────────────────────────────────────────────────────────────────────
//

// ✅ Create a new resume
const CreateNewResume = async (data) => {
  try {
    const { data: response, error } = await supabase
      .from('resumes')
      .insert([data])
      .select()
      .single(); // Return only the inserted row

    if (error) throw error;
    console.log("✅ Resume Created:", response);
    return response;
  } catch (error) {
    console.error("❌ Error creating resume:", error);
    return null;
  }
};

// ✅ Fetch all resumes for a specific user
const GetUserResumes = async (userEmail) => {
  try {
    console.log("🔍 Fetching resumes for:", userEmail);
    const { data: response, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('useremail', userEmail);

    if (error) throw error;
    console.log("✅ Fetched Resumes:", response);
    return response;
  } catch (error) {
    console.error("❌ Error fetching resumes:", error);
    return [];
  }
};

// ✅ Fetch a resume by ID (Including Relations)
const GetResumeById = async (resumeId) => {
  try {
    if (!resumeId) {
      console.error("❌ Error: Missing `resumeId` parameter.");
      return null;
    }

    console.log(`🔍 Fetching resume with ID: ${resumeId}`);

    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('resumeid', resumeId)
      .maybeSingle(); // ✅ Use `.maybeSingle()` to avoid multiple-row errors

    if (error) throw error;
    console.log("✅ Resume Fetched:", data);
    return data;
  } catch (error) {
    console.error("❌ Error fetching resume:", error);
    return null;
  }
};

// ✅ Update resume details
const UpdateResumeDetail = async (resumeId, newData) => {
  try {
    const { data: response, error } = await supabase
      .from('resumes')
      .update(newData)
      .eq('resumeid', resumeId)
      .select();

    if (error) throw error;
    console.log("✅ Resume Updated:", response);
    return response;
  } catch (error) {
    console.error("❌ Error updating resume:", error);
    return null;
  }
};

// ✅ Delete a resume by ID
const DeleteResumeById = async (resumeId) => {
  try {
    const { data: response, error } = await supabase
      .from('resumes')
      .delete()
      .eq('resumeid', resumeId);

    if (error) throw error;
    console.log("✅ Resume Deleted:", response);
    return response;
  } catch (error) {
    console.error("❌ Error deleting resume:", error);
    return null;
  }
};

//
// ────────────────────────────────────────────────────────────────────
// ✅ PERSONAL DETAILS FUNCTIONS
// ────────────────────────────────────────────────────────────────────
//

const SavePersonalDetails = async (resumeId, details) => {
  try {
    if (!resumeId) {
      console.error("❌ Error: Resume ID is missing.");
      return null;
    }

    // Check if there's an existing record
    const { data: existingData, error: fetchError } = await supabase
      .from('personal_details')
      .select('id')
      .eq('resumeid', resumeId)
      .limit(1)
      .maybeSingle();

    if (fetchError) throw fetchError;

    // Insert or update
    const { data, error } = await supabase
      .from('personal_details')
      .upsert({
        id: existingData?.id || undefined,
        resumeid: resumeId,
        first_name: details.first_name,
        last_name: details.last_name,
        job_title: details.job_title,
        address: details.address,
        phone: details.phone,
        email: details.email,
      })
      .select()
      .single();

    if (error) throw error;
    console.log("✅ Personal Details Updated:", data);
    return data;
  } catch (error) {
    console.error("❌ Error saving personal details:", error);
    return null;
  }
};

// ✅ Fetch Personal Details by Resume ID
const GetPersonalDetails = async (resumeId) => {
  try {
    if (!resumeId) {
      console.error("❌ Error: Resume ID is missing for personal details.");
      return null;
    }

    const { data, error } = await supabase
      .from("personal_details")
      .select("*") // Fetch all columns
      .eq("resumeid", resumeId)
      .maybeSingle();

    if (error) throw error;
    console.log("✅ Personal details fetched:", data);
    return data;
  } catch (error) {
    console.error("❌ Error fetching personal details:", error);
    return null;
  }
};


//
// ────────────────────────────────────────────────────────────────────
// ✅ EDUCATION FUNCTIONS
// ────────────────────────────────────────────────────────────────────
//

const SaveEducationDetails = async (resumeId, educationList) => {
  try {
    if (!resumeId) {
      console.error("❌ Error: Resume ID is missing.");
      return null;
    }

    // Delete old records
    await supabase.from('education').delete().eq('resumeid', resumeId);

    // Insert new
    const { data, error } = await supabase
      .from('education')
      .insert(educationList.map((edu) => ({
        resumeid: resumeId,
        university_name: edu.university_name,
        degree: edu.degree,
        major: edu.major,
        start_date: edu.start_date,
        end_date: edu.end_date,
        description: edu.description,
      })));

    if (error) throw error;
    console.log("✅ Education details updated:", data);
    return data;
  } catch (error) {
    console.error("❌ Error updating education details:", error);
    return null;
  }
};

const UpdateEducationDetails = async (resumeid, educationList) => {
  if (!resumeid) {
    console.error("❌ Error: Resume ID is missing.");
    return null;
  }

  try {
    await supabase.from('education').delete().eq('resumeid', resumeid);

    
    const { data, error } = await supabase
      .from('education')
      .insert(educationList.map((edu) => ({
        resumeid,
        university_name: edu.university_name,
        degree: edu.degree,
        major: edu.major,
        start_date: edu.start_date,
        end_date: edu.end_date,
        description: edu.description,
      })));

    if (error) throw error;
    console.log("✅ Education details updated:", data);
    return data;
  } catch (error) {
    console.error("❌ Error updating education details:", error);
    return null;
  }
};

const GetEducationDetails = async (resumeid) => {
  try {
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .eq('resumeid', resumeid);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("❌ Error fetching education details:", error);
    return [];
  }
};

//
// ────────────────────────────────────────────────────────────────────
// ✅ EXPERIENCE FUNCTIONS
// ────────────────────────────────────────────────────────────────────
//

// ✅ Update Experience Details
const UpdateExperienceDetails = async (resumeid, experienceList) => {
  if (!resumeid) {
    console.error("❌ Error: Resume ID is missing.");
    return null;
  }
  try {
    // Remove old experience rows
    await supabase.from("experiences").delete().eq("resumeid", resumeid);

    // Insert new experiences
    const { data, error } = await supabase
      .from("experiences")
      .insert(
        experienceList.map((exp) => ({
          resumeid: resumeid,
          title: exp.title,
          company: exp.company,
          city: exp.city,
          state: exp.state,
          start_date: exp.start_date,
          end_date: exp.end_date,
          currently_working: exp.currently_working,
          // Ensure we store a string in 'description'
          description: typeof exp.description === "string" ? exp.description : "",
        }))
      );

    if (error) throw error;
    console.log("✅ Experience details updated:", data);
    return data;
  } catch (error) {
    console.error("❌ Error updating experience details:", error);
    return null;
  }
};

// ✅ Fetch Experience Details
const GetExperienceDetails = async (resumeid) => {
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .eq('resumeid', resumeid);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("❌ Error fetching experience details:", error);
    return [];
  }
};

//
// ────────────────────────────────────────────────────────────────────
// ✅ SKILLS FUNCTIONS
// ────────────────────────────────────────────────────────────────────
//

const UpdateSkillsDetails = async (resumeId, skillsList) => {
  if (!resumeId) {
    console.error("❌ Error: Resume ID is missing.");
    return null;
  }

  try {
    await supabase.from('skills').delete().eq('resumeid', resumeId);

    const { data, error } = await supabase
      .from('skills')
      .insert(
        skillsList.map((skill) => ({
          resumeid: resumeId,
          name: skill.name,
          rating: skill.rating,
        }))
      );

    if (error) throw error;
    console.log("✅ Skills updated:", data);
    return data;
  } catch (error) {
    console.error("❌ Error updating skills:", error);
    return null;
  }
};

const GetSkillsByResumeId = async (resumeId) => {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('resumeid', resumeId);

    if (error) throw error;
    console.log("✅ Fetched Skills:", data);
    return data;
  } catch (error) {
    console.error("❌ Error fetching skills:", error);
    return [];
  }
};

//
// ────────────────────────────────────────────────────────────────────
// ✅ SUMMARY FUNCTIONS
// ────────────────────────────────────────────────────────────────────
//

const SaveSummary = async (resumeId, summary) => {
  try {
    if (!resumeId) {
      console.error("❌ Error: Resume ID is missing.");
      return null;
    }

    // Delete old summary
    await supabase.from('summary').delete().eq('resumeid', resumeId);

    // Insert new summary
    const { data, error } = await supabase
      .from('summary')
      .insert([{ resumeid: resumeId, summary }])
      .select()
      .single();

    if (error) throw error;
    console.log("✅ Summary updated:", data);
    return data;
  } catch (error) {
    console.error("❌ Error updating summary:", error);
    return null;
  }
};

const GetSummaryByResumeId = async (resumeId) => {
  try {
    const { data, error } = await supabase
      .from('summary')
      .select('summary')
      .eq('resumeid', resumeId)
      .single();

    if (error) throw error;
    console.log("✅ Fetched Summary:", data);
    return data?.summary || "";
  } catch (error) {
    console.error("❌ Error fetching summary:", error);
    return "";
  }
};
///////////
const SaveExperienceDescription = async (resumeId, description) => {
  try {
    if (!resumeId) {
      console.error("❌ Error: Resume ID is missing.");
      return null;
    }

    // Option A: Delete all experience rows for this resumeId
    // then insert a brand-new row with only the description field.
    // This approach matches your summary logic, but it also deletes
    // any existing data for that resumeId in experiences.

    await supabase.from('experiences').delete().eq('resumeid', resumeId);

    const { data, error } = await supabase
      .from('experiences')
      .insert([{ resumeid: resumeId, description }])
      .select()
      .single();

    if (error) throw error;
    console.log("✅ Single experience description saved:", data);
    return data;
  } catch (error) {
    console.error("❌ Error saving experience description:", error);
    return null;
  }
};

// 2) If you want to simply update the row's description
//    without deleting the entire row, you can do this:
const UpdateExperienceDescription = async (resumeId, description) => {
  try {
    if (!resumeId) {
      console.error("❌ Error: Resume ID is missing.");
      return null;
    }

    // Instead of deleting, let's just update the row's 'description'
    // This will not remove other columns (like title, company, etc.)
    const { data, error } = await supabase
      .from('experiences')
      .update({ description })
      .eq('resumeid', resumeId)
      .select()
      .single();

    if (error) throw error;
    console.log("✅ Experience description updated in existing row:", data);
    return data;
  } catch (error) {
    console.error("❌ Error updating experience description:", error);
    return null;
  }
};


const UpdateThemeColor = async (resumeId, color) => {
  try {
    if (!resumeId) {
      console.error("❌ Error: Resume ID is missing.");
      return null;
    }

    const { data, error } = await supabase
      .from("resumes")
      .update({ themecolor: color })
      .eq("resumeid", resumeId)
      .select()
      .single();

    if (error) throw error;
    console.log("✅ Theme color updated:", data);
    return data;
  } catch (error) {
    console.error("❌ Error updating theme color:", error);
    return null;
  }
};

/////////////
//
// ────────────────────────────────────────────────────────────────────
// ✅ EXPORT ALL
// ────────────────────────────────────────────────────────────────────
//

export default {
  // Resume
  CreateNewResume,
  GetUserResumes,
  GetResumeById,
  UpdateResumeDetail,
  DeleteResumeById,

  // Personal Details
  SavePersonalDetails,
  GetPersonalDetails,

  // Education
  SaveEducationDetails,
  GetEducationDetails,
  UpdateEducationDetails,

  // Experience
  UpdateExperienceDetails,
  GetExperienceDetails,

  // Skills
  UpdateSkillsDetails,
  GetSkillsByResumeId,

  // Summary
  SaveSummary,
  GetSummaryByResumeId,
  SaveExperienceDescription,
  UpdateExperienceDescription,
  UpdateThemeColor
};
