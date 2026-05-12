import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session?.user) {
    const role = session.user.role
    if (role === 'ADMIN' || role === 'SUPER_ADMIN') redirect('/dashboard/admin')
    if (role === 'MANAGER') redirect('/dashboard/manager')
    redirect('/dashboard/learner')
  }

  redirect('/login')
}
