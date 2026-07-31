import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function SacerdotePainelRedirect() {
  const cookieStore = await cookies();
  const token = cookieStore.get('sacerdote_token')?.value;
  redirect(token ? '/painel-sacerdote' : '/sacerdote/login');
}
