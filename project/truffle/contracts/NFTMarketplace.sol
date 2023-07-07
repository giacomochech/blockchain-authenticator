//SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

import "./../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol"; //TODO: magari si può chiamare in maniera più carina
import "./../node_modules/@openzeppelin/contracts/token/ERC721//extensions/ERC721URIStorage.sol"; //TODO: magari si può chiamare in maniera più carina
import "./../node_modules/@openzeppelin/contracts/utils/Counters.sol";

contract NFTMarketplace is ERC721URIStorage {
    struct Card {
        string name;
        uint256 grade;
        string condition;
        uint256 cardCode;
        // Other variables
    }

    mapping(address => Card[]) private userCards; // Mapping to register cards for each user
    mapping(address => uint256) private cardCounts; // Mapping to keep track of card counts for each user

    Card[] private allCards; // Array to keep track of all cards
    uint256 private allCardsCount; // Variable to keep track of total card count

    event CardRegistered(
        address indexed user,
        string name,
        uint256 grade,
        string condition,
        uint256 cardCode
    );

    event CardTransferred(
        address indexed from,
        address indexed to,
        uint256 cardIndex
    );

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
    event TokenListedSuccess(
        uint256 indexed tokenId,
        address owner,
        address seller,
        uint256 price,
        bool currentlyListed
    );

    mapping(uint256 => ListedToken) private idToListedToken; //create a mapping between the id (incremental) and the associated data of the token (listed Token struct)

    constructor() ERC721("NFTCollectible", "NFTC") {
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

    function getLatestIdToListedToken()
        public
        view
        returns (ListedToken memory)
    {
        //memory is an instructional keyboard to create a temporary memory allocation
        uint256 currentTokenId = _tokenIDs.current();
        return idToListedToken[currentTokenId];
    }

    function getListedForTokenId(
        uint256 tokenId
    ) public view returns (ListedToken memory) {
        return idToListedToken[tokenId];
    }

    function getCurrentToken() public view returns (uint256) {
        return _tokenIDs.current();
    }

    //CORE FUNCTIONS

    // Function to get card count of a user by address
    function getCardCount(address _user) external view returns (uint256) {
        return cardCounts[_user];
    }

    //Function to get all cards count
    function getAllCardsCount() external view returns (uint256) {
        return allCardsCount;
    }

    // Function to transfer a card from one user to another
    function transferCard(address _to, uint256 _cardIndex) external {
        require( // require is used to validate the inputs to the function and throw error if the condition is not met
            _cardIndex < userCards[msg.sender].length,
            "Invalid card index"
        );
        Card memory cardToTransfer = userCards[msg.sender][_cardIndex]; // Get the card to transfer
        userCards[_to].push(cardToTransfer); // Push the card to the user to whom it is being transferred
        cardCounts[msg.sender]--; // Reduce the card count of the user from whom the card is being transferred
        cardCounts[_to]++; // Increase the card count of the user to whom the card is being transferred
        removeElement(_cardIndex); // Delete the card from the user from whom the card is being transferred
        emit CardTransferred(msg.sender, _to, _cardIndex); // Emit the event to notify the transfer
    }

    // Function to get all cards of a user by address
    function getUserCards(address _user) external view returns (Card[] memory) {
        // view means that this function will not modify the state of the contract
        return userCards[_user];
    }

    // Function to get all cards of a all users
    function getAllUserCards() external view returns (Card[] memory) {
        return allCards;
    }

    function removeElement(uint256 _cardIndex) internal {
        require(
            _cardIndex < userCards[msg.sender].length,
            "Index out of bounds"
        );

        // Shift elements to the left starting from the element to be removed
        for (uint i = _cardIndex; i < userCards[msg.sender].length - 1; i++) {
            //FORSE USA TROPPO GAS --> da approfondire
            userCards[msg.sender][i] = userCards[msg.sender][i + 1];
        }

        // Resize the array by deleting the last element
        userCards[msg.sender].pop();
    }

    //Top level function when creating a token for the first time
    function createToken(
        string memory tokenURI,
        uint256 price
    ) public payable returns (uint) {
        _tokenIDs.increment();
        uint256 currentTokenId = _tokenIDs.current();
        _safeMint(msg.sender, currentTokenId);
        _setTokenURI(currentTokenId, tokenURI);

        createListedToken(currentTokenId, price);

        return currentTokenId;
    }

    function registerCard(
        string memory _name,
        uint256 _grade,
        string memory _condition,
        uint256 _cardCode
    ) external {
        Card memory newCard = Card(_name, _grade, _condition, _cardCode);
        userCards[msg.sender].push(newCard);
        allCards.push(newCard);
        allCardsCount++;

        cardCounts[msg.sender]++;
        emit CardRegistered(msg.sender, _name, _grade, _condition, _cardCode);
    }

    //Helps create the object of type ListedToken for the NFT and update the idToListedToken mapping
    function createListedToken(uint256 tokenID, uint256 price) private {
        require(msg.value == listPrice, "Hopefully sending the correct price");
        //Just sanity check
        require(price > 0, "Make sure the price isn't negative");
        idToListedToken[tokenID] = ListedToken(
            tokenID,
            payable(address(this)),
            payable(msg.sender),
            price,
            true
        );
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

        for (uint i = 0; i < nftCount; i++) {
            uint currentId = i + 1;
            ListedToken storage currentItem = idToListedToken[currentId];
            tokens[currentIndex] = currentItem;
            currentIndex += 1;
        }

        return tokens;
    }

    //Get all the NFTs of the user on the marketplace --> DA MODIFICARE
    function getAllMyNFTs() public view returns (ListedToken[] memory) {
        uint totalItemCount = _tokenIDs.current();
        uint itemCount = 0;
        uint currentIndex = 0;
        uint currentId;
        //Important to get a count of all the NFTs that belong to the user before we can make an array for them
        for (uint i = 0; i < totalItemCount; i++) {
            if (
                idToListedToken[i + 1].owner == msg.sender ||
                idToListedToken[i + 1].seller == msg.sender
            ) {
                itemCount += 1;
            }
        }

        //Once you have the count of relevant NFTs, create an array then store all the NFTs in it
        ListedToken[] memory items = new ListedToken[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (
                idToListedToken[i + 1].owner == msg.sender ||
                idToListedToken[i + 1].seller == msg.sender
            ) {
                currentId = i + 1;
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
        require(
            msg.value == price,
            "Please submit the asking price in order to complete the purchase"
        );

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
