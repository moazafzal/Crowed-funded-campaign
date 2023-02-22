import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Button, Card, Image } from 'semantic-ui-react'

const Login = (props) => {
  const navigate = useNavigate()
  if (!props.account) {
    return (
      <>
        <Card centered style={{ marginTop: '20px' }}>
          <Image src='./MetaMask.png'></Image>
          <Card.Content>
            <Card.Header>Login With Goerli Test Network</Card.Header>
          </Card.Content>
          <Card.Content>
            <div>
              <Button onClick={() => props.connect()}>Connect your Meta mask Wallet</Button>
            </div>
          </Card.Content>
        </Card>
      </>
    )
  }
  if(props.account){
    return <Navigate to='/'/>
  }
}

export default Login