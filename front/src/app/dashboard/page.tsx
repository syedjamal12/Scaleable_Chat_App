import DashNav from "@/components/chatGroup/DashNav";
import { getServerSession } from "next-auth";
import { authOptions, CustomSession } from "../api/auth/[...nextauth]/options";
import CreateChat from "@/components/groupChat/CreateChat";
import { fetchChatGroup } from "@/fetch/groupFetch";
import GroupChatCard from "@/components/groupChat/GroupChatCard";

export default async function Dashboard() {
  const session: CustomSession | null = await getServerSession(authOptions);

  const data: Array<GroupChatType> | [] = await fetchChatGroup(
    session?.user?.token
  );

  console.log("dataaa", data);

  return (
    <div>
      <DashNav
        name={session?.user?.name!}
        image={session?.user?.image ?? undefined}
      />
      <div className="container">
        <div className="flex justify-end mt-10">
          <CreateChat user={session?.user} />
        </div>

        <div className="grid grid-cols-1  lg:grid-cols-3 gap-8">
          {data?.length > 0 &&
            data.map((item, index) => (
              <GroupChatCard group={item} user={session?.user!} />
            ))}
        </div>
      </div>
    </div>
  );
}

// export default Dashboard
