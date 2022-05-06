import React, {useState, useEffect} from 'react'
import { ethers, BigNumber } from 'ethers';
import TriumphABI from '../ABI/TriumphABI.json'
import BetNFTABI from '../ABI/BetNFTABI.json'
import MyBet from '../components/MyBet'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Flex
} from '@chakra-ui/react'
export default function Profile(props) {

  const [dataSet, setDataSet] = useState(new Set())
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const getMyBets = async() => {
    if (window.ethereum) {
      let accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(props.deployedContract, TriumphABI.abi, signer)
    
      let bets = await contract.getAllNFTs()

      for (let i = 0; i < bets.length; i++) {
        let NFT = await new ethers.Contract(bets[i], BetNFTABI.abi, signer)
        let NFTOwner = await NFT.getOwner()       
        console.log('checks')
        if (NFTOwner.toLowerCase()== accounts[0].toLowerCase() && !dataSet.has(bets[i])) {
            let ds = dataSet
            ds.add(bets[i])
            setDataSet(ds)
            let d = data
            d.push(
              {
                betAddress: bets[i],
                betAmount: parseInt(await NFT.getShares()),
                betId: parseInt(await NFT.getID()),
                name: await NFT.getImgUrl(),
                imageURL: await NFT.getName(),
                endDate: parseInt(await NFT.getEndDate())
              }
            )            
            setData(d)
            console.log(data[0].betAmount)   
            console.log(dataSet)
        }
    }
    setLoading(false)
  }
}

  useEffect(() => {
    getMyBets()
  }, [dataSet]);

  return (
    <div>
      <h1 style={{fontSize: 28, marginTop: 40, marginLeft: 40}}>My Bets:</h1>
      <Flex style = {{flexDirection: 'row', justifyContent: 'spaMyvenly'}}>
          {isLoading ? <h1>loading </h1> :
                    data.map((item, index) => (
                    <MyBet 
                    bet={item}
                    deployedContract={props.deployedContract}
                    key={index}
                    />
                ))}
        </Flex>
    </div> 
  )
}
