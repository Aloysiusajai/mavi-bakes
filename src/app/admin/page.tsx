import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminDashboardClient from '@/components/AdminDashboardClient';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  if (!token) {
    console.log('[admin page] no session_token cookie, redirecting to /admin/login');
    redirect('/admin/login');
  }

  // verify JWT
  try {
    // import verifyToken dynamically since this runs in server
    const { verifyToken } = await import('@/lib/jwt');
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin' || decoded.email !== process.env.ADMIN_EMAIL) {
      console.log('[admin page] token invalid or not admin', decoded);
      redirect('/admin/login');
    }
  } catch (e) {
    console.log('[admin page] token verify failed, redirecting to /admin/login', e);
    redirect('/admin/login');
  }

  return <AdminDashboardClient />;
}
