import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
  
import axios from "axios";
import { GROUP_DELETE, MSG_DELETE } from "@/lib/apiEndPoints";
import { clearCache } from "@/actions/common";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { group } from "console";
import { getSocket } from "@/lib/socket.config";
const socket = getSocket();

const DeleteMsgChat = ({
  open,
  setOpen,
  EditMessage,
  group,
  setMessages
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  EditMessage: any;
  group: GroupChatType;
  setMessages:any
}) => {
    useEffect(() => {
      socket.auth = { room: group.id };
      socket.connect();
      socket.emit("joinRoom", group.id);
      console.log("Joining room:", group.id);
  
      return () => {
        socket.emit("leaveRoom", group.id);
      };
    }, [group.id]);
    console.log("delelle")
  const [title, setTitle] = useState(EditMessage.message); // Single state for title

    const[loading,setLoading]=useState(false)

    useEffect(() => {
        const handleEditMessage = (updatedMessage: any) => {
          console.log("msg editing");
          console.log("Edit message event received:", updatedMessage);
      
          setMessages((prevMessages:any) =>
            prevMessages.map((msg:any) =>
              msg.id === updatedMessage.id ? { ...msg, message: updatedMessage.message } : msg
            )
          );
        };
      
        const handleDeleteMessage = (deletedMessage: any) => {
          console.log("msg deleting");
          console.log("Delete message event received:", deletedMessage);
      
          setMessages((prevMessages:any) =>
            prevMessages.filter((msg:any) => msg.id !== deletedMessage.id) // Remove message by ID
          );
        };
      
        socket.on("editMessage", handleEditMessage);
        socket.on("deleteMessage", handleDeleteMessage);
      
        return () => {
          socket.off("editMessage", handleEditMessage);
          socket.off("deleteMessage", handleDeleteMessage);
        };
      }, []);

    // console.log("deletee",`${GROUP_DELETE}/${groupId}`);
    async function handleSubmit(event:any) {
      event.preventDefault();  // Prevent form submission refresh
  
      try {
          setLoading(true);
          const { data } = await axios.delete(`${MSG_DELETE}/${EditMessage.id}`);
  
          if (data?.message) {
              console.log("Emitting deleteMessage event:", { id: EditMessage.id });
  
              // ✅ Emit the event properly
              socket.emit("deleteMessage", { id: EditMessage.id });
  
              setOpen(false);  // Close the modal
          }
  
      } catch (error) {
          console.log("Something went wrong while deleting:", error);
      } finally {
          setLoading(false);  // Ensure loading state is updated
      }
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent onInteractOutside={(e) => e.preventDefault()}>
      <DialogHeader>
        <DialogTitle>This message will delete from everyone.</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="mt-4">
          
        </div>

        <div className="mt-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Processing..." : "Delete"}
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
  );
};

export default DeleteMsgChat;
