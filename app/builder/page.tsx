import { redirect } from 'next/navigation';

export default function BuilderIndexPage() {
  redirect('/builder/about');
  return null;
} 