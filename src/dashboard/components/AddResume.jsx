import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/clerk-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, PlusSquare } from 'lucide-react';
import GlobalApi from '../../../service/GlobalApi';

function AddResume({ refreshData }) {  // ✅ Ensure refreshData() updates the resume list
    const [openDialog, setOpenDialog] = useState(false);
    const [resumeTitle, setResumeTitle] = useState("");
    const { user } = useUser();
    const navigation = useNavigate();
    const [loading, setLoading] = useState(false);

    const onCreate = async () => {
        setLoading(true);
        const uuid = uuidv4();
        const data = {
            title: resumeTitle,
            resumeid: uuid,
            useremail: user?.primaryEmailAddress?.emailAddress,
            username: user?.fullName
        };

        try {
            const response = await GlobalApi.CreateNewResume(data);
            if (response) {
                console.log('✅ Resume created successfully:', response);
                
                // ✅ Refresh resume list immediately
                refreshData();  

                // ✅ Reset input field
                setResumeTitle("");

                // ✅ Close dialog after success
                setOpenDialog(false);

                // ✅ Navigate to edit page
                navigation(`/dashboard/resume/${uuid}/edit`);
            }
        } catch (error) {
            console.error("❌ Error creating new resume:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className='p-14 py-24 border items-center flex justify-center bg-secondary rounded-lg h-[280px] hover:scale-105 transition-all hover:shadow-md cursor-pointer border-dashed'
                onClick={() => setOpenDialog(true)}>
                <PlusSquare />
            </div>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New CV</DialogTitle>
                        <DialogDescription>
                            <p>Add a title for your new resume</p>
                            <Input
                                className="my-2"
                                placeholder="Ex. Full Stack Resume"
                                value={resumeTitle}
                                onChange={(e) => setResumeTitle(e.target.value)}
                            />
                        </DialogDescription>
                        <div className='flex justify-end gap-5'>
                            <Button onClick={() => setOpenDialog(false)} variant="ghost">Cancel</Button>
                            <Button disabled={!resumeTitle || loading} onClick={onCreate}>
                                {loading ? <Loader2 className='animate-spin' /> : 'Create'}
                            </Button>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default AddResume;
