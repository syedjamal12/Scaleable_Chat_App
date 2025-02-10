type GroupChatType = {
    id: string;
    user_id: number;
    title: string;
    passcode: string;
    created_at: string;
    profile_image: string
  };

  type GroupChatUserType = {
    id: number;
    name: string;
    group_id: string;
    created_at: string;
    isOnline?: boolean;
    profile_image: string
  };

  type MessageType = {
    id:string,
    group_id:string,
    name:string,
    message:string,
    created_at:string,

  }