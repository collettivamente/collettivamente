import { createContext, useContext, ReactElement } from 'react'
import { useUser, AppUser } from 'auth'

const authUserContext = createContext<{ user: AppUser | null | undefined }>({
  user: null
})

export function AuthUserProvider({ children }: { children: ReactElement}) {
  const { user } = useUser()

  return <authUserContext.Provider value={ { user } }>{children}</authUserContext.Provider>
}

export const useAuth = () => useContext(authUserContext);
