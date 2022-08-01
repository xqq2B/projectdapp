import React from 'react';
import { useEffect, useState } from 'react';
import { client } from '../lib/sanity';
import { useContext } from 'react';
import { SocialDappContext } from '../context/SocialDappContext';
import Image from 'next/image';
import { FcLike } from 'react-icons/fc';

import ProfileMsg from "../components/ProfileMsg";
import ProfileTx from "../components/ProfileTx";


const Profile = () => {
    const { isLoading, currentAccount, currentUser } = useContext(SocialDappContext);
    //if (currentAccount && currentUser) {
    const [likeHistory, setLikeHistory] = useState([]);


    useEffect(() => {
        ; (async () => {
            if (!isLoading && currentAccount) {
                const query2 = `
                    *[_type=="users" && _id == "${currentAccount}"] {
                        "likeList": likes[]->{_ref}
                    }
                    `
                const clientRes = await client.fetch(query2)

                if (clientRes[0] == null || clientRes[0] == undefined) {
                    return null
                }
                setLikeHistory(clientRes[0].likeList)


            }
        })()
    }, [currentAccount])

    if (currentAccount && currentUser) {
        return (
            <div className="pt-10 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 w-[40rem] rounded-2xl p-4" id='Profile'>

                <div className="relative ">
                    <img className='w-50 h-48  mx-auto rounded-full shadow-2xl  inset-x-0 top-0 -mt-2 flex items-center justify-center ' src={currentUser.imageUrl} />

                </div>
                <div className="mt-10 text-center pb-5 text-white">
                    <h1 className="text-4xl font-medium ">{currentUser.name}</h1>
                    <p className="font-light mt-3">Wallet Address: {currentUser.walletAddress}</p>

                    <p className="mt-8 ">Likes Recibidos {!likeHistory ? (
                        <span>0</span>
                    ) : (likeHistory.length)} </p>
                    <br></br>    <br></br>
                    <ProfileTx />
                    <br></br> <br></br>
                    <ProfileMsg />
                </div>
            </div>
        )


    }
}

export default Profile;