"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { CHAT_GROUP_USERS_CREATE } from "@/lib/apiEndPoints";
import { clearCache } from "@/actions/common";

export default function ChatUserDialog({
  open,
  setOpen,
  group,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  group: GroupChatType;
}) {
  const params = useParams();
  console.log("grouupp checkkk",group)
  console.log("idddddd",params["id"])
    const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    name: "",
    passcode: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    const data = localStorage.getItem(params["id"] as string);
    if (data) {
      const jsonData = JSON.parse(data);
      if (jsonData?.name && jsonData?.group_id) {
        setOpen(false);
      }
    }
  }, []);

  // Handle image selection
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setSelectedImage(file);
      }
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true)
    const localData = localStorage.getItem(params["id"] as string);
    if (!localData) {
      try {

        const formData = new FormData();

      // Append text fields
      formData.append("name", state.name);
      formData.append("id", params["id"] as string);

      // Append image file
      if (selectedImage) {
        formData.append("profile_image", selectedImage);
      }

        if (group.passcode != state.passcode) {
          setLoading(false)
            return toast.error("Please enter correct passcode!");
          }
        const { data } = await axios.post(CHAT_GROUP_USERS_CREATE,formData,);
        clearCache("chat");
        
       localStorage.setItem(
          params["id"] as string,
          JSON.stringify(data?.data)
        );
        const datacheck = localStorage.getItem(params["id"] as string);
console.log("done local",datacheck)

        setOpen(false);
        setLoading(false)
        toast.success(`welcome in ${group.title} group`)
      } catch (error) {
        setLoading(false)
        toast.error("Something went wrong.please try again!");
      }
    }
    if (group.passcode != state.passcode) {
      setLoading(false)
      toast.error("Please enter correct passcode!");
      
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Name and Passcode</DialogTitle>
          <DialogDescription>
            Add your name and passcode to join in room
          </DialogDescription>
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
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="mt-2">
            <Input
              placeholder="Enter your name"
              value={state.name}
              onChange={(e) => setState({ ...state, name: e.target.value })}
            />
          </div>
          <div className="mt-2">
            <Input
              placeholder="Enter your passcode"
              value={state.passcode}
              onChange={(e) => setState({ ...state, passcode: e.target.value })}
            />
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
          <div className="mt-2">
            <Button className="w-full" disabled={loading}> {loading ? "Processing..." : "Submit"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}