import ChatBase from "@/components/chat/ChatBase";
import { fetchChatMsg } from "@/fetch/chatsFetch";
import { fetchChatSingleGroup, groupChatUsers } from "@/fetch/groupFetch";
import { notFound } from "next/navigation";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: PageProps) {
  const { id } = params;

  if (id.length !== 36) {
    return notFound();
  }

  const group: GroupChatType | null = await fetchChatSingleGroup(id);
  if (!group) {
    return notFound();
  }

  const users: GroupChatUserType[] = await groupChatUsers(id);
  const chats: MessageType[] = await fetchChatMsg(id);

  return (
    <div>
      <ChatBase group={group} users={users} oldMessages={chats} />
    </div>
  );
}
