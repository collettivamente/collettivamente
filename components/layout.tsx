import React, { FunctionComponent } from "react";
import Footer from "./footer";
import Meta from "./meta";

type Props = { preview: boolean }
const Layout: FunctionComponent<Props> = ({ preview, children }) => (
  <>
    <Meta />
    <div className="min-h-screen">
      <main>{children}</main>
    </div>
    <Footer />
  </>
)

export default Layout