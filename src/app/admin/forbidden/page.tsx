import { redirect } from 'next/navigation'

// This page has moved to /forbidden to avoid a redirect loop
// caused by being inside the admin layout (which itself redirects here).
export default function AdminForbiddenRedirect() {
  redirect('/forbidden')
}
