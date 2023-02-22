import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

export const RequireAuth = (props) => {
  const location = useLocation()

  if (props.address == null ) {
    return <Navigate to='/login' state={{ path: location.pathname }} />
  }

  else if (!window.ethereum.isConnected()) {
    return <Navigate to='/login' state={{ path: location.pathname }} />
  }
  return props.children
}
