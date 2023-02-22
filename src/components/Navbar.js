
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'

const Navbar = (props) => {
  const [activeItem, setactiveItem] = useState()
  const handleItemClick = (e, { name }) => {
    setactiveItem(name)
  }
  
  return (
    <Menu>
        <Menu.Item header><Link to={'/'}>Crowed Funding Campaign</Link></Menu.Item>
        <Menu.Item
          active={activeItem === 'aboutUs'}
          onClick={handleItemClick} 
        ><Link to='/ERCToken'>My Token</Link></Menu.Item>
        
        <Menu.Item
          active={activeItem === 'locations'}
          onClick={handleItemClick}
        >Tokens: {props.tokens}</Menu.Item>
        {props.contractAddress?<><Menu.Item position='right'>Address: {props.contractAddress.slice(0,6)}....{props.contractAddress.slice(38,42)} </Menu.Item></>:
        <Menu.Item position='right' as='button' onClick={()=>{props.connect()}}>connect</Menu.Item>}
        
      </Menu>
  )
}

export default Navbar
