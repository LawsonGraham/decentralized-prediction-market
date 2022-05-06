import React from 'react'

import {
    Flex,
    Circle,
    Box,
    Image,
    Badge,
    useColorModeValue,
    Icon,
    chakra,
    Tooltip,
    Button,
    Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  } from '@chakra-ui/react';
import { ethers, BigNumber } from 'ethers';
import TriumphABI from '../ABI/TriumphABI.json'


export default function Bet(props) {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const data = {
        startTime: parseInt(props.bet.startTime),
        endTime: parseInt(props.bet.endTime),
        imageURL: props.bet.coverimglink,
        name: props.bet.eventName,
        betId: props.bet.id,
      };

      async function makeABet(proOrCon) {
        if (window.ethereum) {
            let accounts = await window.ethereum.request({
              method: 'eth_requestAccounts'
            })
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const contract = new ethers.Contract(props.deployedContract, TriumphABI.abi, signer)
            console.log(ethers.utils.parseEther(document.getElementById("amount").value))
            

            contract.makeBet(proOrCon, parseInt(data.betId), { value: ethers.utils.parseEther(document.getElementById("amount").value)})
          }
      }
        
      async function setWinner(proOrCon) {
      }


  return (
    <Flex p={50} w="full" alignItems="center" justifyContent="center">
      <Box
        bg={useColorModeValue('white', 'gray.800')}
        maxW="500"
        borderWidth="1px"
        rounded="lg"
        shadow="lg"
        position="relative">
        {data.isNew && (
          <Circle
            size="10px"
            position="absolute"
            top={2}
            right={2}
            bg="red.200"
          />
        )}

        <Image
          src={data.imageURL}
          alt={`Picture of ${data.name}`}
          roundedTop="lg"
        />

        <Box p="6">
          <Flex mt="1" justifyContent="space-between" alignContent="center">
            <Box
              fontSize="2xl"
              fontWeight="semibold"
              as="h4"
              lineHeight="tight"
              >
              {data.name}
            </Box>
            <Tooltip
              label="Add to cart"
              bg="white"
              placement={'top'}
              color={'gray.800'}
              fontSize={'1.2em'}>
              <chakra.a href={'#'} display={'flex'}>
              </chakra.a>
            </Tooltip>
          </Flex>

          <Flex justifyContent="space-between" alignContent="center">
            <h1> Start Date: {data.startTime}</h1>
            <h1> End Date: {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(1651728664)}</h1>
          </Flex>

          <Flex justifyContent="space-between" alignContent="center" style={{marginTop: 10}}>
            <Button 
            onClick={onOpen}
            colorScheme='red'
            >
                Bet No
            </Button>

            <Button 
            onClick={onOpen}
            colorScheme='green'
            >
                Bet Yes
            </Button>
          </Flex>
          <>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{data.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <h1>How much would you like to bet?</h1>
            <input id="amount" type="text" placeholder='Amount in Ether'></input>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant='ghost' onClick={makeABet}> Make Bet </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
        </Box>
      </Box>
    </Flex>
  )
}
