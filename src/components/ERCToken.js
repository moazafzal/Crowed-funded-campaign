import React, { useEffect, useState } from 'react'
import { Button, Container, Header, Input, Label, Segment } from 'semantic-ui-react'

const ERCToken = (props) => {
    const [receiverName, setreceiverName] = useState(null)
    const [amountTransfer, setamountTransfer] = useState(null)
    const [totalSupply, setTotalSupply] = useState(0)
    useEffect(() => {
        tokenDetail()
    }, [])
    const tokenDetail = async () => {
        console.log(props.MyToken)
        setTotalSupply((await props.MyToken.totalSupply()).toString())
    }
    const transfer = async()=>{
        if(receiverName!=null && amountTransfer!=null){
            const transaction = await props.MyToken.transfer(receiverName,amountTransfer)
            await transaction.wait()
            await props.blockData()
            setamountTransfer(null)
            setreceiverName(null)
        }
    }
    return (
        <Container>
            <Segment>
                <Header>Balance</Header>
                <Label>{props.tokens}</Label>
            </Segment>
            <Segment>
                <Header>Total Supply</Header>
                <Label>{totalSupply}</Label>
            </Segment>
            <Segment>
                <Header>Token Transfer</Header>
                <Input onChange={(e)=>{setreceiverName(e.target.value)}} placeholder='Address Of Receiver' type='text' labelPosition='right' style={{width:'800px', marginBottom:'10px',border:'1px'}}>
                    <Label basic>Address</Label>
                    <input />
                </Input><br/>
                <Input onChange={(e)=>{setamountTransfer(e.target.value)}} placeholder='Amount' type='number' labelPosition='right' >
                    <Label basic>Amount</Label>
                    <input />
                </Input>
                <div><Button onClick={()=>transfer()} style={{marginTop:'10px'}}>Transfer</Button></div>
            </Segment>
        </Container>
    )
}

export default ERCToken