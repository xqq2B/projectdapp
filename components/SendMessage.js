import Image from 'next/image'
import { RiSettings3Fill } from 'react-icons/ri'
import { AiOutlineDown } from 'react-icons/ai'
import ethLogo from '../assets/logo.png' //'../assets/eth.png'
import { useContext } from 'react'
import { SocialDappContext } from '../context/SocialDappContext'
import Modal from 'react-modal'
import { useRouter } from 'next/router'
import TransactionLoader from './TransactionLoader'
import { TiMessages } from 'react-icons/ti'


Modal.setAppElement('#__next')

const style = {
  wrapper: ` `,
  content: `bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 w-[40rem] rounded-2xl p-4`,
  formHeader: `px-4 text-white flex items-center justify-center font-semibold text-xl`,
  transferPropContainer: `bg-gray-300 my-3 rounded-2xl p-6 text-3xl  border border-[#20242A] hover:border-[#41444F]  flex justify-between`,
  transferPropInput: `bg-transparent placeholder:text-[#B2B9D2] outline-none mb-6 w-full text-2xl`,
  currencySelector: `flex w-2/5`,
  currencySelectorContent: `w-full h-min flex justify-between items-center rounded-2xl text-xl font-semibold cursor-pointer p-1`,
  confirmButton: `bg-[#2172E5] my-2 rounded-2xl py-6 px-8 text-xl font-semibold flex items-center justify-center cursor-pointer border border-[#2172E5] hover:border-[#234169] hover:bg-[#234169]`,
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#0a0b0d',
    padding: 0,
    border: 'none',
  },
  overlay: {
    backgroundColor: 'rgba(10, 11, 13, 0.75)',
  },
}

const SendMessage = () => {
  const { formData, handleChange, saveMessage, currentUser, sendTransactionMsg } = useContext(SocialDappContext);
  const router = useRouter();

    const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.addressTo || !formData.msg) return

    sendTransactionMsg();

    saveMessage(currentUser.name, currentUser.walletAddress, formData.msg, formData.addressTo );

 }

  return (
    <div className={style.wrapper} id='SendMessage'>
      <div className={style.content}>
        <div className={style.formHeader}>
          <div>ENVIAR MENSAJE PRIVADO</div>
          <div>
            <TiMessages />
          </div>
        </div>
        <div className={style.transferPropContainer}>
          <input
            type='text'
            className={style.transferPropInput}
            placeholder='Wallet: 0x...'
            onChange={e => handleChange(e, 'addressTo')}
          />
          
        </div>
        <div className={style.transferPropContainer}>
          <input
            type='text'
            className={style.transferPropInput}
            placeholder='Mensaje:'
            onChange={e => handleChange(e, 'msg')}
          />
          
        </div>
        <div onClick={e => handleSubmit(e)} className={style.confirmButton}>
          ENVIAR
        </div>
      </div>
      <Modal isOpen={!!router.query.loading} style={customStyles}>
        <TransactionLoader />
      </Modal>
    </div>
  )
}

export default SendMessage;