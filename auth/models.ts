export interface AppUser {
  uid: string;
  email: string | null;
  token: string;
  picture?: string | null;
  displayName?: string | null;
}
