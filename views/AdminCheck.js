import {
    Flex,
    Box,
    Stack,
    Link,
    Button,
    Heading,
    Text,
    useColorModeValue,
  } from '@chakra-ui/react';
  import { ethers, BigNumber } from 'ethers';
  import TriumphABI from '../ABI/TriumphABI.json'

  
  export default function AdminCheck(props) {

    const connectWallet = async() => {
        if (window.ethereum) {
          let accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
          })
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const signer = provider.getSigner()
          const contract = new ethers.Contract(props.deployedContract, TriumphABI.abi, signer)
          console.log("foo")
          this.history.push('/admin')
          if (await contract.checkOwner() == accounts[0]) {
            this.history.push('/admin')

          }
        }
      }


    return (
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'} textAlign='center'> Confirm That You Have Permissions To Create Bets on Triumph</Heading>
            <Text fontSize={'lg'} color={'gray.600'}>
              to enjoy all of our cool <Link color={'blue.400'}>features</Link> ✌️
            </Text>
          </Stack>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}>
            <Stack spacing={4}>
              <Stack spacing={10}>
                <Button
                  bg={'blue.400'}
                  onClick={connectWallet}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}>
                  Confirm My Address
                </Button>
            
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    );
  }
