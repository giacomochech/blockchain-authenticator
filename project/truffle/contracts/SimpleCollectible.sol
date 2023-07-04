pragma solidity >=0.4.22 <0.9.0;

import "./../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol"; //TODO: magari si può chiamare in maniera più carina
import "./../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract SimpleCollectible is ERC721, Ownable {

   uint256 public tokenCounter;
   uint256 public mintPrice = 0.05 ether;
   uint256 public totalSupply;
   uint256 public maxSupply;
   bool public isMintEnabled; //variable that determines when people can mint the NFT
   mapping(address => uint256) public mintedWallets; //keep track of the number of mints that each wallet have done


   constructor () payable ERC721 ("Simple Mint","SIMPLEMINT") {
      maxSupply = 2;
   }
   
   function toggleIsMintEnabled() external onlyOwner {            //only the owner (who have deployed the contract) can access it
      isMintEnabled = !isMintEnabled;
   }

   function setMaxSupply(uint256 maxSupply_) external onlyOwner {    //only the owner can modify the max supply
      maxSupply = maxSupply_;
   }

   function mint() external payable {              //payable means that the function deals with actual money
      require(isMintEnabled, 'minting not enabled');
      require(mintedWallets[msg.sender] < 1, 'exceeds max per wallet'); //only each wallet can only mint one
      require(msg.value == mintPrice, 'wrong value'); //check if the user puts the correct price for the mint
      require(maxSupply > totalSupply, 'sold out');

      mintedWallets[msg.sender]++;
      totalSupply++;
      uint256 tokenId = totalSupply;
      _safeMint(msg.sender, tokenId); //handles the mintig of the NFT
   }


   /* VECCHIO TUTORIAL
   function createCollectible(string memory tokenURI) public (uint256) {
      uint256 newItemId = tokenCounter;
      _safeMint(msg.sender, newItemId); //creates safely a new NFT
      _setTokenURI(newItemId, tokenURI);
      tokenCounter = tokenCounter + 1;
      return newItemId;
   }

   */
}