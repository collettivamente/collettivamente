import { parseCookies, setCookie, destroyCookie } from 'nookies'
import { AppUser } from 'auth';

export const getUserFromCookie = () => {
  const cookies = parseCookies()
  const auth = cookies['auth'];
  if (!auth) {
    return
  }
  return JSON.parse(auth) as AppUser;
}

export const setUserCookie = (user: AppUser) => {
  setCookie(null, 'auth', JSON.stringify(user), {
    expires: 1 / 24
  });
}

export const removeUserCookie = () => { destroyCookie(null, 'auth'); }
