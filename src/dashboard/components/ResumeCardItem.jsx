import { Contact2Icon, Loader2Icon, MoreVertical, Edit3, Eye, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import GlobalApi from "../../../service/GlobalApi";
import { toast } from "sonner";

function ResumeCardItem({ resume, refreshData }) {
  const navigation = useNavigate();
  const [openAlert, setOpenAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Ensure resume object exists before rendering
  if (!resume) return null;

  const onDelete = async () => {
    setLoading(true);

    try {
      await GlobalApi.DeleteResumeById(resume.resumeid);
      toast("✅ تم حذف السيرة الذاتية بنجاح!");
      refreshData(); // ✅ تحديث البيانات دون الانتقال لأي صفحة
    } catch (error) {
      console.error("❌ حدث خطأ أثناء الحذف:", error);
      toast("❌ حدث خطأ أثناء الحذف");
    } finally {
      setLoading(false);
      setOpenAlert(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#50bbe9] to-[#002b65] rounded-2xl shadow-lg w-[250px] h-[300px] p-5 flex flex-col items-center justify-between">
      {/* ✅ الأيقونة داخل دائرة شفافة */}
      <div className="bg-white bg-opacity-20 rounded-full p-4 mt-2">
        <Contact2Icon className="text-white" size={40} />
      </div>

      {/* ✅ محتوى الكارد */}
      <div className="text-center text-white mt-4">
        <h2 className="text-lg font-bold mb-2">{resume?.title || "سيرة ذاتية بدون عنوان"}</h2>
        
      </div>

      {/* ✅ أزرار تعديل - عرض - حذف */}
      <div className="flex justify-between w-full gap-2 mt-3">
        {/* زر التعديل */}
        <button
          onClick={() => navigation(`/dashboard/resume/${resume.resumeid}/edit`)}
          className="flex-1 bg-[#50bbe9] hover:bg-[#84d2f4] text-white font-medium rounded-lg py-1 transition duration-300 flex items-center justify-center gap-1"
        >
          <Edit3 size={14} /> تعديل
        </button>

        {/* زر العرض */}
        <button
          onClick={() => navigation(`/my-resume/${resume.resumeid}/view`)}
          className="flex-1 bg-[#50bbe9] hover:bg-[#84d2f4] text-white font-medium rounded-lg py-1 transition duration-300 flex items-center justify-center gap-1"
        >
          <Eye size={14} /> عرض
        </button>

        {/* زر الحذف */}
        <button
          onClick={() => setOpenAlert(true)}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg py-1 transition duration-300 flex items-center justify-center gap-1"
        >
          <Trash2 size={14} /> حذف
        </button>
      </div>

      {/* ✅ نافذة تأكيد الحذف */}
      <AlertDialog open={openAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              لا يمكن التراجع عن هذا الإجراء. سيتم حذف السيرة الذاتية نهائيًا.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenAlert(false)}>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} disabled={loading}>
              {loading ? <Loader2Icon className="animate-spin" /> : "حذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ResumeCardItem;
