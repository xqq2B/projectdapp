import { useState, createContext, useEffect } from "react";
import { faker } from "@faker-js/faker";
import {useMoralis} from "react-moralis";
import {SOCIAL_DAPP_ADDRESS, SOCIAL_DAPP_ABI} from "../lib/constants";
import { ethers } from "ethers";

//import{client} from "../lib/sanityClient";
//import { useRouter } from "next/router";

export const SocialDappContext = createContext();

let eth;
if (typeof window !== 'undefined') {
 eth = window.ethereum;
}


//////////////swap//////////////////////
const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const Social_Dapp_Contract = new ethers.Contract(
    SOCIAL_DAPP_ADDRESS,
    SOCIAL_DAPP_ABI,
    signer,
  )

  return Social_Dapp_Contract;
}
///////////////////////////////////////
export const SocialDappProvider = ({ children }) => {
  const { authenticate, isAuthenticated, user, Moralis } = useMoralis()
  const [cardsData, setCardsData] = useState([])
  const [currentAccount, setCurrentAccount] = useState()
  const [currentUser, setCurrentUser] = useState()

  const[isLoading, setIsLoading] = useState(false)
  const[formData, setFormData] = useState({
    addressTo:'',
    amount:'',
  })

  useEffect(() => {
    checkWalletConnection()

    if (isAuthenticated) {
      requestUsersData(user.get('ethAddress'))
      requestCurrentUserData(user.get('ethAddress'))
    }
  }, [isAuthenticated])

  const checkWalletConnection = async () => {
    try{
      if (typeof window !== 'undefined') {
        if(!window.ethereum) return alert ('Metamask needed visit tutorials')
      }
      if (isAuthenticated) {
        const address = user.get('ethAddress')
        setCurrentAccount(address)
        requestToCreateUserProfile(address, faker.name.findName())// name random or real
      } else {
        setCurrentAccount('')
      }
    } catch(e) {
      console.log(e)
      throw new Error('No eth obj')
    }
    
  }

  const connectWallet = async () => {

    if (!isAuthenticated || !currentAccount) {
      try {
        console.log('connecting to wallet')
        await authenticate({
          signingMessage: 'Log in using Moralis',
        })
      } catch (error) {
        console.error(error)
        throw new Error('No eth object')
      }
    }
  }

  const disconnectWallet = async () => {
    await Moralis.User.logOut()
    setCurrentAccount('')  
  }

  const handleRightSwipe = async (cardData, currentUserAddress) => {
    const likeData = {
      likedUser: cardData.walletAddress,
      currentUser: currentUserAddress,
    }

    try {
      await fetch('/api/saveLike', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(likeData),
      })

      const response = await fetch('/api/checkMatches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(likeData),
      })

      const responseData = await response.json()

      const matchStatus = responseData.data.isMatch

      if (matchStatus) {
        console.log('match')

        const mintData = {
          walletAddresses: [cardData.walletAddress, currentUserAddress],
          names: [cardData.name, currentUser.name],
        }

        await fetch('/api/mintMatchNft', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mintData),
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  const requestToCreateUserProfile = async (walletAddress, name) => {
    try {
      await fetch(`/api/createUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userWalletAddress: walletAddress,
          name: name,
        }),
      })
    } catch (error) {
      console.error(error)
    }
  }

  const requestCurrentUserData = async walletAddress => {
    try {
      const response = await fetch(
        `/api/fetchCurrentUserData?activeAccount=${walletAddress}`,
      )
      const data = await response.json()

      setCurrentUser(data.data)
    } catch (error) {
      console.error(error)
    }
  }

  const requestUsersData = async activeAccount => {
    try {
      const response = await fetch(
        `/api/fetchUsers?activeAccount=${activeAccount}`,
      )
      const data = await response.json()

      setCardsData(data.data)
    } catch (error) {
      console.error(error)
    }
  }

/////////////////////swap////////////////////////

const sendTransaction = async (
  metamask = eth,
  connectedAccount = currentAccount,
) => {
  try {
      if(!metamask) return alert ('Metamask needed visit tutorials')
      const { addressTo, amount } = formData///data_
      const socialdappERC721Contract = getEthereumContract();

      console.log('Testing: ',socialdappERC721Contract)

      const parsedAmount = ethers.utils.parseEther(amount)

      await metamask.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: connectedAccount,
            to: addressTo,
            gas: '0x7EF40', // 520000 Gwei
            value: parsedAmount._hex,
          },
        ],
      })

      const transactionHash = await socialdappERC721Contract.publishTransaction(
        addressTo,
        parsedAmount,
        `Transferring ETH ${parsedAmount} to ${addressTo}`,
        'TRANSFER',
      )

    setIsLoading(true)

    await transactionHash.wait()

    //db
    // await saveTransaction(
    //   transactionHash.hash,
    //   amount,
    //   connectedAccount,
    //   addressTo,
    // )

    setIsLoading(false)
  } catch (error) {
    console.log(error)
  }
}

const handleChange = (e, name) => {
  setFormData(prevState => ({ ...prevState, [name]: e.target.value }))
}
//////////////////////////////////////////////////






  return (
    <SocialDappContext.Provider
      value={{
        connectWallet,
        disconnectWallet,
        cardsData,
        handleRightSwipe,
        currentAccount,
        currentUser,
        sendTransaction,
        handleChange,
        formData,
      }}
    >
      {children}
    </SocialDappContext.Provider>
  )
}