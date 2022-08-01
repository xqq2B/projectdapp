const Footer = () => {
    return(
        
        <div className="w-3/4 flex md:justify-center justify-between items-center flex-col p-4 gradient-bg-footer">
            <div className="flex flex-[0.5] justify-center items-center">
                    <img src='https://i.im.ge/2022/08/01/Ftz1m0.logo.png' alt="logo" className="w-32"/>
                    </div>
            <div className="w-full flex sm:flex-row flex-col justify-between items-center my-4">
                
                    <div className="text-white  font-bold text-center mx-2  
                    flex flex-1 justify-evenly items-center flex-wrap sm:mt-0 mt-5 w-full">
                        <p className="cursor-pointer underline"><a href="https://metamask.io/" target="_blank" rel="noreferrer">Metamask Wallet</a></p>
                        <p className="cursor-pointer underline"><a href="https://coinmarketcap.com/es/currencies/ethereum/" rel="noreferrer" target="_blank">Valor Ethereum</a></p>
                        <p className="cursor-pointer underline"><a href="https://goerli.etherscan.io/" target="_blank" rel="noreferrer">Goerli Etherscan</a></p>
                    </div>
                </div>
                <div className="flex justify-center items-center flex-col mt-5">
                    <p className="text-white text-sm text-center">Contacto</p>
                    <p className="text-white text-sm text-center">rweb3dev@gmail.com</p>
                </div>
                <div className="sm:w-[90%] w-full h-[0.25px] bg-gray-400 mt-5"/>
                <div className="sm:w-[90%] w-full flex justify-between items-center mt-3 ">
                <p className="text-white text-sm text-center"></p>
                <p className="text-white text-sm text-center">rweb 2002</p>
            </div>
        </div>
    );
}

export default Footer;