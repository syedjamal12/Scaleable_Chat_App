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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const onSubmit = async (payload: createChatSchemaType) => {
    try{
      setLoading(true)

      const formData = new FormData();

      // Append text fields
      formData.append("title", payload.title);
      formData.append("passcode", payload.passcode);

      // Append image file
      if (selectedImage) {
        formData.append("profile_image", selectedImage);
      }

   const {data} =   await axios.post(GROUP_CHAT_URL,formData, {
        headers:{
          authorization:user?.token
        }
      })
      if (data?.message) {
        setOpen(false);
        toast.success(data?.message);
        clearCache("dashboard");
        setSelectedImage(null);
        
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
        {/* Preview Selected Image */}
 {selectedImage && (
            <div className="mt-4" style={{display:"flex", justifyContent:"center"}}>
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-md border"
                style={{borderRadius:"50%"}}
              />
            </div>
          )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-4">
            <Input placeholder="Enter chat title" {...register("title")} />
            <span className="text-red-400">{errors.title?.message}</span>
          </div>
          <div className="mt-4">
            <Input placeholder="Enter passcode" {...register("passcode")} />
            <span className="text-red-400">{errors.passcode?.message}</span>
          </div>

          {/* Image Upload Field */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Upload Group Profile Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2"
            />
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
