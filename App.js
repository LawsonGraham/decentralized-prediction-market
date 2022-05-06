import logo from './logo.svg';
import './App.css';
import React, {useEffect, useState} from 'react'
import { ethers, BigNumber } from 'ethers';
import TriumphABI from './ABI/TriumphABI.json'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Home from './views/Home'
import Admin from './views/Admin'
import Profile from './views/Profile'
import AdminCheck from './views/AdminCheck'
import Bet from './components/Bet'
import Header from './layout/Header';
import { Flex } from '@chakra-ui/react'


function App() {
  const deployedContract = "0x4c5859f0F772848b2D91F1D83E2Fe57935348029"

  const [allBets, setAllBets] = useState([])
  const [isLoading, setLoading] = useState(true);

  
  const compileBets = async() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(deployedContract, TriumphABI.abi, signer)
      try {
        let bets = []
        for (let i = 0; i < latestBet; i++) {
          bets.push(await contract.getBet(i))
        }
        setAllBets(bets)
        console.log(bets)
        setLoading(false)
        return await bets
      } catch (err) {
        console.log("ERROR: ", err)
      }
    } else {
      console.log("no web3")
    }
  }

  const [account, setAccount] = useState('')
  const [provider, setProvider] = useState('')
  const [latestBet, setLatestBet] = useState('')
  
  const connectWallet = async() => {
    if (window.ethereum) {
      let accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(deployedContract, TriumphABI.abi, signer)

      setLatestBet(contract.getCurrentId())
      setAccount(accounts[0])
    }
  }
  
  const printBet = async() => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(deployedContract, TriumphABI.abi, signer)
        try {
          console.log(contract.getBet(0))
        } catch (err) {
          console.log("ERROR: ", err)
        }
      } else {
        console.log("no web3")
      }
    }
    const [isAdmin, setIsAdmin] = useState(false);

    async function checkAdmin() {
      if (window.ethereum) {
        let accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        })
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(deployedContract, TriumphABI.abi, signer)
      if (await contract.checkOwner()) {
        setIsAdmin(true)
      }
    }
  }

  useEffect(() => {
    checkAdmin()
    async function setLatestBetInit() {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(deployedContract, TriumphABI.abi, signer)
    
        try {
          setLatestBet(await contract.getCurrentId())
        } catch (err) {
          console.log("error loading app", err)
        }
      }
    }
    setLatestBetInit()
  }, []);

  
  return (
    <div>
      <Router>
        <Header deployedContract={deployedContract} />
        <Switch>
          <Route path={"/home"} bets={allBets}>
            <Home 
              deployedContract={deployedContract}
              latestBet={latestBet}
              />
          </Route>

          <Route path={"/admin"} exact>
            { isAdmin && 
            <Admin 
            deployedContract={deployedContract}
            latestBet={latestBet}
            />}
          </Route>

          <Route path={"/profile"}>
            <Profile 
            deployedContract={deployedContract}
            latestBet={latestBet}
            />
          </Route>
          
        </Switch>
      </Router>
      
    </div>
  );
}

export default App;
