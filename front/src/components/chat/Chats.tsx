import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getSocket } from "@/lib/socket.config";
import { v4 as uuidv4 } from "uuid";
import { CiImageOn } from "react-icons/ci";
import { any } from "zod";
import { UPLOAD_FILE } from "@/lib/apiEndPoints";
import axios from "axios";
import ClockLoader from "react-spinners/ClockLoader";
export default function Chats({
  group,
  oldMessages,
  chatUser,
}: {
  group: GroupChatType;
  oldMessages: Array<MessageType> | [];
  chatUser?: GroupChatUserType;
}) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<MessageType>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loader, setLoader] = useState(false);
  console.log("oldMessages",oldMessages)
  console.log("chatuserrrrr",chatUser)
  // Handle file selection (image/video)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Deduplicate messages based on `id`
  const uniqueMessages = (messages: MessageType[]) =>
    Array.from(new Map(messages.map((msg) => [msg.id, msg])).values());

  useEffect(() => {
    setMessages(uniqueMessages(oldMessages));
  }, [oldMessages]);

  const scrollToBottom = () => {
    console.log("bottom call")
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const socket = useMemo(() => {
    const socketInstance = getSocket();
    socketInstance.auth = {
      room: group.id,
    };
    return socketInstance.connect();
  }, [group.id]);

  const msgUpdate = useCallback((data: MessageType) => {
    setMessages((prevMessages) => {
      if (prevMessages.some((msg) => msg.id === data.id)) {
        return prevMessages; // Skip duplicate messages
      }
      return [...prevMessages, data];
    });
    scrollToBottom();
  }, []);

  useEffect(() => {
    socket.on("message", msgUpdate);

    return () => {
      socket.off("message");
      socket.close();
    };
  }, [socket, msgUpdate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData();

    const payload: MessageType = {
      id: `${uuidv4()}-${Date.now()}`,
      message: message,
      name: chatUser?.name ?? "Unknown",
      created_at: new Date().toISOString(),
      group_id: group.id,
      media_url: undefined, // This will be updated if there's a file
      media_type: undefined, // 'image' or 'video'
      profile_image: chatUser?.profile_image
    };

    if (selectedFile) {
      setLoader(true);
      formData.append("file", selectedFile);
      // Simulate an API call to upload the file
      try {
        const { data } = await axios.post(UPLOAD_FILE, formData);

        // const data = await response.json();
        if (data.success) {
          payload.media_url = data.fileUrl;
          payload.media_type = data.fileType;
          setLoader(false);
        }
      } catch (error) {
        console.error("File upload failed", error);
      }
      setLoader(false);
    }

    socket.emit("message", payload);
    setMessage("");
    setSelectedFile(null);
    setMessages((prevMessages) => [...prevMessages, payload]);
  };

  console.log("messagessss", messages);
  return (
    <div className="flex flex-col h-[94vh] p-4">
      <div className="flex-1 overflow-y-auto flex flex-col-reverse">
        <div ref={messagesEndRef} />
        <div className="flex flex-col gap-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-sm rounded-lg p-2 ${
                message.name === chatUser?.name
                  ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white self-end"
                  : "bg-gradient-to-r from-gray-200 to-gray-300 text-black self-start"
              }`}
            >
              <div className="name">
                <div style={{display:"flex", flexDirection:"row",alignItems:"center", gap:"5px"}}>
                <img src={message?.profile_image} style={{width:"30px", height:"30px", borderRadius:"50%"}}/>
                <div style={{ fontSize: "11px" }}>{message.name}</div>
                </div>
             
                <div>{message.message}</div>
                {message.media_url && (
                  <div className="mt-2">
                    {message.media_type === "image" ? (
                      <img
                        src={message.media_url}
                        alt="Sent media"
                        className="w-32 h-32 object-cover rounded-md border"
                      />
                    ) : (
                      <video controls className="w-32 h-32 rounded-md border">
                        <source src={message.media_url} type="video/mp4" />
                      </video>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Selected File */}
      {selectedFile && (
  <div className="mt-4 flex flex-col items-center relative p-4 rounded-md" style={{ backgroundColor: "#dbd5d5" }}>
    {/* Cross Mark for Removing File */}
    {
      !loader && <button
      onClick={() => setSelectedFile(null)}
      className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full shadow-md"
    >
      ✖️
    </button>
    }
    

    {/* File Preview */}
    <div style={{ display: "flex", flexDirection: "row", marginTop: "12px" }}>
      {selectedFile.type.startsWith("image") ? (
        <img
          src={URL.createObjectURL(selectedFile)}
          alt="Preview"
          className="w-32 h-32 object-cover rounded-md border"
        />
      ) : (
        <video controls className="w-32 h-32 rounded-md border">
          <source src={URL.createObjectURL(selectedFile)} type={selectedFile.type} />
        </video>
      )}

      {/* Loader */}
      {loader && (
        <div style={{ marginTop: "102px" }}>
          <ClockLoader size={25} />
        </div>
      )}
    </div>
  </div>
)}


      {/* Input Form */}
      <form onSubmit={handleSubmit} className="mt-2 flex items-center">
        <label style={{ cursor: "pointer" }}>
          <CiImageOn style={{ width: "50px", height: "39px" }} />
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </label>
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          className="flex-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  );
}
