"use client";
import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   createChatSchema,
//   createChatSchemaType,
// } from "@/validations/chatSchema";
import { CustomUser } from "@/app/api/auth/[...nextauth]/options";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { clearCache } from "@/actions/common";
import { GROUP_UPDATE } from "@/lib/apiEndPoints";

export default function EditGroupChat({
  user,
  group,
  open,
  setOpen,
}: {
  user: CustomUser;
  group: GroupChatType;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [loading, setLoading] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     formState: { errors },
//   } = useForm<createChatSchemaType>({
//     resolver: zodResolver(createChatSchema),
//   });

//   useEffect(() => {
//     setValue("title", group.title);
//     setValue("passcode", group.passcode);
//   }, [group]);
const [title, setTitle] = useState(group.title); // Single state for title
  const [passcode, setPasscode] = useState(group.passcode); // Single state for passcode
 async function handleSubmit(e:React.FormEvent){
     try{
       setLoading(true)
       const {data} = await axios.put(`${GROUP_UPDATE}/${group?.id}`,{title,passcode},
        { headers: { Authorization: user?.token },
        withCredentials: true,}
       )
       if(data?.message){
        clearCache("dashboard")
       toast.success(data?.message)
       }
       setOpen(false)
     }catch(error){
       console.log("something error",error)
     }
     setLoading(false);
 }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Update group chat</DialogTitle>
        </DialogHeader>
        <form  onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e); // Call the async function here
        }}>
          <div className="mt-4">
            <Input placeholder={group.title} value={title} onChange={(e)=>setTitle(e.target.value)}
            />
            {/* <span className="text-red-400">{errors.title?.message}</span> */}
          </div>
          <div className="mt-4">
            <Input placeholder={group.passcode}  value={passcode} onChange={(e)=>setPasscode(e.target.value)}/>
            {/* <span className="text-red-400">{errors.passcode?.message}</span> */}
          </div>
          <div className="mt-4">
            <Button className="w-full" disabled={loading}>
              {loading ? "Processing.." : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}