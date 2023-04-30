export interface UserProfile {
  uid: string | null;
  email: string | null;
  photoURL?: string;
  name?: string;
  surname?: string;
  birthdate?: string;
  gender?: 'M' | 'F' | 'A';
  phone?: string;
  meta?: {
    newsletter: boolean;
    publisher: boolean;
    role: 'user' | 'admin' | 'editor'
  }
}
