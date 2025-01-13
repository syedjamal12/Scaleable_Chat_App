import React, { Dispatch, SetStateAction, useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  
import axios from "axios";
import { GROUP_DELETE } from "@/lib/apiEndPoints";
import { clearCache } from "@/actions/common";
import { toast } from "sonner";

const DeleteChatGroup = ({
  open,
  setOpen,
  groupId,
  token,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  groupId: string;
  token: string;
}) => {
    console.log("Token being sent:", token);

    const[loading,setLoading]=useState(false)
    console.log("deletee",`${GROUP_DELETE}/${groupId}`);
  async function confirmDelete() {
    try {
        setLoading(true)
        const { data } = await axios.delete(`${GROUP_DELETE}/${groupId}`, {
          headers: { Authorization: token },
          withCredentials: true,
        });
        
     if(data?.message){
        clearCache("dashboard")
        toast.success(data?.message)
        setOpen(false)
     }
     setLoading(false)

    } catch (error) {
        setLoading(false)
      console.log("something wrong to delete",error);
    }
  }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
  <AlertDialogTrigger>Open</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
      This action cannot be undone. This will permanently delete your chat
      group and it's conversations.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction disabled={loading} onClick={confirmDelete}>
        {loading? "loading..." : "Continue"}
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

  );
};

export default DeleteChatGroup;
