import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UPLOAD_FILE } from "@/lib/apiEndPoints";
import { getSocket } from "@/lib/socket.config";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { FiSend } from "react-icons/fi";

import axios from "axios";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import { CiImageOn } from "react-icons/ci";
import { FaMicrophone, FaStop } from "react-icons/fa";
import ClockLoader from "react-spinners/ClockLoader";
import { v4 as uuidv4 } from "uuid";
import DeleteMsgChat from "../msgChat/DeleteMsgChat";
import EditMsgChat from "../msgChat/EditMsgChat";

import { BiShare } from "react-icons/bi";
import { TbShare3 } from "react-icons/tb";
export default function Chats({
  group,
  oldMessages,
chatUser
}: {
  group: GroupChatType;
  oldMessages: Array<MessageType> | [];
  chatUser?: GroupChatUserType;
}) {

 console.log("group on chat",group)
console.log("chat user tmc",chatUser)
  const socket = getSocket(String(chatUser?.id));
console.log("socket kya h", socket)
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<MessageType>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loader, setLoader] = useState(false);

  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [editDialoag, setEditDialog] = useState(false);
  const [deleteDialoag, setDeleteDialog] = useState(false);

  const[EditMsg,setEditMsg]=useState({})
   const[Couter,setCounter]=useState<MessageType | null>(null);
   console.log("counter msgg",Couter)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  useEffect(() => {
    socket.emit("joinRoom", group.id);
    console.log("Joining room:", group.id);
  }, [group.id,chatUser?.id]);
  
  useEffect(() => {
    socket.on("editMessage", (updatedMessage) => {
      console.log("✅ Edit message received:", updatedMessage);
    });
  
    return () => {
      socket.off("editMessage");
    };
  }, []);
  

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    const chunks: BlobPart[] = [];

    mediaRecorder.ondataavailable = (event) => {
      chunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(chunks, { type: "audio/webm" });
      setAudioBlob(audioBlob);
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };
  console.log("edit msg id",group.id)

// let msd = oldMessages[oldMessages.length-1].counter_reply
console.log("oldMessagesssss",oldMessages)
const lastMessage = oldMessages[oldMessages.length - 1];
function CounterMsg(Msg:any){
  let counterReplyObject;
  if (typeof Msg === "string") {
    try {
      counterReplyObject = JSON.parse(Msg);
    } catch (error) {
      console.error("Error parsing counter_reply:", error);
      counterReplyObject = Msg; // Use the original value if parsing fails
    }
  } else {
    counterReplyObject = Msg; // It's already an object
  }
  return counterReplyObject;
}

if (lastMessage?.counter_reply) {
 CounterMsg(lastMessage.counter_reply)
  // console.log("Parsed counter_reply:", counterReplyObject);
  console.log("Counter Reply Message:", CounterMsg(lastMessage.counter_reply));
}
  console.log("chatuserrrrr chat",chatUser)
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

  useEffect(() => {
  if (!chatUser?.id) return;

  socket.auth = { room: group.id, userId: chatUser.id };
  socket.connect();
  socket.emit("joinRoom", group.id);
  console.log("Joining room:", group.id);

  return () => {
    socket.emit("leaveRoom", group.id);
    socket.off("editMessage");
  };
}, [group.id, chatUser?.id]);

  

  useEffect(() => {
    const handleEditMessage = (updatedMessage: any) => {
      console.log("msg editing");
      console.log("Edit message event received:", updatedMessage);
  
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === updatedMessage.id ? { ...msg, message: updatedMessage.message } : msg
        )
      );
    };
  
    const handleDeleteMessage = (deletedMessage: any) => {
      console.log("msg deleting");
      console.log("Delete message event received:", deletedMessage);
  
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== deletedMessage.id) // Remove message by ID
      );
    };
  
    socket.on("editMessage", handleEditMessage);
    socket.on("deleteMessage", handleDeleteMessage);
  
    return () => {
      socket.off("editMessage", handleEditMessage);
      socket.off("deleteMessage", handleDeleteMessage);
    };
  }, []);
  
  
  
  
  console.log("edit messagessssss",messages)
  


  const msgUpdate = useCallback((data: MessageType) => {
    console.log("msg updating")
    setMessages((prevMessages) => {
      const messageExists = prevMessages.some((msg) => msg.id === data.id);
      
      if (messageExists) {
        // ✅ Do nothing if the message already exists (prevents overwriting edited messages)
        return prevMessages;
      }
  
      return [...prevMessages, data]; // ✅ Only add new messages
    });
  
    scrollToBottom();
  }, []);
  
  
  
console.log("without edit messagessssss",messages)

useEffect(() => {
  socket.on("message", (data) => {
    console.log("New message received:", data);
    // Add logic to render message in group chat UI
  });
  
  return () => {
    socket.off("message", msgUpdate); // ✅ Only remove message listener
  };
}, [msgUpdate]);


useEffect(() => {
  socket.on("message", msgUpdate);
  
  return () => {
    socket.off("message", msgUpdate); // ✅ Only remove message listener
  };
}, [msgUpdate]);


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
      profile_image: chatUser?.profile_image,
       counter_reply: Couter ? JSON.stringify(Couter) : undefined,
    };

    if (selectedFile || audioBlob) {
      setLoader(true);
      if (selectedFile) {
        console.log("selected fileee",selectedFile)
        formData.append("file", selectedFile, selectedFile.name);
      } else if (audioBlob) {
        formData.append("file", audioBlob, "voice_message.webm");
      }
            
      try {
        const { data } = await axios.post(UPLOAD_FILE, formData);
        if (data.success) {
          payload.media_url = data.fileUrl;
          payload.media_type = data.fileType;
          setLoader(false);
          setSelectedFile(null)
          setAudioBlob(null)
          setCounter(null)
        }
      } catch (error) {
        console.error("File upload failed", error);
        setLoader(false);
        setSelectedFile(null)
          setAudioBlob(null)
          setCounter(null)
      }
    }

    socket.emit("message", payload);
    setMessage("");
    setSelectedFile(null);
    setCounter(null)
    setMessages((prevMessages) => [...prevMessages, payload]);
    console.log("submit data")
  };

  console.log("counterrrrrrr",Couter)
 
function ForEdit(message:any){
  setEditMsg(message)
  setEditDialog(true)
}

function forDelete (message:any){
  console.log("fordelett")
  setEditMsg(message)
  setDeleteDialog(true)
}
function forCounter (message:any){
 
  setCounter(message)
}
if(Couter){

  console.log("counterrrr",Couter)
}
console.log("editmsggggg",EditMsg)

function formatDate(dateString : string) {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-based
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');

  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHour = String(hours % 12 || 12).padStart(2, '0');

  return `${day}/${month} - ${formattedHour}:${minutes} ${ampm}`;
}


  console.log("messagessss", messages);
  return (
<div className="relative h-[94vh]">
  {/* Background image */}
  <div
    className="absolute inset-0 bg-cover bg-center z-0"
    style={{
      backgroundImage:
        "url('/images/social-media-sketch-vector-seamless-260nw-1660950727.jpg')",
    }}
  ></div>
    
    <div className="flex flex-col h-full p-4 relative z-10">
    <div className="flex-1 overflow-y-auto flex flex-col-reverse">
      <div ref={messagesEndRef} />
      <div className="flex flex-col gap-2">
        {messages.map((message,index) => (
          <div key={message.id || index} style={{display:"flex",flexDirection:"row"}} className={`${message.name  === chatUser?.name ? " self-end" : " self-start"}`}>
            {
                message.name === chatUser?.name && (
                  <div onClick={()=>forCounter(message)}>
                  <BiShare size={20}/>
                  </div>
                )
              }
          <div key={message.id} className={`max-w-sm rounded-lg p-2 w-100% ${message.name === chatUser?.name ? "bg-blue-600 text-white self-end" : "bg-gray-300 text-black self-start"}`}>
          {
            message?.counter_reply ? (<><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:"10px"}}>
              
              <div className="name flex items-center gap-2">
                <img src={message.profile_image} className="w-8 h-8 rounded-full" />
                <div className="text-sm">{message.name}</div>
              </div>
              {
                message.name === chatUser?.name && <div>  <DropdownMenu>
                <DropdownMenuTrigger>
                  <DotsVerticalIcon className="h-3 w-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                 
                  <DropdownMenuItem onClick={()=>ForEdit(message)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={()=>forDelete(message)}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> </div>
              }
              
  
              </div>
             
              {
                <div style={{backgroundColor:"#535050",padding:"5px",borderRadius:"9px",borderLeft:"4px solid red",marginTop:"5px",width:"100%",marginLeft:"10px"}}>
                <div className="name flex items-center gap-2">
                <img src={CounterMsg(message?.counter_reply).profile_image} className="rounded-full" style={{width:"25px",height:"25px"}} />
                <div className="text-sm" style={{fontSize:"12px"}}>{CounterMsg(message?.counter_reply).name}</div>
                
                
              </div>
              <div style={{fontSize:"12px"}}>

              {CounterMsg(message?.counter_reply).message}
              {/* {CounterMsg(message.counter_reply as CounterReplyType).media_url &&(
                <>
                                          {console.log("sss")}
                </>
              ) } */}
              {CounterMsg(message.counter_reply as CounterReplyType).media_url && (
                <div className="mt-2">
                  {/* {console.log("sss")} */}
                  {CounterMsg(message.counter_reply as CounterReplyType).media_type === "image" ? (
                    <img src={CounterMsg(message.counter_reply as CounterReplyType).media_url} alt="Sent media" className="w-32 h-32 object-cover rounded-md border" />
                  ) : CounterMsg(message.counter_reply as CounterReplyType).media_type === "video" ? (
                    <video controls className="w-32 h-32 rounded-md border">
                      <source src={CounterMsg(message.counter_reply as CounterReplyType).media_url} type="video/mp4" />
                    </video>
                  ) : (
                    <audio controls className="w-250px mt-2">
                      <source src={CounterMsg(message.counter_reply as CounterReplyType).media_url} type="audio/webm" />
                    </audio>
                  )}
                </div>
              )}
              </div>

              </div>
              }
              
               <div>{message.message}</div>
               <div className={`${message.name === chatUser?.name ? "text-white" : "text-white"}}`} style={{display:"flex",justifyContent:"flex-end",fontSize:"10px"}} >{formatDate(message.created_at)}</div>
              </>) : (<><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:"10px"}}>
              
                <div className="name flex items-center gap-2">
                  <img src={message.profile_image} className="w-8 h-8 rounded-full" />
                  <div className="text-sm">{message.name}</div>
                </div>
                {
                  message.name === chatUser?.name && <div>  <DropdownMenu>
                  <DropdownMenuTrigger>
                    <DotsVerticalIcon className="h-3 w-3" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                   
                    <DropdownMenuItem onClick={()=>ForEdit(message)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={()=>forDelete(message)}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu> </div>
                }
                
    
                </div>
                <div>{message.message}</div>
                
                {message.media_url && (
                  <div className="mt-2">
                    {message.media_type === "image" ? (
                      <img src={message.media_url} alt="Sent media" className="w-32 h-32 object-cover rounded-md border" />
                    ) : message.media_type === "video" ? (
                      <video controls className="w-32 h-32 rounded-md border">
                        <source src={message.media_url} type="video/mp4" />
                      </video>
                    ) : (
                      <audio controls className="w-250px mt-2">
                        <source src={message.media_url} type="audio/webm" />
                      </audio>
                    )}
                  </div>
                )}
                                <div className={`${message.name === chatUser?.name ? "text-white" : "text-white"}}`} style={{display:"flex",justifyContent:"flex-end",fontSize:"10px"}}>{formatDate(message.created_at)}</div>

                </>
              
              )
                
          }
            
          </div>
          {
                message.name !== chatUser?.name && (
                  <div onClick={()=>forCounter(message)}>
                  <TbShare3 size={20}/>
                  </div>
                )
              }
          </div>
        ))}
      </div>
    </div>

{editDialoag && (
        <Suspense fallback={<p>Loading...</p>}>
          <EditMsgChat
            open={editDialoag}
            setOpen={setEditDialog}
           EditMessage={EditMsg}
           group={group}
           chatUser={chatUser}
          />
        </Suspense>
      )}

      {
        deleteDialoag && (
          <Suspense fallback={<p>Loading...</p>}>
          <DeleteMsgChat
            open={deleteDialoag}
            setOpen={setDeleteDialog}
           EditMessage={EditMsg}
           group={group}
           setMessages={setMessages}
           chatUser={chatUser}
          />
        </Suspense>
        )
      }
   

    {selectedFile || audioBlob ? (
      <div className="mt-4 flex flex-col items-center relative p-4 rounded-md bg-gray-200">
        <button onClick={() => { setSelectedFile(null); setAudioBlob(null); }} className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full shadow-md">✖️</button>
        <div className="mt-2">
          {selectedFile ? (
            selectedFile.type.startsWith("image") ? (
              <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="w-32 h-32 object-cover rounded-md border" />
            ) : (
              <video controls className="w-32 h-32 rounded-md border">
                <source src={URL.createObjectURL(selectedFile)} type={selectedFile.type} />
              </video>
            )
          ) : ( audioBlob && (
            <audio controls className="w-250px">
              <source src={URL.createObjectURL(audioBlob)} type="audio/webm" />
            </audio>)
          )
          }
          {loader && <ClockLoader size={25} />}
        </div>
      </div>
    ) : null}
       
       { Couter && ( 
          <div className="mt-4 flex flex-col items-center relative p-4 rounded-md bg-gray-200">
                    <button onClick={() => { setCounter(null) }} className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full shadow-md">✖️</button>

             <div key={Couter.id} className={`max-w-sm rounded-lg p-2 ${Couter.name === chatUser?.name ? "bg-blue-600 text-white self-end" : "bg-gray-300 text-black self-start"}`}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:"10px"}}>
              
            <div className="name flex items-center gap-2">
              <img src={Couter.profile_image} className="w-8 h-8 rounded-full" />
              <div className="text-sm">{Couter.name}</div>
            </div>
           
            </div>





            {Couter?.counter_reply && (
              <div style={{backgroundColor:"#535050",padding:"5px",borderRadius:"9px",borderLeft:"5px solid red",marginTop:"5px"}}>
              <div className="name flex items-center gap-2">
              <img src={CounterMsg(Couter?.counter_reply).profile_image} className="rounded-full" style={{width:"25px",height:"25px"}} />
              <div className="text-sm" style={{fontSize:"12px"}}>{CounterMsg(Couter?.counter_reply).name}</div>
              
              
            </div>
            <div style={{fontSize:"12px"}}>

            {CounterMsg(Couter?.counter_reply).message}
            </div>

            </div>
            )
                
              }


            <div>{Couter.message}</div>
            
            {Couter.media_url && (
              <div className="mt-2">
                {Couter.media_type === "image" ? (
                  <img src={Couter.media_url} alt="Sent media" className="w-32 h-32 object-cover rounded-md border" />
                ) : Couter.media_type === "video" ? (
                  <video controls className="w-32 h-32 rounded-md border">
                    <source src={Couter.media_url} type="video/mp4" />
                  </video>
                ) : (
                  <audio controls className="w-250px mt-2">
                    <source src={Couter.media_url} type="audio/webm" />
                  </audio>
                )}
              </div>
            )}
          </div>
          </div>
        )
       }
      

      <form onSubmit={handleSubmit} className="mt-2">
  <div className="flex items-center rounded-full border px-3 py-2 bg-white">
    {/* Left - Mic Icon */}
    <button
      type="button"
      onClick={recording ? stopRecording : startRecording}
      className="text-gray-500 mr-2"
    >
      {recording ? <FaStop className="w-5 h-5" /> : <FaMicrophone className="w-5 h-5" />}
    </button>

    {/* Input field */}
    <input
      type="text"
      placeholder="Type a message..."
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      className="flex-1 outline-none border-none text-sm bg-transparent"
    />

    {/* Right - Image upload */}
    <label className="cursor-pointer text-gray-500 mr-2">
      <CiImageOn className="w-5 h-5" />
      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </label>

    {/* Right - Send button */}
    <button
      type="submit"
      className="text-blue-500"
    >
      <FiSend className="w-5 h-5" />
    </button>
  </div>
</form>

  </div>
  </div>
  );
}
