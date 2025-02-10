import React from "react";

export default function ChatSidebar({
  users,
}: {
  users: Array<GroupChatUserType> | [];
}) {
  return (
    <div className=" md:block h-screen overflow-y-scroll  bg-muted px-2 w-40%">
      <h1 className="text-2xl font-extrabold py-4 ">Users</h1>
      {users.length > 0 &&
        users.map((item, index) => (
          <div key={index} className="bg-white rounded-md p-2 mt-2">
            <div style={{display:"flex", flexDirection:"row", alignItems:"center", gap:"5px"}}>
              <img src={item.profile_image} style={{width:"50px", height:"50px", borderRadius:"50%"}}/>
              <p className="font-bold"> {item.name}</p>
            </div>
            
            <p>
              Joined : <span>{new Date(item.created_at).toDateString()}</span>
            </p>
          </div>
        ))}
    </div>
  );
}