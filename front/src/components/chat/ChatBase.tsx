"use client";

import { getSocket } from "@/lib/socket.config";
import React, { useEffect, useMemo, useState } from "react";
import { v4 as uuid4 } from "uuid";
import { Button } from "../ui/button";
import { groupChatUsers } from "@/fetch/groupFetch";
import ChatSidebar from "./ChatSidebar";
import ChatNav from "./ChatNav";
import ChatUserDialog from "./ChatUserDialog";
import { json } from "stream/consumers";
import Chats from "./Chats";
import { notFound } from "next/navigation";

const ChatBase = ({
  group,
  users,
  oldMessages
}: {
  group: GroupChatType;
  users: Array<GroupChatUserType> | [];
  oldMessages: Array<MessageType> | []
}) => {
 const[chatUser, setChatUser]=useState<GroupChatUserType>()
 const [refreshKey, setRefreshKey] = useState(0);
 const[open,setOpen]=useState(true)

 const handleCloseDialog = () => {
  setOpen(false);
  setRefreshKey(prev => prev + 1); // force refresh
};



 useEffect(()=>{
    const data = localStorage.getItem(group.id)
    if(data){
      const Pdata = JSON.parse(data)
      setChatUser(Pdata);
    }
 },[group.id,open])

 


console.log("chat yha check",chatUser)

  
  return (
    <div className="flex w-100%">
      <ChatSidebar users={users} group={group} ChatUser={chatUser}/>
      <div className="w-full  bg-gradient-to-b from-gray-50 to-white">
      {
        open ? <ChatUserDialog open={open} setOpen={handleCloseDialog} group={group}/> : <ChatNav chatGroup={group} users={users}/>
      }
      
<Chats group={group} chatUser={chatUser} oldMessages={oldMessages}/>
      </div>
    </div>
  );
};

export default ChatBase;
