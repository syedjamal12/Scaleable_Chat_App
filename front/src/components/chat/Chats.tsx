import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getSocket } from "@/lib/socket.config";
import { v4 as uuidv4 } from "uuid";

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

  // Deduplicate messages based on `id`
  const uniqueMessages = (messages: MessageType[]) =>
    Array.from(new Map(messages.map((msg) => [msg.id, msg])).values());

  useEffect(() => {
    setMessages(uniqueMessages(oldMessages));
  }, [oldMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const socket = useMemo(() => {
    const socketInstance = getSocket();
    socketInstance.auth = {
      room: group.id,
    };
    return socketInstance.connect();
  }, [group.id]);

  const msgUpdate = useCallback(
    (data: MessageType) => {
      setMessages((prevMessages) => {
        if (prevMessages.some((msg) => msg.id === data.id)) {
          return prevMessages; // Skip duplicate messages
        }
        return [...prevMessages, data];
      });
      scrollToBottom();
    },
    []
  );

  useEffect(() => {
    socket.on("message", msgUpdate);

    return () => {
      socket.off("message");
      socket.close();
    };
  }, [socket, msgUpdate]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const payload: MessageType = {
      id: `${uuidv4()}-${Date.now()}`, // Generate a unique ID
      message: message,
      name: chatUser?.name ?? "Unknown",
      created_at: new Date().toISOString(),
      group_id: group.id,
    };

    socket.emit("message", payload);

    setMessage("");
    setMessages((prevMessages) => [...prevMessages, payload]);
  };
console.log("messagessss",messages)
  return (
    <div className="flex flex-col h-[94vh] p-4">
      <div className="flex-1 overflow-y-auto flex flex-col-reverse">
        <div ref={messagesEndRef} />
        <div className="flex flex-col gap-2">
          {messages.map((message, index) => (
            <div
            key={message.id}
            className={`max-w-sm rounded-lg p-2 ${
              message.name === chatUser?.name
                ? "bg-gradient-to-r from-blue-400 to-blue-600  text-white self-end"
                : "bg-gradient-to-r from-gray-200 to-gray-300 text-black self-start"
            }`}
          >
            <div className="name">
              <div style={{fontSize: "11px"}}>{message.name}</div>
            <div>{message.message}</div>
            
            </div>
            
            </div>
          ))}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mt-2 flex items-center">
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
