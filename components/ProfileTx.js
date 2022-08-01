import React from 'react';
import { useEffect, useState } from 'react';
import { client } from '../lib/sanity';
import { useContext } from 'react';
import { SocialDappContext } from '../context/SocialDappContext';
import Image from 'next/image';
import TransactionHistory from './TransactionHistory';
import { FiArrowUpRight } from 'react-icons/fi';



const ProfileTx = () => {
    const { isLoading, currentAccount, currentUser } = useContext(SocialDappContext);
    //if (currentUser && currentAccount) {
        const [transactionHistory, setTransactionHistory] = useState([]);
        

        useEffect(() => {
            ; (async () => {
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
        
        if (currentUser && currentAccount) {
        return (


            transactionHistory?.map((transaction, index) => (
                <div key={index} className="p-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500" id='Profile'>
                    <div className="mt-0 text-center pb-1">
                        Transacción
                        <div className='text-white' >     
                        {transaction.amount} ETH enviados a{' '}                        
                            {transaction.toAddress}{' '} el{' '}
                            {new Date(transaction.timestamp).toLocaleString('en-US', {
                            timeZone: 'PST',
                            hour12: true,
                            timeStyle: 'short',
                            dateStyle: 'short',
                        })}
                    </div>
                    <a
                  href={`https://goerli.etherscan.io/tx/${transaction.txHashMain}`}
                  target='_blank'
                  rel='noreferrer'
                >
                  <p className='underline-offset-auto-1'>Ver en Etherscan</p>
                </a>
                    </div>
                </div>
            ))

        )
    }
}

export default ProfileTx;