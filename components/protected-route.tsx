import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import { useAuth } from "context/AuthContext";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (!user?.uid) {
      router.push('/login')
    }
  }, [router, user])

  return (<>{user ? children : null }</>)
}