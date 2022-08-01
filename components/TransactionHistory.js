import { useEffect, useState } from 'react';
import { client } from '../lib/sanity';
import { useContext } from 'react';
import { SocialDappContext } from '../context/SocialDappContext';
import Image from 'next/image';
import ethLogo from '../assets/logo.png';
import { FiArrowUpRight } from 'react-icons/fi';

const style = {
  wrapper: `text-white select-none  w-screen flex-1 pt-14 flex items-end justify-center pb-12 px-8 `,
  txHistoryItem: `bg-gradient-to-r from-black to-blue-500 rounded-lg px-4 py-2 my-2 flex items-center justify-end`,
  txDetails: `flex items-center`,
  toAddress: `text-[#f48706] mx-2`,
  txTimestamp: `mx-2`,
  etherscanLink: `flex items-center text-[#2172e5]`,
}

const TransactionHistory = () => {
  const { isLoading, currentAccount, currentUser } = useContext(SocialDappContext);
  // if (currentAccount && currentUser) {
  const [transactionHistory, setTransactionHistory] = useState([]);

  useEffect(() => {
    ;(async () => {
      if (!isLoading && currentAccount) {
        const query = `
          *[_type=="users" && _id == "${currentAccount}"] {
            "transactionList": transactions[]->{amount, toAddress, timestamp, txHashMain, transactionHash}|order(timestamp desc)[0..4]
          }
        `

        const clientRes = await client.fetch(query)
        if(clientRes[0] == null || clientRes[0] == undefined){
          return null
      }
        setTransactionHistory(clientRes[0].transactionList)
      }
    })()
  }, [isLoading, currentAccount])
  
  if (currentAccount && currentUser) {
  return (
    <div className={style.wrapper}>
      <div>
        {transactionHistory &&
          transactionHistory?.map((transaction, index) => (
            <div className={style.txHistoryItem} key={index}>
              <div className={style.txDetails}>
                {transaction.amount} ETH  enviados a{' '}
                <span className={style.toAddress}>
                  {transaction.toAddress.substring(0, 6)}...
                </span>
              </div>{' '}
              el{' '}
              <div className={style.txTimestamp}>
                {new Date(transaction.timestamp).toLocaleString('en-US', {
                  timeZone: 'PST',
                  hour12: true,
                  timeStyle: 'short',
                  dateStyle: 'short',
                })}
              </div>
              <div className={style.etherscanLink}>
                <a
                  href={`https://goerli.etherscan.io/tx/${transaction.txHashMain}`}
                  target='_blank'
                  rel='noreferrer'
                  className={style.etherscanLink}
                >
                  Ver en Etherscan
                  <FiArrowUpRight />
                </a>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
              }
}

export default TransactionHistory;