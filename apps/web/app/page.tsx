/**
 * Landing page — redirects guests to language selection.
 * This is the public entry point of the guest app.
 */
import { redirect } from 'next/navigation';

export default function RootPage() {
  // Guests always start at language selection
  redirect('/select-language');
}
