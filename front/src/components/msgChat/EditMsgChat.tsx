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
import { GROUP_UPDATE, MSG_UPDATE } from "@/lib/apiEndPoints";
import { getSocket } from "@/lib/socket.config";
import { useMemo } from "react";
const socket = getSocket();
export default function EditMsgChat({
  EditMessage,
  open,
  setOpen,
  group,
}: {
  EditMessage: any;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  group: GroupChatType;
}) {
  console.log("msgchatttttt", EditMessage);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(EditMessage.message); // Single state for title
  const [passcode, setPasscode] = useState(EditMessage.id); // Single state for passcode
  console.log("edit msg id in edit", group.id);

  useEffect(() => {
    socket.emit("joinRoom", group.id);
    console.log("Joining room:", group.id);
  }, [group.id]);

  useEffect(() => {
    socket.auth = { room: group.id };
    socket.connect();
    socket.emit("joinRoom", group.id);
    console.log("Joining room:", group.id);

    return () => {
      socket.emit("leaveRoom", group.id);
    };
  }, [group.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      setLoading(true);

      const { data } = await axios.put(`${MSG_UPDATE}/${EditMessage.id}`, {
        message: title, // Send only the updated message
      });

      console.log("msg update data", data);

      if (data?.message) {
        console.log("Emitting editMessage event:", { id: EditMessage.id, message: title });

        // ✅ Emit the event properly
        socket.emit("editMessage", { id: EditMessage.id, message: title });

        clearCache("dashboard");
        // toast.success(data?.message);
      }

      setOpen(false);
    } catch (error) {
      console.error("Something went wrong", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Update Message</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <Input
              placeholder="Enter new message"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="mt-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Processing..." : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
