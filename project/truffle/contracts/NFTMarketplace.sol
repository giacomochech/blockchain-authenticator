//SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

import "./../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol"; //TODO: magari si può chiamare in maniera più carina
import "./../node_modules/@openzeppelin/contracts/token/ERC721//extensions/ERC721URIStorage.sol"; //TODO: magari si può chiamare in maniera più carina
import "./../node_modules/@openzeppelin/contracts/utils/Counters.sol";


contract NFTCollectible is ERC721URIStorage {

   address payable owner;
   using Counters for Counters.Counter; //It's a datatype
   
   //Keep track of the number of tokens created
   Counters.Counter private _tokenIDs;

   //Keep track of the number of items sold on the marketplace
   Counters.Counter private _itemsSold;
   
   uint256 listPrice = 0.01 ether; //Fee of the marketplace

   struct ListedToken {
      uint256 tokenID;
      address payable owner;
      address payable seller;
      uint256 price;
      bool currentlyListed;
   }

    //the event emitted when a token is successfully listed
    event TokenListedSuccess (
        uint256 indexed tokenId,
        address owner,
        address seller,
        uint256 price,
        bool currentlyListed
    );

   mapping(uint256 => ListedToken) private idToListedToken; //create a mapping between the id (incremental) and the associated data of the token (listed Token struct)
   
   constructor() ERC721("NFTCollectible","NFTC") {
      owner = payable(msg.sender); //only the owner gets a revenue when the marketplace is used, payable means that this address is eligible to receive some eth
   }

   // HELPER FUNCTIONS

   function updateListPrice(uint256 _listPrice) public payable {
      require(owner == msg.sender, "Only the owner can perform this action");
      listPrice = _listPrice;
   }

   function getListPrice() public view returns (uint256) {
      return listPrice;
   }

   function getLatestIdToListedToken() public view returns (ListedToken memory){    //memory is an instructional keyboard to create a temporary memory allocation
      uint256 currentTokenId = _tokenIDs.current();
      return idToListedToken[currentTokenId];
   }

   function getListedForTokenId(uint256 tokenId) public view returns (ListedToken memory){    
      return idToListedToken[tokenId];
   }

   function getCurrentToken() public view returns (uint256) {
      return _tokenIDs.current();
   }

   //CORE FUNCTIONS

   //Top level function when creating a token for the first time
   function createToken(string memory tokenURI, uint256 price) public payable returns (uint) {
      
      _tokenIDs.increment();
      uint256 currentTokenId = _tokenIDs.current();
      _safeMint(msg.sender, currentTokenId);
      _setTokenURI(currentTokenId, tokenURI);

      createListedToken(currentTokenId, price);

      return currentTokenId;
   }

   //Helps create the object of type ListedToken for the NFT and update the idToListedToken mapping
   function createListedToken(uint256 tokenID, uint256 price) private {

      require(msg.value == listPrice, "Hopefully sending the correct price");
        //Just sanity check
      require(price > 0, "Make sure the price isn't negative");
      idToListedToken[tokenID] = ListedToken(tokenID, payable(address(this)), payable(msg.sender), price,true);
      _transfer(msg.sender, address(this), tokenID);

      emit TokenListedSuccess(
            tokenID,
            address(this),
            msg.sender,
            price,
            true
        );
   }

   //Get all the NFTs currently listed for sale on the marketplace --> DA MODIFICARE
   function getAllNFTs() public view returns (ListedToken[] memory) {
      uint nftCount = _tokenIDs.current();
      ListedToken[] memory tokens = new ListedToken[](nftCount);

      uint currentIndex = 0;

      for(uint i=0; i < nftCount; i++)
      {
         uint currentId = i + 1;
         ListedToken storage currentItem = idToListedToken[currentId];
         tokens[currentIndex] = currentItem;
         currentIndex += 1;
      }
      
      return tokens;
   }

   //Get all the NFTs of the user on the marketplace --> DA MODIFICARE
   function getAllMyNFTs()  public view returns (ListedToken[] memory) {
      uint totalItemCount = _tokenIDs.current();
        uint itemCount = 0;
        uint currentIndex = 0;
        uint currentId;
        //Important to get a count of all the NFTs that belong to the user before we can make an array for them
        for(uint i=0; i < totalItemCount; i++)
        {
            if(idToListedToken[i+1].owner == msg.sender || idToListedToken[i+1].seller == msg.sender){
                itemCount += 1;
            }
        }

        //Once you have the count of relevant NFTs, create an array then store all the NFTs in it
        ListedToken[] memory items = new ListedToken[](itemCount);
        for(uint i=0; i < totalItemCount; i++) {
            if(idToListedToken[i+1].owner == msg.sender || idToListedToken[i+1].seller == msg.sender) {
                currentId = i+1;
                ListedToken storage currentItem = idToListedToken[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
   }

   //The function that executes the sale on the marketplace --> DA MODIFICARE
   function executeSale(uint256 tokenId) public payable {
        uint price = idToListedToken[tokenId].price;
        address seller = idToListedToken[tokenId].seller;
        require(msg.value == price, "Please submit the asking price in order to complete the purchase");

        //update the details of the token
        idToListedToken[tokenId].currentlyListed = true;
        idToListedToken[tokenId].seller = payable(msg.sender);
        //_itemsSold.increment();

        //Actually transfer the token to the new owner
        _transfer(address(this), msg.sender, tokenId);
        //approve the marketplace to sell NFTs on your behalf
        approve(address(this), tokenId);

        //Transfer the listing fee to the marketplace creator
        payable(owner).transfer(listPrice);
        //Transfer the proceeds from the sale to the seller of the NFT
        payable(seller).transfer(msg.value);
    }
}
