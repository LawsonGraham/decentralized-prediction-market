import React, {useState, useEffect} from 'react'
import { ethers, BigNumber } from 'ethers';
import TriumphABI from '../ABI/TriumphABI.json'
import AdminBet from '../components/AdminBet'
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



export default function Admin(props) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [allBets, setAllBets] = useState([])
  const [isLoading, setLoading] = useState(true);


  const createBet = async() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(props.deployedContract, TriumphABI.abi, signer)

      try {
        const repsonse = await contract.newBet(document.getElementById("choice").value, 
        parseInt(document.getElementById("start").value), parseInt(document.getElementById("end").value), 
        parseInt(document.getElementById("yes").value), parseInt(document.getElementById("no").value), 
        document.getElementById("imglink").value, { value: ethers.utils.parseEther("10")})
        console.log(repsonse)
      } catch (err) {
        console.log("ERROR: ", err)
      }
    }
    compileBets()
  }

  const multClick = async() => {
    createBet()
    onClose()
  }

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
      <>
      <Button onClick={onOpen} style={{marginTop: 20, marginLeft: 20}}>Make a New Bet</Button>
      <Button onClick={compileBets} style={{marginTop: 20, marginLeft: 20}}>Update Bets</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader> New Bet </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <input id="choice" type="text" placeholder='Name of Bet'></input>
          <input id="start" type="text" placeholder='Start Time'></input>
          <input id="yes" type="text" placeholder='Yes Odds'></input>
          <input id="end" type="text" placeholder='End Time'></input>
          <input id="no" type="text" placeholder='No Odds'></input>
          <input id="imglink" type="text" placeholder='Cover Image Link'></input>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant='ghost' onClick={multClick}> Create Bet </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>

    <Flex style = {{flexDirection: 'row', justifyContent: 'space-evenly'}}>
          {isLoading ? <h1>loading </h1> :
                    allBets.map((item, index) => (
                    <AdminBet 
                    bet={item}
                    deployedContract={props.deployedContract}
                    key={index}
                    />
                ))}
        </Flex>

    </div>
  )
}
