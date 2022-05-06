
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
import React, {useState, useEffect} from 'react'



export default function MyBet(props) {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [dataSet, setDataSet] = useState(new Set())
    const [button, setButton] = useState(true)

    const data  = {
        name: props.bet.name,
        amount: parseInt(props.bet.betAmount)/ 1000000000000000000,
        imageURL: props.bet.imageURL,
        betAddress: props.bet.betAddress,
        betID: props.bet.betId,
        endDate: props.bet.endDate
        }
        
      async function setWinner(proOrCon) {
        if (window.ethereum) {
            let accounts = await window.ethereum.request({
              method: 'eth_requestAccounts'
            })
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const contract = new ethers.Contract(props.deployedContract, TriumphABI.abi, signer)   
            if (proOrCon) {
                console.log("sfd")
                console.log(contract.setWinnerTrue(data.betId))
            }
          }
      }

      async function getBetImage(betID) {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const contract = new ethers.Contract(props.deployedContract, TriumphABI.abi, signer)
            console.log("CHECKs")
            console.log(betID)
            const NFTcontr = await contract.getBet(betID)
            return NFTcontr.coverimglink
        }
      }

      async function getBetName(betID) {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const contract = new ethers.Contract(props.deployedContract, TriumphABI.abi, signer)
            console.log("CHECKs")
            console.log(betID)
            const NFTcontr = await contract.getBet(betID)
            return NFTcontr.eventName
        }
      }

      async function claimWinnings() {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const contract = new ethers.Contract(props.deployedContract, TriumphABI.abi, signer)
            
            contract.claimWinnings(data.betID, data.betAddress)
            setButton(false)
        }
      }

      useEffect(() => {
        console.log(data.imageURL)
      }, []);
        
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

          <Flex justifyContent="space-between" alignContent="center" flexDirection='column'>
            <h1> End Date: {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(data.endDate)}</h1>
            <h1> Amount Bet: {data.amount} ETH </h1>
          </Flex>

          <Flex justifyContent="space-between" alignContent="center" style={{marginTop: 10}}>
              {button &&<Button 
            onClick={claimWinnings}
            colorScheme='green'
            >
                Claim Winnings
            </Button>}
            
          </Flex>
          <>
    </>
        </Box>
      </Box>
    </Flex>
  )
}
