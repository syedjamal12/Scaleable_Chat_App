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
 useEffect(()=>{
    const data = localStorage.getItem(group.id)
    if(data){
      const Pdata = JSON.parse(data)
      setChatUser(Pdata);
    }
 },[group.id])

  const[open,setOpen]=useState(true)
  return (
    <div className="flex w-100%">
      <ChatSidebar users={users}/>
      <div className="w-full  bg-gradient-to-b from-gray-50 to-white">
      {
        open ? <ChatUserDialog open={open} setOpen={setOpen} group={group}/> : <ChatNav chatGroup={group} users={users}/>
      }
      
<Chats group={group} chatUser={chatUser} oldMessages={oldMessages}/>
      </div>
    </div>
  );
};

export default ChatBase;
