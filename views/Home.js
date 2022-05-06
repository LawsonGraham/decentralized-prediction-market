import React, {useEffect, useState} from 'react'
import { ethers, BigNumber } from 'ethers';
import TriumphABI from '../ABI/TriumphABI.json'
import Bet from '../components/Bet'
import { Flex } from '@chakra-ui/react'
import { NavLink } from 'react-router-dom'



export default function Home(props) {
  const [allBets, setAllBets] = useState([])
  const [isLoading, setLoading] = useState(true);

  
  const compileBets = async() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(props.deployedContract, TriumphABI.abi, signer)
      try {
        let bets = []
        for (let i = 0; i < props.latestBet; i++) {
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
  useEffect(() => {
    compileBets()
  }, [allBets]);

  return (
    <div>
        <h1 style={{fontSize: 28, marginTop: 40, marginLeft: 40}}>Live Bets:</h1>
        <Flex style = {{flexDirection: 'row', justifyContent: 'space-evenly'}}>
          {isLoading ? <h1>loading </h1> :
                    allBets.map((item, index) => (
                    <Bet 
                    bet={item}
                    deployedContract={props.deployedContract}
                    key={index}
                    />
                ))}
        </Flex>
    </div>
  )
}
