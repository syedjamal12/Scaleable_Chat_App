import DashNav from '@/components/chatGroup/DashNav'
import { getServerSession } from 'next-auth';
import { authOptions, CustomSession } from '../api/auth/[...nextauth]/options';

export default async function Dashboard  ()  {
    const session: CustomSession | null = await getServerSession(authOptions);

  return (
    <div> <DashNav
    name={session?.user?.name!}
    image={session?.user?.image ?? undefined}
  /></div>
  )
}

// export default Dashboard