//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

//import "hardhat/console.sol";
import "./../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "./../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTMarketplace is ERC721URIStorage {
    struct Card {
        string name;
        uint256 grade;
        string condition;
        // Other variables
    }

    mapping(address => Card[]) private userCards; // Mapping to register cards for each user
    mapping(address => uint256) private cardCounts; // Mapping to keep track of card counts for each user

    // Event works as a log to keep track of all the transactions that happened in the contract
    // These logs are stored on blockchain and are accessible using address of the contract till the contract
    // is present on the blockchain. An event generated is not accessible from within contracts,
    // not even the one which have created and emitted them.

    // Event to notify when a card is registered
    event CardRegistered(
        address indexed user,
        string name,
        uint256 grade,
        string condition
    );

    // Event to notify when a card is transferred
    event CardTransferred(
        address indexed from,
        address indexed to,
        uint256 cardIndex
    );
    using Counters for Counters.Counter;
    //_tokenIds variable has the most recent minted tokenId
    Counters.Counter private _tokenIds;
    //Keeps track of the number of items sold on the marketplace
    Counters.Counter private _itemsSold;
    //owner is the contract address that created the smart contract
    address payable owner;
    //The fee charged by the marketplace to be allowed to list an NFT
    uint256 listPrice = 0.01 ether;

    //The structure to store info about a listed token
    struct ListedToken {
        uint256 tokenId;
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

    //This mapping maps tokenId to token info and is helpful when retrieving details about a tokenId
    mapping(uint256 => ListedToken) private idToListedToken;

    constructor() ERC721("NFTCardMarketplace", "CARD") {
        owner = payable(msg.sender);
    }

    function updateListPrice(uint256 _listPrice) public payable {
        require(owner == msg.sender, "Only owner can update listing price");
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
        uint256 currentTokenId = _tokenIds.current();
        return idToListedToken[currentTokenId];
    }

    function getListedTokenForId(
        uint256 tokenId
    ) public view returns (ListedToken memory) {
        return idToListedToken[tokenId];
    }

    function getCurrentToken() public view returns (uint256) {
        return _tokenIds.current();
    }

    //The first time a token is created, it is listed here
    function createToken(
        string memory tokenURI,
        uint256 price
    ) public payable returns (uint256) {
        //Increment the tokenId counter, which is keeping track of the number of minted NFTs
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        //Mint the NFT with tokenId newTokenId to the address who called createToken
        _safeMint(msg.sender, newTokenId);

        //Map the tokenId to the tokenURI (which is an IPFS URL with the NFT metadata)
        _setTokenURI(newTokenId, tokenURI);

        //Helper function to update Global variables and emit an event
        createListedToken(newTokenId, price);

        return newTokenId;
    }

    function createListedToken(uint256 tokenId, uint256 price) private {
        //Make sure the sender sent enough ETH to pay for listing
        require(msg.value == listPrice, "Hopefully sending the correct price");
        //Just sanity check
        require(price > 0, "Make sure the price isn't negative");

        //Update the mapping of tokenId's to Token details, useful for retrieval functions
        idToListedToken[tokenId] = ListedToken(
            tokenId,
            payable(address(this)),
            payable(msg.sender),
            price,
            true
        );

        _transfer(msg.sender, address(this), tokenId);
        //Emit the event for successful transfer. The frontend parses this message and updates the end user
        emit TokenListedSuccess(
            tokenId,
            address(this),
            msg.sender,
            price,
            true
        );
    }

    //This will return all the NFTs currently listed to be sold on the marketplace
    function getAllNFTs() public view returns (ListedToken[] memory) {
        uint256 nftCount = _tokenIds.current();
        ListedToken[] memory tokens = new ListedToken[](nftCount);
        uint256 currentIndex = 0;
        uint256 currentId;
        //at the moment currentlyListed is true for all, if it becomes false in the future we will
        //filter out currentlyListed == false over here
        for (uint256 i = 0; i < nftCount; i++) {
            currentId = i + 1;
            ListedToken storage currentItem = idToListedToken[currentId];
            tokens[currentIndex] = currentItem;
            currentIndex += 1;
        }
        //the array 'tokens' has the list of all NFTs in the marketplace
        return tokens;
    }

    //Returns all the NFTs that the current user is owner or seller in
    function getMyNFTs() public view returns (ListedToken[] memory) {
        uint256 totalItemCount = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;
        uint256 currentId;
        //Important to get a count of all the NFTs that belong to the user before we can make an array for them
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (
                idToListedToken[i + 1].owner == msg.sender ||
                idToListedToken[i + 1].seller == msg.sender
            ) {
                itemCount += 1;
            }
        }

        //Once you have the count of relevant NFTs, create an array then store all the NFTs in it
        ListedToken[] memory items = new ListedToken[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
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

    //Sell NFT to other address
    function executeSale(uint256 tokenId) public payable {
        uint256 price = idToListedToken[tokenId].price;
        address seller = idToListedToken[tokenId].seller;
        require(
            msg.value == price,
            "Please submit the asking price in order to complete the purchase"
        );

        //update the details of the token
        idToListedToken[tokenId].currentlyListed = true;
        idToListedToken[tokenId].seller = payable(msg.sender);
        _itemsSold.increment();

        //Actually transfer the token to the new owner
        _transfer(address(this), msg.sender, tokenId);
        //approve the marketplace to sell NFTs on your behalf
        approve(address(this), tokenId);

        //Transfer the listing fee to the marketplace creator
        payable(owner).transfer(listPrice);
        //Transfer the proceeds from the sale to the seller of the NFT
        payable(seller).transfer(msg.value);
    }

    // Function to register a card for a user, external means that this function can be called from outside the contract
    function registerCard(
        string memory _name,
        uint256 _grade,
        string memory _condition
    ) external {
        Card memory newCard = Card(_name, _grade, _condition);
        userCards[msg.sender].push(newCard);
        cardCounts[msg.sender]++;
        emit CardRegistered(msg.sender, _name, _grade, _condition);
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

    // Function to get card count of a user by address
    function getCardCount(address _user) external view returns (uint256) {
        return cardCounts[_user];
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
}
