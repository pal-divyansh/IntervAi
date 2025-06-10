import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/auth');
  
  // This return will never be reached due to the redirect
  return null;
}
