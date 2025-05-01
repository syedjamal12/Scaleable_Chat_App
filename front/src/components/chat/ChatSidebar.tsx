import { getSocket } from "@/lib/socket.config";
import { useEffect, useState } from "react";

export default function ChatSidebar({
  users,
  group,
}: {
  users: Array<GroupChatUserType> | [];
  group: GroupChatType;
}) {
  const [ChatUser, setChatUser] = useState<GroupChatUserType | null>(null);
  const [userStatus, setUserStatus] = useState<{
    [key: string]: { status: string; lastSeen?: string };
  }>({});
  const socket = getSocket(String(ChatUser?.id));

  useEffect(() => {
    const data = localStorage.getItem(group.id);
    console.log("new user")
    if (data) {
      const parsedData = JSON.parse(data);
      setChatUser(parsedData);
    }
  }, [group.id]);

  useEffect(() => {
    if (!ChatUser) return; // ✅ Prevents issues if ChatUser is not loaded yet
  
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
   // ✅ Dependency includes ChatUser

  // ✅ Listen for user status updates
  useEffect(() => {
    if (!ChatUser) return;
  
    const handleStatusUpdate = (data: { userId: string; status: string; lastSeen?: string }) => {
      setUserStatus((prev) => ({
        ...prev,
        [data.userId]: { status: data.status, lastSeen: data.lastSeen || prev[data.userId]?.lastSeen }
      }));
    };
  
    socket.on("updateUserStatus", handleStatusUpdate);
  
    return () => {
      socket.off("updateUserStatus", handleStatusUpdate);
    };
  }, [ChatUser]); // ✅ Depend on ChatUser to ensure updates
   // ✅ Ensure it updates when ChatUser changes
  

  console.log("sidebaaaar user", ChatUser);
  console.log("check online", userStatus);
  return (
    <div className="hidden md:block h-screen overflow-y-scroll  bg-muted px-2 w-40%" style={{paddingRight:"38px"}}>
      <h1 className="text-2xl font-extrabold py-4 ">Users</h1>
      {users.length > 0 &&
        users.map((item, index) => (
          <div key={index} className="bg-white rounded-md p-2 mt-2"style={{width:"143px"}}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                width:"100%"
              }}
            >
              <div style={{width:"47%"}}>
              <img
                src={item.profile_image}
                style={{ width: "50px", height: "50px", borderRadius: "50%" }}
              />
              </div>
              <div style={{transform:"translateX(6px)"}}>
                <p className="font-bold"> {item.name}</p>
                <p
                  style={{
                    color:
                      userStatus[item.id]?.status === "online"
                        ? "green"
                        : "gray",
                        fontSize:"11px"
                  }}
                >
                  {userStatus[item.id]?.status === "online"
                    ? "Online"
                    : userStatus[item.id]?.lastSeen
                    ? `Last seen: ${new Date(
                        userStatus[item.id]?.lastSeen as string
                      ).toLocaleTimeString()}`
                    : "Offline"}
                </p>
              </div>
            </div>

            {/* <p>
              Joined : <span>{new Date(item.created_at).toDateString()}</span>
            </p> */}
          </div>
        ))}
    </div>
  );
}
