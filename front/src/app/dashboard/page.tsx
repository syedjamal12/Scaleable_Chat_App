import DashNav from "@/components/chatGroup/DashNav";
import { getServerSession } from "next-auth";
import { authOptions, CustomSession } from "../api/auth/[...nextauth]/options";
import CreateChat from "@/components/groupChat/CreateChat";
import { fetchChatGroup } from "@/fetch/groupFetch";

export default async function Dashboard() {
  const session: CustomSession | null = await getServerSession(authOptions);

  const data: Array<string> = await fetchChatGroup(session?.user?.token) || [];

  console.log("dataaa",data)

  return (
    <div>
      <DashNav
        name={session?.user?.name!}
        image={session?.user?.image ?? undefined}
      />
      <div className="container">
      <div className="flex justify-end mt-10">
        <CreateChat user={session?.user}/>
      </div>

      </div>
    </div>
  );
}

// export default Dashboard
