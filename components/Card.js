import React, {useContext} from "react";
import { SiTinder } from "react-icons/si";
//import TinderCard from "react-tinder-card";
import CardFooter from "./CardFooter";
import CardHeader from "./CardHeader";
import SocialDappCardItem from "./SocialDappCardItem";
import { SocialDappContext } from "../context/SocialDappContext";


const style = {
    wrapper: `h-[45rem] w-[27rem] flex flex-col rounded-lg overflow-hidden`,
    cardMain: `w-full flex-1 relative flex flex-col justify-center items-center bg-gray-500`,
    noMoreWrapper: `flex flex-col justify-center items-center absolute`,
    socialdappLogo: `text-5xl text-red-500 mb-4`,
    noMoreText: `text-xl text-white`,
    swipesContainer: `w-full h-full overflow-hidden`,
  }

const Card = () => {

    const { cardsData, currentAccount} = useContext(SocialDappContext);
    //console.log(cardsData);

    return(
        <div className={style.wrapper}>
            <CardHeader/>
            <div className={style.cardMain}>
                <div className={style.noMoreWrapper}>
                    <SiTinder className={style.socialdappLogo}/>
                    <div className={style.noMoreText}>
                        No more profiles...
                    </div>
                </div>
                <div className={style.swipesContainer}>
                    {currentAccount ? (
                     cardsData.map((card, index) => (
                        <SocialDappCardItem card={card} key={index} />
                        ))) : (
                            <div> 
                            </div>
                            
                            )}
                </div>
            </div>
            <CardFooter/>
        </div>
    )
}

export default Card;