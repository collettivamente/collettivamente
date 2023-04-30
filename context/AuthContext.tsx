import { useContext, createContext, useEffect, useState, ReactNode, useMemo } from 'react'
import { UserCredential, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { setDoc, doc, getDoc, FirestoreDataConverter } from 'firebase/firestore'
import { auth, firestore } from '../firebase-config'
import { UserProfile } from '@/models/user'

type IUser = Pick<UserProfile, 'email' | 'uid' | 'name'>
type SignUpFn = (email: string, password: string, profile: UserProfile) => Promise<UserCredential | undefined>;
type LogInFn = (email: string, password: string) => Promise<UserCredential>;
type LogOutFn = () => Promise<void>;

const AuthContext = createContext<Partial<{ user: IUser, signUp: SignUpFn, logIn: LogInFn, logOut: LogOutFn }>>({ })

export const useAuth = () => useContext(AuthContext)

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser>({ email: null, uid: null })
  const [loading, setLoading] = useState<boolean>(true)

  const converter: FirestoreDataConverter<UserProfile> = useMemo(() => ({
    fromFirestore: (snapshot, options) => {
      const data = snapshot.data(options)
      return {
        uid: snapshot.id,
        email: data.email,
        name: data.name,
        surname: data.surname,
        birthdate: data.birthdate,
        gender: data.gender,
        phone: data.phone,
        photoURL: data.photoURL,
        meta: {
          newsletter: data.meta.newsletter,
          publisher: data.meta.publisher,
          role: data.meta.role
        },
      }
    },
    toFirestore: ({ uid, ...data}) => {
      return data
    }
  }), [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        let appUser: UserProfile = { uid: user.uid, email: user.email, photoURL: user.photoURL ?? undefined }
        try {
          const userRef = doc(firestore, 'users', user.uid).withConverter(converter)
          const userData = await getDoc(userRef)
          if (userData.exists()) {
            appUser = userData.data() 
          }
        } catch { }

        setUser({
          email: appUser.email,
          uid: appUser.uid,
          name: appUser.name
        })
      } else {
        setUser({ email: null, uid: null })
      }
    })
    setLoading(false)

    return () => unsubscribe()
  }, [converter])

  const signUp = async (email: string, password: string, profile: UserProfile) => {
    try {
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
      profile.uid = userCredentials.user.uid
      const docRef = doc(firestore, 'users', profile.uid).withConverter(converter)
      await setDoc(docRef, profile)
      return userCredentials
    } catch (e) {
      console.error(e)
    }
  }

  const logIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  const logOut = async () => {
    setUser({ email: null, uid: null })
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, signUp, logIn, logOut }}>
      { loading ? null : children }
    </AuthContext.Provider>
  )
}

