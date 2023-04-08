import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { User, getAuth } from 'firebase/auth'
import initFirebase from '../firebase-config'
import { removeUserCookie, setUserCookie, getUserFromCookie } from './user-cookie'
import { AppUser } from 'auth'

const app = initFirebase()
const auth = getAuth(app);

export const mapUserData: (user: User) => Promise<AppUser> = async (user: User) => {
  const { uid, email, photoURL, displayName } = user
  const token = await user.getIdToken(true)
  return {
    uid,
    email,
    token,
    picture: photoURL,
    displayName,
  }
}

const useUser = () => {
  const [user, setUser] = useState<AppUser>()
  const router = useRouter()

  const logout = async () => {
    return auth.signOut().then(() => {
      router.push('/')
    }).catch(e => {
      console.error(e);
    })
  }

  useEffect(() => {
    const cancelAuthListener = auth.onIdTokenChanged(async userToken => {
      if (userToken) {
        const userData = await mapUserData(userToken);
        setUserCookie(userData);
        setUser(userData);
      } else {
        removeUserCookie()
        setUser(undefined)
      }
    })

    const userFromCookie = getUserFromCookie()
    if (!userFromCookie) {
      return
    }
    setUser(userFromCookie)

    return cancelAuthListener
  }, []);

  return { user, logout }
}

export { useUser }
