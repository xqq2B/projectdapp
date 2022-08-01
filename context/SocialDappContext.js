import { useState, createContext, useEffect } from "react";
import { faker } from "@faker-js/faker";
import {useMoralis} from "react-moralis";
import {SOCIAL_DAPP_ADDRESS, SOCIAL_DAPP_ABI} from "../lib/constants";
import { ethers } from "ethers";
import {client} from "../lib/sanity";
import { useRouter } from "next/router";


export const SocialDappContext = createContext();

let eth;
if (typeof window !== 'undefined') {
 eth = window.ethereum;
}


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

  const router = useRouter();


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
        //requestToCreateUserProfile(address)//, faker.name.findName())// name random or real
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
        //console.log('connecting to wallet')
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
    setCurrentAccount('');
    //////isAuthenticated = true;
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

  // const requestToCreateUserProfile = async (walletAddress/*, name*/) => {
  //   try {
  //     await fetch(`/api/createUser`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         userWalletAddress: walletAddress,
  //         //name: name,
  //       }),
  //     })
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

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
      const { addressTo, amount } = formData;
      const socialdappERC721Contract = getEthereumContract();


      const parsedAmount = ethers.utils.parseEther(amount)

      const txHashMain = await metamask.request({
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
        
    await transactionHash.wait();
   
    //db
    await saveTransaction(
      txHashMain,
      transactionHash.hash,
      amount,
      connectedAccount,
      addressTo,
    )

    setIsLoading(false)
  } catch (error) {
    console.log(error)
  }
}
////////////sendMsg$$$/////////////////
const sendTransactionMsg = async (
  metamask = eth,
  connectedAccount = currentAccount,
) => {
  try {
    const DEPLOYED_CONTRACT='0xA8F519d37042d3033010460a3D0767E9a422b602';
    const ASSETS_CONTRACT='0xE39082d3c341A8d5D89e849b12D61D918c7Cd120';
    //console.log('deployed contract', DEPLOYED_CONTRACT)
      if(!metamask) return alert ('Metamask needed visit tutorials')
      const { addressTo, amount } = formData;
      const socialdappERC721Contract = getEthereumContract();
      const amountEarn = '0x7EF40'; // 520000 Gwei

      const txHashMain = await metamask.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: connectedAccount,
            to: ASSETS_CONTRACT,//addressTo,//DEPLOYED_CONTRACT,
            gas: '0x7EF40', // 520000 Gwei
            value: amountEarn,
          },
        ],
      })


      const transactionHash = await socialdappERC721Contract.publishTransaction(
        DEPLOYED_CONTRACT,
        amountEarn,
        `Transferring ETH ${amountEarn} to ${DEPLOYED_CONTRACT}`,
        'TRANSFER',
      )

    setIsLoading(true)
        
    await transactionHash.wait();
   
    //db from msg not need to be saved
    // await saveTransaction(
    //   txHashMain,
    //   transactionHash.hash,
    //   amountEarn,
    //   connectedAccount,
    //   DEPLOYED_CONTRACT,
    // )

    setIsLoading(false)
  } catch (error) {
    console.log(error)
  }
}

//////////////////////////

const handleChange = (e, name) => {
  setFormData(prevState => ({ ...prevState, [name]: e.target.value }))
}
//////////////////////////////////////////////////

const saveTransaction = async (
  txHashMain,
  transactionHash,
  amount,
  fromAddress = currentAccount,
  toAddress,
) => {
  const txDoc = {
    _type: 'transactions',
    _id: txHashMain,
    fromAddress: fromAddress,
    toAddress: toAddress,
    timestamp: new Date(Date.now()).toISOString(),
    txHashMain: txHashMain,
    transactionHash: transactionHash,
    amount: parseFloat(amount),
  }

  await client.createIfNotExists(txDoc);

  await client
    .patch(currentAccount)
    .setIfMissing({ transactions: [] })
    .insert('after', 'transactions[-1]', [
      {
        _key: txHashMain,
        _ref: txHashMain,
        _type: 'reference',
      },
    ])
    .commit()

  return
}
///////////msgs///////////////////////////////  
const saveMessage = async (
  name,
  walletAddress,
  msg,
  addressTo
) => {
  const ids= Math.floor(Math.random()*100000000).toString();
  const txDoc = {
    _type: 'msg',
    _id: ids,//id,key and ref are same, patch is targeting msg account
    name: name,
    walletAddress: walletAddress,
    msg: msg,
    timestamp: new Date(Date.now()).toISOString(),
    toAddress: addressTo//cardsData[0].walletAddress,
    //profileImage: profileImage,
  }
  await client.createIfNotExists(txDoc);

  await client
  .patch(addressTo)
  .setIfMissing({ msg: [] })
  .insert('after', 'msg[-1]', [
    {
      _key: ids,
      _ref: ids,
      _type: 'reference',
    },
  ])
  .commit()

return
}


//////////////////////////////

useEffect(() => {
  if (isLoading) {
    router.push(`/?loading=${currentAccount}`)
  } else {
    router.push(`/`)
  }
}, [isLoading])


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
        isLoading,

        saveMessage,
        isAuthenticated,
        sendTransactionMsg,
      }}
    >
      {children}
    </SocialDappContext.Provider>
  )
}