// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
    
contract MyNFT is ERC721URIStorage {
    mapping (uint =>TokenInfo) public forSale ;
    event Mint(address recipient, uint tokenId);
    constructor() ERC721("MyNFT", "NFT") {}
    
    mapping(address => uint[]) listIdOfOwner;
    uint[] public listIdSale;

    struct TokenInfo {
        uint price;
        bool sale;
    }
    
    // Create NFT
    function mintToken(uint _idToken, string memory tokenURI) public returns (uint)
    {
        _safeMint(msg.sender, _idToken);
        _setTokenURI(_idToken, tokenURI);
        listIdOfOwner[msg.sender].push(_idToken);
        emit Mint(msg.sender, _idToken);
        return _idToken;
    }
    
    function getListIdOfOwner(address owner) public view returns(uint[] memory) {
        return listIdOfOwner[owner];
    }
    
    function addListIdOfOwner(uint _idToken, address owner) public {
        listIdOfOwner[owner].push(_idToken);
    }
    
    function removeListIdOfOwner(uint _idToken, address owner) public {
        for (uint i=0; i < listIdOfOwner[owner].length; i++) {
            if (listIdOfOwner[owner][i] == _idToken) {
                listIdOfOwner[owner][i] = listIdOfOwner[owner][listIdOfOwner[owner].length - 1];
                listIdOfOwner[owner].pop();
            }
        }
    }
    
     function getListIdSale() public view returns(uint[] memory) {
        return listIdSale;
    }
    
    function addListIdSale(uint _tokenId) public {
        return listIdSale.push(_tokenId);
    }
    
    function removeListIdSale(uint _tokenId) public {
        for (uint i = 0; i < listIdSale.length; i++) {
            if (listIdSale[i] == _tokenId) {
                listIdSale[i] = listIdSale[listIdSale.length - 1];
                listIdSale.pop();
            }
        }
    }
    
    function setStatus(uint _tokenID, uint _price, bool _sale) public{
        forSale[_tokenID].price = _price;
        forSale[_tokenID].sale = _sale;
    }
    

    // UnSale nft 
    function unSale(uint _idToken) public{
        setStatus(_idToken, 0, false);
        approve(address(0),_idToken);
        removeListIdSale(_idToken);
        
    }

    //delete token
    function deleteToken(uint _tokenId) public  {
        require (_exists(_tokenId) , "Token is not exist !");
        require (ownerOf(_tokenId) == msg.sender ,  "Token is not owned !" );
        _burn(_tokenId);
    }
    //Check exists of token
    function exists(uint _tokenId) public view returns (bool) {
        return _exists(_tokenId);
    }
}