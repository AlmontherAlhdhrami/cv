import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { LoaderCircle } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GlobalApi from "./../../../../../service/GlobalApi";
import { toast } from "sonner";

function PersonalDetail({ enabledNext }) {
    const { resumeId } = useParams();
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        job_title: "",
        address: "",
        phone: "",
        email: "",
    });

    const [loading, setLoading] = useState(false);

    // ✅ تحميل البيانات الشخصية عند فتح الصفحة
    useEffect(() => {
        if (resumeId) {
            GlobalApi.GetPersonalDetails(resumeId)
                .then((data) => {
                    if (data) {
                        setFormData(data);

                        // ✅ تحديث resumeInfo.personalDetails لضمان ظهورها في المعاينة
                        setResumeInfo((prev) => ({
                            ...prev,
                            personalDetails: data, 
                        }));
                    }
                })
                .catch((error) => {
                    console.error("❌ Error fetching personal details:", error);
                });
        }
    }, [resumeId, setResumeInfo]);

    // ✅ تحديث البيانات عند إدخال المستخدم
    const handleInputChange = (e) => {
        enabledNext(false);
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // ✅ تحديث `resumeInfo.personalDetails` فورًا
        setResumeInfo((prev) => ({
            ...prev,
            personalDetails: {
                ...prev.personalDetails,
                [name]: value,
            },
        }));
    };

    // ✅ حفظ البيانات في قاعدة البيانات
    const onSave = async (e) => {
        e.preventDefault();
        if (!resumeId) {
            toast.error("❌ Resume ID is missing.");
            return;
        }

        setLoading(true);

        try {
            await GlobalApi.SavePersonalDetails(resumeId, formData);
            enabledNext(true);
            toast.success("✅ Personal details updated successfully!");
        } catch (error) {
            console.error("❌ Error updating personal details:", error);
            toast.error("❌ Failed to update details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
            <h2 className="font-bold text-lg">Personal Details</h2>
            <p>Get started with the basic information.</p>

            <form onSubmit={onSave}>
                <div className="grid grid-cols-2 mt-5 gap-3">
                    <div>
                        <label className="text-sm">First Name</label>
                        <Input
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm">Last Name</label>
                        <Input
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="text-sm">Job Title</label>
                        <Input
                            name="job_title"
                            value={formData.job_title}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="text-sm">Address</label>
                        <Input
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm">Phone</label>
                        <Input
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm">Email</label>
                        <Input
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </div>
                <div className="mt-3 flex justify-end">
                    <Button type="submit" disabled={loading}>
                        {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default PersonalDetail;
