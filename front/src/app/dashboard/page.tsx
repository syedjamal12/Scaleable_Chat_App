import DashNav from "@/components/chatGroup/DashNav";
import { getServerSession } from "next-auth";
import { authOptions, CustomSession } from "../api/auth/[...nextauth]/options";
import CreateChat from "@/components/groupChat/CreateChat";
import { fetchChatGroup } from "@/fetch/groupFetch";
import GroupChatCard from "@/components/groupChat/GroupChatCard";
import { Lightbulb } from "lucide-react";

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
        <div className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-900 p-4 rounded-lg max-w-md shadow-md " style={{marginBottom:"16px"}}>
      <div className="flex items-start gap-2">
        <Lightbulb className="w-5 h-5 mt-1 text-yellow-600" />
        <div>
          <h3 className="font-semibold mb-1">How to Start Chatting with Friends</h3>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>Click <strong>Create Group</strong></li>
            <li>Tap the <strong>three dots</strong> → Copy Group Link</li>
            <li>Open the link in another tab and share with friends</li>
            <li>Send your <strong>passcode</strong> so they can join</li>
          </ul>
        </div>
      </div>
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
