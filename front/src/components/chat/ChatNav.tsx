import React, { useState } from "react";
import { IoCallOutline } from "react-icons/io5";
import { GoDeviceCameraVideo } from "react-icons/go";
import MobileChatSidebar from "./MobileChatSidebar";

const CallHandler = React.lazy(() => import("./CallHandler")); // Lazy load CallHandler

export default function ChatNav({
  chatGroup,
  users,
  user,
}: {
  chatGroup: GroupChatType;
  users: Array<GroupChatUserType> | [];
  user?: GroupChatUserType;
}) {
  const [callUser, setCallUser] = useState<((userId: string, isVideo: boolean) => void) | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callType, setCallType] = useState<"audio" | "video" | null>(null); // Track call type

  const handleCallClick = (isVideo: boolean) => {
    setCallType(isVideo ? "video" : "audio");
    setIsCallActive(true);
    if (callUser) callUser(chatGroup.id, isVideo);
  };
console.log("chat group check",chatGroup)
  return (
    <nav className="w-full flex justify-between items-center px-6 py-2 border-b">
      <div className="flex space-x-4 md:space-x-0 items-center">
      <div className="md:hidden">
          <MobileChatSidebar users={users} />
        </div>
      <img src={chatGroup.profile_image} className="w-9 h-9 rounded-full" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-600 text-transparent bg-clip-text">
          {chatGroup.title}
        </h1>
      </div>


      <p>{user?.name}</p>
    </nav>
  );
}
