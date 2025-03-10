import { getSocket } from "@/lib/socket.config";
import React, { useEffect, useState } from "react";

export default function ChatSidebar({
  users,
  group
}: {
  users: Array<GroupChatUserType> | [];
  group: GroupChatType;
}) {
  const [ChatUser, setChatUser] = useState<GroupChatUserType | null>(null);
  const [userStatus, setUserStatus] = useState<{ [key: string]: { status: string; lastSeen?: string } }>({});
  const socket = getSocket(String(ChatUser?.id)); 
  
  useEffect(() => {
    const data = localStorage.getItem(group.id);
    if (data) {
      const parsedData = JSON.parse(data);
      setChatUser(parsedData);
    }
  }, [group.id]);

  useEffect(() => {
    if (!ChatUser) return; // Prevent running if ChatUser is not set
  
    console.log("check user in sidebar", String(ChatUser?.id));
    socket.auth = { room: group.id, userId: ChatUser.id };
    socket.connect();
    socket.emit("joinRoom", group.id);
    console.log("Joining room:", group.id);
  
    return () => {
      socket.emit("leaveRoom", group.id);
      socket.disconnect();
    };
  }, [ChatUser, group.id]); // ✅ Dependency includes ChatUser
  
  // ✅ Listen for user status updates
useEffect(() => {
  if (!ChatUser) return; // Prevent running if ChatUser is not set

  socket.on("updateUserStatus", (data) => {
    setUserStatus((prev) => ({ ...prev, [data.userId]: data }));
  });

  return () => {
    socket.off("updateUserStatus"); // Cleanup listener
  };
}, [ChatUser]); // ✅ Runs when ChatUser is set


   console.log("sidebaaaar user",ChatUser)
   console.log("check online",userStatus)
  return (
    <div className=" md:block h-screen overflow-y-scroll  bg-muted px-2 w-40%">
      <h1 className="text-2xl font-extrabold py-4 ">Users</h1>
      {users.length > 0 &&
        users.map((item, index) => (
          <div key={index} className="bg-white rounded-md p-2 mt-2">
            <div style={{display:"flex", flexDirection:"row", alignItems:"center", gap:"5px"}}>
              <img src={item.profile_image} style={{width:"50px", height:"50px", borderRadius:"50%"}}/>
              <p className="font-bold"> {item.name}</p>
              <p style={{ color: userStatus[item.id]?.status === "online" ? "green" : "gray" }}>
                  {userStatus[item.id]?.status === "online"
                    ? "🟢 Online"
                    : `🔴 Last seen: ${new Date(userStatus[item.id]?.lastSeen || "").toLocaleTimeString()}`}
                </p>
            </div>
            
            {/* <p>
              Joined : <span>{new Date(item.created_at).toDateString()}</span>
            </p> */}
          </div>
        ))}
    </div>
  );
}