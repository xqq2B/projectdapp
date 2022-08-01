import React from 'react';
import { useEffect, useState } from 'react';
import { client } from '../lib/sanity';
import { useContext } from 'react';
import { SocialDappContext } from '../context/SocialDappContext';
import Image from 'next/image';
//import TransactionHistory from './TransactionHistory';
import { FiArrowUpRight } from 'react-icons/fi';
import { TiMessages } from 'react-icons/ti'



const ProfileMsg = () => {
    const { isLoading, currentAccount, currentUser } = useContext(SocialDappContext);
    //if (currentUser && currentAccount) {
    const [msgHistory, setMsgHistory] = useState([]);

    useEffect(() => {
        ; (async () => {
            if (!isLoading && currentAccount) {
                const query = `
                    *[_type=="users" && _id == "${currentAccount}"] {
                        "msgList": msg[]->{name, walletAddress, timestamp, toAddress, msg}|order(timestamp asc)[0..4]
                    }
                    `
                const clientRes = await client.fetch(query)
                if(clientRes[0] == null || clientRes[0] == undefined){
                    return null
                }
                setMsgHistory(clientRes[0].msgList)


            }
        })()
    }, [isLoading, currentAccount])

    if (currentUser && currentAccount) {
        return (
            <div>
            {msgHistory &&
            msgHistory?.map((msg, index) => (
                <div key={index} className="p-1  py-5" id='Profile'>
                    <div className="mt-0 text-center pb-1">
                        Mensaje
                        <div className='text-white' >
                            De: {msg.name}<div></div>
                            Wallet: {msg.walletAddress}<div></div>
                            Fecha:
                            {new Date(msg.timestamp).toLocaleString('en-US', {
                                timeZone: 'PST',
                                hour12: true,
                                timeStyle: 'short',
                                dateStyle: 'short',
                            })}<div></div>
                            Contenido: {msg.msg}
                        </div>
                  </div>
                </div>
            ))}
            </div>

        )
    }
}

export default ProfileMsg;