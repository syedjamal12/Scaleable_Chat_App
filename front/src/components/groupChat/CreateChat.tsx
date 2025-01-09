"use client";

import React, { use, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createChatSchema,
  createChatSchemaType,
} from "@/validations/groupChatValidation";
import { Input } from "../ui/input";
import { CustomUser } from "@/app/api/auth/[...nextauth]/options";
import { toast } from "sonner";
import axios from "axios";
import { GROUP_CHAT_URL } from "@/lib/apiEndPoints";
import { clearCache } from "@/actions/common";


const CreateChat = ({user}:{user:CustomUser | undefined}) => {

    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<createChatSchemaType>({
        resolver: zodResolver(createChatSchema),
      });

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const onSubmit = async (payload: createChatSchemaType) => {
    try{
      setLoading(true)

   const {data} =   await axios.post(GROUP_CHAT_URL,payload, {
        headers:{
          authorization:user?.token
        }
      })
      if (data?.message) {
        setOpen(false);
        toast.success(data?.message);
        clearCache("dashboard");
      }
      setLoading(false);

    }catch(error) {
      setLoading(false)
      toast.error("something wrong")
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Group</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Your new Chat</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-4">
            <Input placeholder="Enter chat title" {...register("title")} />
            <span className="text-red-400">{errors.title?.message}</span>
          </div>
          <div className="mt-4">
            <Input placeholder="Enter passcode" {...register("passcode")} />
            <span className="text-red-400">{errors.passcode?.message}</span>
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
};

export default CreateChat;
