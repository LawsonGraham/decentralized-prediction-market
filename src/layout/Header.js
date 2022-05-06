import React, {useEffect, useState} from 'react'
import { Flex, Button, Container, Image } from '@chakra-ui/react'
import { NavLink } from 'react-router-dom'
import { ethers, BigNumber } from 'ethers';
import TriumphABI from '../ABI/TriumphABI.json'
import { render } from '@testing-library/react';


const navbar = [
    {
        "name": "Home",
        "href": "/home"
    },
    {
      "name": "My Bets",
      "href": "/profile"
    },
    {
        "name": "Admin",
        "href": "/admin"
    }
]

export default function Header(props) {
    const [account, setAccount] = useState('')
    const [contract, setContract] = useState('')
    const [admin, isAdmin] = useState('')


    const connectWallet = async() => {
        if (window.ethereum) {
          let accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
          })
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const signer = provider.getSigner()
          const contract = new ethers.Contract(props.deployedContract, TriumphABI.abi, signer)
          isAdmin(false)
          setAccount(accounts[0])
        }
      }


      useEffect(() => {
        // Update the document title using the browser API
        async function setContr() {
          if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const contract = new ethers.Contract(props.deployedContract, TriumphABI.abi, signer)
            await isAdmin(contract.checkOwner())
            console.log(admin)
            await setContract(contract)
          }
        }
        setContr()
      }, []);
  return (
    <div>
        <Flex style = {{flexDirection: 'row', marginTop: 20}}>
          <Image style = {{height: 54, marginLeft: 20, marginRight: 20}} src="https://cdn.discordapp.com/attachments/884968416358834266/971890586523156560/Group_113_1.svg"/>
            {navbar.map((item, index) => (
                <NavLink
                    className="headerlink-title"
                    to={item.href}
                    style={{fontSize: 28, marginLeft: 30, marginTop: 5}}
                    key={index}
                >
                    {item.name}
                </NavLink>
            ))}
            <Flex style={{flexDirection:'column'}} >
                <Button onClick={connectWallet} style={{maxWidth: 200, position: "absolute", right: 20}}> Connect Account </Button>
                <h1 style={{marginTop: 42, position: "absolute", right: 20}}>Account: {account}</h1>
            </Flex>            
        </Flex>
       
    </div>
  );
}

