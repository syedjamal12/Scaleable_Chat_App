import { getSocket } from "@/lib/socket.config";
import { useState, useRef, useEffect } from "react";
import SimplePeer from "simple-peer";

export default function CallHandler({ 
  user, 
  chatGroup, 
  setCallUser, 
  callType 
}: {
  user: GroupChatUserType | undefined;
  chatGroup: GroupChatType;
  setCallUser: any;
  callType: "audio" | "video" | null;
}) {
  const socket = getSocket(String(chatGroup?.id));
  const [stream, setStream] = useState<MediaStream | undefined>();
  const [callAccepted, setCallAccepted] = useState(false);
  const [call, setCall] = useState<CallType | null>(null);
  const myVideo = useRef<HTMLVideoElement | null>(null);
  const userVideo = useRef<HTMLVideoElement | null>(null);
  const connectionRef = useRef<any>(null);

  interface CallType {
    isReceivingCall: boolean;
    from: string;
    signal: any;
    isVideo: boolean;
    name?: string; 
  }

  useEffect(() => {
    if (!user || !chatGroup?.id) return;

    socket.auth = { room: chatGroup.id, userId: user.id };
    socket.connect();
    socket.emit("joinRoom", chatGroup.id);

    socket.on("incomingCall", ({ from, signal, isVideo }) => {
      if (from !== user.id) {
        setCall({ isReceivingCall: true, from, signal, isVideo });
      }
    });

    return () => {
      socket.emit("leaveRoom", chatGroup.id);
      socket.off("incomingCall");
    };
  }, [chatGroup.id, user]);

  useEffect(() => {
    if (callType) {
      navigator.mediaDevices.getUserMedia({ video: callType === "video", audio: true })
        .then((currentStream) => {
          setStream(currentStream);
          if (myVideo.current) {
            myVideo.current.srcObject = currentStream;
          }
        });
    }

    socket.on("callUser", ({ from, signal, isVideo }) => {
      if (from !== user?.id) {
        setCall({ isReceivingCall: true, from, signal, isVideo });
      }
    });
  }, [chatGroup.id, callType]);

  const callUser = () => {
    if (!user || !chatGroup?.id) return;

    const peer = new SimplePeer({ initiator: true, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        roomId: chatGroup.id,
        from: user.id,
        signalData: data,
        isVideo: callType === "video"
      });
    });

    peer.on("stream", (currentStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    if (!call) return;

    setCallAccepted(true);
    const peer = new SimplePeer({ initiator: false, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { roomId: chatGroup.id, signal: data, to: call.from });
    });

    peer.on("stream", (currentStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    peer.signal(call.signal);
    connectionRef.current = peer;
  };

  return (
    <div>
      <div>
        {callType === "video" && <video playsInline muted ref={myVideo} autoPlay />}
        {callAccepted && <video playsInline ref={userVideo} autoPlay />}
      </div>

      <button onClick={callUser}>📞 Call</button>

      {call?.isReceivingCall && !callAccepted && (
        <div>
          <h2>{call?.from} is calling... ({call.isVideo ? "Video" : "Audio"})</h2>
          <button onClick={answerCall}>Accept</button>
        </div>
      )}
    </div>
  );
}
