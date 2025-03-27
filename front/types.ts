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
    profile_image?: string
  };
  type CounterReplyType = {
    id: string;
    group_id: string;
    name: string;
    message: string;
    media_url?: string;
    media_type?: string;
    created_at: string;
    profile_image?: string;
  };
  type MessageType = {
    id:string,
    group_id:string,
    name:string,
    message:string,
    media_url?:string | undefined,
    media_type?:string | undefined,
    created_at:string,
    profile_image?:string
    counter_reply?:CounterReplyType | String;

  }