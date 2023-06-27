// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract CardRegistry {
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
        delete userCards[msg.sender][_cardIndex]; // Delete the card from the user from whom the card is being transferred
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
}
