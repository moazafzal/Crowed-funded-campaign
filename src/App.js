import './App.css';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes
} from "react-router-dom";
import Navbar from './components/Navbar';
import CampaignsList from './CampaignsList';
import Campaign from './Campaign';
import { useEffect, useState } from 'react';
import config from './config.json'
import myToken from './abis/MyToken.json'
import CampaignM from './abis/CampaignManager.json'
import { ethers } from 'ethers';
import Alerts from './components/Alert';
import Login from './Login';
import { RequireAuth } from './components/RequireAuth';
import ERCToken from './components/ERCToken';
function App() {
  // const location = useLocation()
  const [alert, setAlert] = useState('null')
  const [account, setAccount] = useState()
  const [accountDetail, setAccountDetail] = useState(null)
  const [MyTokens, setMyTokens] = useState(null)
  const [campaignManager, setCampaignManager] = useState(null)
  const [campaigns, setCampaigns] = useState([])
  const [provider, setprovider] = useState()
  const [tokens, setTokens] = useState(0)

  const showAlert = (message, type) => {
    setAlert({ message: message, type: type })
    setTimeout(() => {
      setAlert('null')
    }, 8000);
  }
  const alertDismiss = () => {
    setAlert('null')
  }
  useEffect(() => {
    loadBlockChainData()
  }, [])
  const toEther = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
  }
  const fromEhter = (n) => {
    return ethers.utils.formatEther(n)
  }
  const loadBlockChainData = async () => {

    const provider = new ethers.providers.Web3Provider(window.ethereum)

    setprovider(provider)
    const network = await provider.getNetwork()
    const signer = provider.getSigner()

    provider.on('error', () => { console.log('provider error') })
    const token = new ethers.Contract(config[network.chainId].myToken.address, myToken.abi, signer)
    const campaign = new ethers.Contract(config[network.chainId].CampaignFactory.address, CampaignM.abi, signer)
    setMyTokens(token)
    setCampaignManager(campaign)
    // console.log(campaign)
    const c = await campaign.getCampaigns()
    setCampaigns(c)

    if (typeof window.ethereum == undefined) {
      showAlert('Please Install MetaMask Wallet', 'error')
    }
    const accounts = await window.ethereum.request({ 'method': 'eth_requestAccounts' })
    setAccountDetail(accounts)
    const acount = ethers.utils.getAddress(accounts[0])
    setAccount(acount)
    window.ethereum.on('disconnect', (error) => { console.log('disconnect error :' + error) })
    window.ethereum.on('accountsChanged', connect)
    window.ethereum.on('chainChanged', async (chainId) => {
      if (chainId != 31337) {
        showAlert('Please Connect To hardhat Wallet', 'warning')
      }
      await loadBlockChainData()
    })
    const balance = await token.balanceOf(acount)
    setTokens(balance.toString())
  }

  const connect = async (acounts) => {
    try {
      if (acounts && acounts.length === 0) {
        setAccount(null)
        setTokens(0)
        // await loadBlockChainData()
      } else {
        if (!window.ethereum.isConnected()) {
          showAlert('wallet not connected')
          setAccount(null)
          setTokens(0)
        }

        const accounts = await window.ethereum.request({ 'method': 'eth_requestAccounts' })
        showAlert('Wallet is Connected', 'success')
        const acount = ethers.utils.getAddress(accounts[0])
        setAccount(acount)
        await loadBlockChainData()
        // console.log('token '+MyTokens)
        // const balance = await MyTokens.balanceOf(acount)
        // setTokens(balance.toString())

        // return <Navigate to='/' replace={true} />
      }
    } catch (err) {
      console.log(err)
      if (err.code === 4001) {
        showAlert(err.message, 'warning')
      }
    }

  }

  const createCampaign = async (newCampaignName) => {
    try {
      const transaction = await campaignManager.createCampaign(newCampaignName)
      await transaction.wait()
      showAlert(`New Campaign is created successfully : ${newCampaignName}`, 'success')
      await loadBlockChainData()
    } catch (error) {
      showAlert(error.message, 'error')
    }

  }

  return (
    <Router>
      <Navbar connect={connect} contractAddress={account} tokens={tokens} />
      <Alerts alertDismiss={alertDismiss} alert={alert} />
      <Routes>
        <Route path='/' element={<RequireAuth address={account}><CampaignsList campaigns={campaigns} createCampaign={createCampaign} /></RequireAuth>}></Route>
        <Route path='Campaign/:address' element={<RequireAuth address={account}><Campaign showAlert={showAlert} blockData={loadBlockChainData} MyToken={MyTokens} provider={provider} account={account} /></RequireAuth>}></Route>
        <Route path='ERCToken' element={<RequireAuth address={account}>
          <ERCToken blockData={loadBlockChainData}  tokens={tokens} account={account} MyToken={MyTokens} />
        </RequireAuth>}>
        </Route>
        <Route path='*' element={<h1>Page Not Found</h1>}></Route>
        <Route path='/login' element={<Login account={account} connect={connect} />}></Route>
      </Routes>
    </Router>
  )
}


export default App;
