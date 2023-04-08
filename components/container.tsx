import React, { ReactNode } from 'react'

const Container: React.FC<{ children: ReactNode }> = ({children}) => (<div className="container px-5 mx-auto">{children}</div>)

export default Container
