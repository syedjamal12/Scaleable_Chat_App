"use client";

import { getSocket } from "@/lib/socket.config";
import React, { useEffect, useMemo, useState } from "react";
import { v4 as uuid4 } from "uuid";
import { Button } from "../ui/button";
import { groupChatUsers } from "@/fetch/groupFetch";
import ChatSidebar from "./ChatSidebar";
import ChatNav from "./ChatNav";
import ChatUserDialog from "./ChatUserDialog";

const ChatBase = ({
  group,
  users,
}: {
  group: GroupChatType;
  users: Array<GroupChatUserType> | [];
}) => {
  // let socket = useMemo(()=>{
  //     const socket = getSocket()
  //     socket.auth = {
  //       room : groupId
  //     }
  //    return socket.connect();
  // },[])

  // useEffect(()=>{
  //     socket.on("message",(data:any)=>{
  //         console.log("socket message is",data)
  //     })
  //     return ()=> { socket.close() };
  // },[])

  // function handleClick (){
  //     socket.emit("message",{name:"Hasnat",id:uuid4()})
  // }

  const[open,setOpen]=useState(true)
  return (
    <div className="flex">
      <ChatSidebar users={users}/>
      <div className="w-full md:4/5 bg-gradient-to-b from-gray-50 to-white">
      {
        open ? <ChatUserDialog open={open} setOpen={setOpen} group={group}/> : <ChatNav chatGroup={group} users={users}/>
      }
      

      </div>
    </div>
  );
};

export default ChatBase;
