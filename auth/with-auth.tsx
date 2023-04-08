import { useEffect, ElementType } from "react";
import router from "next/router";
import initFirebase from '../firebase-config'
import { getAuth } from "@firebase/auth";

const app = initFirebase()
const auth = getAuth(app)

// eslint-disable-next-line react/display-name
const withAuth = (Component: ElementType) => (props: any) => {
  useEffect(() => {
    auth.onAuthStateChanged(authUser => {
      if (!authUser) {
        router.push('/signin')
      }
    })
  }, [])

  return (<Component {...props} />)
}

export default withAuth;