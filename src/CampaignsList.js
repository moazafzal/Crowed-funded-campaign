import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Container, Divider, Grid, Header, Icon, Input, Item, Label, LabelDetail, List, Loader, Segment, Step } from 'semantic-ui-react'

function CampaignsList(props) {
  const [newCampaignName, setNewCampaignName] = useState()
  const [loadingOnSetCampaign, setLoadingOnSetCampaign] = useState(false)
  return (
    <>
    <Container>
      <Segment style={{ marginTop: 10 }}>
        <Header>Create New Campaign</Header>
        <Input name='goal' onChange={(e) => { setNewCampaignName(e.target.value) }} labelPosition='right' type='text' placeholder='Enter Name'>
          <Label basic>Name
          </Label>
          <input />
          <Label><Icon name='ethereum'></Icon></Label>
        </Input>
        <div style={{ marginTop: '10px' }}>
          <Button loading={loadingOnSetCampaign} onClick={() => { props.createCampaign(newCampaignName) }} type='submit' primary>Add Campaign</Button></div>

      </Segment>
      <Segment>
        <Header>Campaigns List</Header>
        <List divided relaxed animated size='big' selection>
          {
            props.campaigns.map((e,index) => {
              return <List.Item key={index} onClick={()=>{}} style={{marginTop:10}}>
                <List.Content>
                  <List.Header as='h2'><Link style={{textTransform:'uppercase'}} to={`/campaign/${e.campaign}`} >{e.name}</Link></List.Header>
                  <List.Description as='p'>{e.campaign}</List.Description>
                </List.Content>
              </List.Item>
            })
          }

        </List>
      </Segment>
    </Container>
    </>
  )
}

export default CampaignsList