import { DEMO_USER_ID, getDemoData } from './demo-data'

export function isDemoUser(userId?: string | null): boolean {
  return userId === DEMO_USER_ID
}

export function demoFetch(resource: string): any {
  return getDemoData(resource)
}

export function demoOrFetch<T>(userId: string | undefined | null, resource: string, fetcher: () => Promise<T>): Promise<T | any> {
  if (isDemoUser(userId)) {
    return Promise.resolve(demoFetch(resource))
  }
  return fetcher()
}
