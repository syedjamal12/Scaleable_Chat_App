import React from "react";
import ChatBase from "@/components/chat/ChatBase";
import { fetchChatSingleGroup, groupChatUsers } from "@/fetch/groupFetch";
import { notFound } from "next/navigation";

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
  
  console.log("single dataaa",fetch)
  return (
    <div>
      <h1>Hello I am chat</h1>
      <ChatBase group={group} users={users}/>
    </div>
  );
};

export default page;
