// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract socialdappERC721 is ERC721URIStorage{
    uint256 DAPP_TOKEN_ID;

    constructor() ERC721("SocialDapp", "SD"){}//change name and symbol

    function mintNFT(address _userOne, address _userTwo, string memory tokenURI) public {
        _mint(_userOne, DAPP_TOKEN_ID);
        _setTokenURI(DAPP_TOKEN_ID, tokenURI);
        DAPP_TOKEN_ID++;

        _mint(_userTwo, DAPP_TOKEN_ID);
        _setTokenURI(DAPP_TOKEN_ID, tokenURI);
        DAPP_TOKEN_ID++;
    }


    /////////swap////////
    event Transfer (address sender, address receiver, uint amount, string message, uint256 timestamp, string keyword);

    function publishTransaction(address payable receiver, uint amount, string memory message, string memory keyword) public {
        emit Transfer(msg.sender, receiver, amount, message, block.timestamp, keyword); 
    }
    /////////////////
}