import React, { useState } from "react";
import { IoCallOutline } from "react-icons/io5";
import { GoDeviceCameraVideo } from "react-icons/go";

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

  return (
    <nav className="w-full flex justify-between items-center px-6 py-2 border-b">
      <div className="flex space-x-4 items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-600 text-transparent bg-clip-text">
          {chatGroup.title}
        </h1>
      </div>

      <div style={{ display: "flex", gap: "30px", marginRight: "-61px" }}>
        {/* Audio Call Button */}
        <IoCallOutline
          style={{ fontSize: "24px", cursor: "pointer" }}
          onClick={() => handleCallClick(false)}
        />

        {/* Video Call Button */}
        <GoDeviceCameraVideo
          style={{ fontSize: "24px", cursor: "pointer" }}
          onClick={() => handleCallClick(true)}
        />
      </div>

      <p>{user?.name}</p>
    </nav>
  );
}
