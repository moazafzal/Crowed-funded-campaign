import { ethers } from 'ethers'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Container, Divider, Grid, Header, Icon, Input, Item, Label, LabelDetail, Loader, Segment, Step } from 'semantic-ui-react'
import CampaignAbi from './abis/CrowedCampaign.json'
const Campaign = (props) => {
    const param = useParams()
    const [campaign, setCampaign] = useState(null)
    const [goal, setGoal] = useState(null)
    const [funds, setFunds] = useState(null)
    const [goals, setGoals] = useState(0)
    const [loadingOnSetGoal, setloadingOnSetGoal] = useState(false)
    const [step1, setStep1] = useState(false)
    const [step2, setStep2] = useState(false)
    const [step3, setStep3] = useState(false)
    const [loading, setloading] = useState(false)
    const [balance, setbalance] = useState(0)
    const [pledgedAmount, setPledgedAmount] = useState(0)
    const [goalReached, setgoalReached] = useState(false)
    const [withdrawFund, setWithdrawFund] = useState(null)
    const [withdrawFundLoading, setWithdrawFundLoading] = useState(false)
    const [refundProcess, setrefundProcess] = useState(false)
    const [campaignOwner, setCampaignOwner] = useState(null)
    const [newOwner, setNewOwner] = useState(null)
    useEffect(() => {
        loadBlockChainData()
    }, [])

    const loadBlockChainData = async () => {
        const signer = props.provider.getSigner()
        const campaign = new ethers.Contract(param.address, CampaignAbi.abi, signer)
        setCampaign(campaign)
        setCampaignOwner(await campaign.owner())
        const g = await campaign.goals(0)
        setGoals(g.toString())

        window.ethereum.on('accountsChanged', async () => {
            const accounts = await window.ethereum.request({ 'method': 'eth_requestAccounts' })
            await loadBlockChainData()
        })
        setbalance((await campaign.balances(props.account)).toString())
        setPledgedAmount((await campaign.getPledgedAmount()).toString())
        setgoalReached(await campaign.goalReached())
        setloading(false)
    }
    const handleGoal = async () => {
        setloadingOnSetGoal(true)
        const transaction = await campaign.setGoals([goal])
        await transaction.wait()
        await loadBlockChainData()
        await props.blockData()
        setloadingOnSetGoal(false)
    }
    const handlePledge = async () => {
        let transaction = await props.MyToken.transfer(campaign.address, funds)
        await transaction.wait()
        setStep1(true)
        transaction = await props.MyToken.approve(campaign.address, funds)
        await transaction.wait()
        setStep2(true)
        transaction = await campaign.deposit(funds)
        transaction.wait()
        setStep3(true)
        await loadBlockChainData()
        await props.blockData()
        setStep1(false)
        setStep2(false)
        setStep3(false)
    }
    const withdrawFunds = async () => {
        setWithdrawFundLoading(true)

        const transaction = await campaign.withdraw(withdrawFund)
        transaction.wait()
        await loadBlockChainData()
        setWithdrawFundLoading(false)
        setWithdrawFund(null)
    }
    const handleRefund = async () => {
        setrefundProcess(true)
        const transaction = await campaign.refund()
        await transaction.wait()
        await loadBlockChainData()
        setrefundProcess(false)
    }
    const handleChangeOwner = async()=>{
        const transaction = await campaign.changeOwner(newOwner)
        await transaction.wait()

        await loadBlockChainData()
    }
    return (
        <Container>
            <Segment style={{ marginTop: '20px' }}>
                <Item.Group>

                    <Item>
                        <Item.Content>
                            <Item.Header>Funding Goals</Item.Header>
                            <Item.Meta>{goals}Eth</Item.Meta>
                        </Item.Content>
                    </Item>
                    <Item>
                        <Item.Content>
                            <Item.Header>My Balance {campaignOwner}</Item.Header>
                            <Item.Meta>{balance}Eth</Item.Meta>
                        </Item.Content>
                    </Item>
                    <Item>
                        <Item.Content>
                            <Item.Header>Total Pleged Amount</Item.Header>
                            <Item.Meta>{pledgedAmount}Eth</Item.Meta>
                        </Item.Content>
                    </Item>
                    <Item>
                        <Item.Content>
                            <Item.Header>Goal Reached </Item.Header>
                            {goalReached ? <Item.Meta>{goalReached ? <>
                                <Input error={withdrawFund > balance} onChange={(e) => { setWithdrawFund(e.target.value) }} label={<Button disabled={withdrawFund > balance} loading={withdrawFundLoading} onClick={() => { withdrawFunds() }}>Withdraw</Button>} action={{ icon: 'ethereum' }} labelPosition='right' placeholder='Withdraw funds' type='number' />
                            </> : <span>No</span>}</Item.Meta> :
                                <Item.Meta><Button onClick={handleRefund} loading={refundProcess}>Refund Your Amount</Button></Item.Meta>}
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>

            {campaignOwner == props.account  ? goals == 0  && <Segment style={{ marginTop: '20px' }}>
                <Header>Set Goals</Header>
                <Input name='goal' onChange={(e) => { setGoal(e.target.value) }} labelPosition='right' type='number' placeholder='Amount'>
                    <Label basic>Amount
                    </Label>
                    <input />
                    <Label><Icon name='ethereum'></Icon></Label>
                </Input>
                <div style={{ marginTop: '10px' }}>
                    <Button loading={loadingOnSetGoal} onClick={() => { handleGoal() }} type='submit' primary>Submit Goal</Button></div>
            </Segment> : <Segment><Header>Only Owner of Campaign Set Goals</Header></Segment>}
            
            
            {campaignOwner == props.account && <Segment>
                <Header>Change the owner of Campaign</Header>
                <Input type='text' onChange={(e) => { setNewOwner(e.target.value) }} placeholder='New Owner Address' labelPosition='right'>
                    <Label basic>New Owner Address</Label>
                    <input/>
                    <Label style={{cursor:'pointer'}} onClick={()=>{handleChangeOwner()}} as='button'>Submit</Label>
                </Input>
            </Segment>}


            {goals!=0&&<Segment>
                <Header>Pledge your Funds</Header>
                <Step.Group ordered>
                    <Step active={!step1} completed={step1}>
                        <Step.Content>
                            <Step.Title>Amount</Step.Title>
                            <Step.Description>Submit Amount For Pledge</Step.Description>
                        </Step.Content>
                    </Step>

                    <Step completed={step2} active={!step2 && step1}>
                        <Step.Content>
                            <Step.Title>Approve</Step.Title>
                            <Step.Description>Approve ERC20 Token</Step.Description>
                        </Step.Content>
                    </Step>

                    <Step completed={step3} active={!step3 && step1 && step2}>
                        <Step.Content>
                            <Step.Title>Confirm Order</Step.Title>
                        </Step.Content>
                    </Step>
                </Step.Group>
                <br />
                <Input name='goal' onChange={(e) => { setFunds(e.target.value) }} labelPosition='right' type='number' placeholder='Amount'>
                    <Label basic>Amount
                    </Label>
                    <input />
                    <Label><Icon name='ethereum'></Icon></Label>
                </Input>
                <div style={{ marginTop: '10px' }}><Button onClick={() => { handlePledge() }} type='submit' primary>Submit</Button></div>
            </Segment>}
        </Container>

    )
}

export default Campaign