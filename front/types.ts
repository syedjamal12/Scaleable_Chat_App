type GroupChatType = {
    id: string;
    user_id: number;
    title: string;
    passcode: string;
    created_at: string;
  };

  type GroupChatUserType = {
    id: number;
    name: string;
    group_id: string;
    created_at: string;
    isOnline?: boolean;
  };

  type MessageType = {
    id:string,
    group_id:string,
    name:string,
    message:string,
    created_at:string,

  }