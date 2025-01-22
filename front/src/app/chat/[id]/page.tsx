import React from "react";
import ChatBase from "@/components/chat/ChatBase";
import { fetchChatSingleGroup, groupChatUsers } from "@/fetch/groupFetch";
import { notFound } from "next/navigation";
import { fetchChatMsg } from "@/fetch/chatsFetch";

  const page = async({ params }: { params: { id: string } }) => {
  console.log("The group id", params?.id);
  if(params.id.length !== 36)
  {
    return notFound()
  }
  const group:GroupChatType | null = await fetchChatSingleGroup(params?.id)
  if (group==null)
  {
    return notFound()
  }
  const users:Array<GroupChatUserType> | []= await groupChatUsers(params?.id);
  console.log("dataaa fetcheddd user",users)

  const chats:Array<MessageType> | []= await fetchChatMsg(params?.id);
  console.log("chats dataaa coming",chats)

  console.log("single dataaa",fetch)
  return (
    <div>
      <ChatBase group={group} users={users} oldMessages={chats}/>
    </div>
  );
};

export default page;
