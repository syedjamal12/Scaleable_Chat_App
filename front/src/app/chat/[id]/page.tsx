import React from "react";
import ChatBase from "@/components/chat/ChatBase";

const page = ({ params }: { params: { id: string } }) => {
  // console.log("The group id", params?.id);
  return (
    <div>
      <h1>Hello I am chat</h1>
      <ChatBase/>
    </div>
  );
};

export default page;
