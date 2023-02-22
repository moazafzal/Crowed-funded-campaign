import React from 'react'
import { useState } from 'react'
import { Message } from 'semantic-ui-react'

const Alerts = (props) => {  
  return (
    <>
      <Message onDismiss={()=>{props.alertDismiss()}} hidden={props.alert == `null`} warning={props.alert.type == `warning`} success={props.alert.type == `success`} error={props.alert.type == `error`}>
        <strong style={{ textTransform: 'uppercase', paddingRight: '10px' }}>{props.alert.type} : </strong>
        {props.alert.message}

      </Message>
    </>
  )
}

export default Alerts