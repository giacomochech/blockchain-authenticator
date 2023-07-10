const assert = require("assert");

const NFTMarketplace = artifacts.require("NFTMarketplace");

contract("NFTMarketplace", (accounts) => {
  it("should return all user cards", async () => {
    const nftMarketplace = await NFTMarketplace.deployed();
  
    // Registra alcune carte per diversi utenti
    await nftMarketplace.registerCard(
      "Charizard",
      9,
      "Mint",
      1,
      {from: accounts[0]}
      );
    await nftMarketplace.registerCard("Pikachu", 10, "Mint",2,{from: accounts[1]});
    await nftMarketplace.registerCard("Bulbasaur", 8, "Near Mint",3,{from: accounts[2]});
  
    // Ottieni tutte le carte di tutti gli utenti
    const allUserCards = await nftMarketplace.getAllUserCards();
  
    // Verifica che tutte le carte registrate siano presenti nell'array restituito
    assert.equal(allUserCards.length, 3, "Unexpected number of cards");
  
    // Verifica i dettagli della prima carta
    assert.equal(allUserCards[0].name, "Charizard", "Unexpected card name");
    assert.equal(allUserCards[0].grade, 9, "Unexpected card grade");
    assert.equal(allUserCards[0].condition, "Mint", "Unexpected card condition");
    assert.equal(allUserCards[0].cardCode, 1, "Unexpected card condition");
    assert.equal(allUserCards[0].owners_count,1,"Unexpected number of owners in history");
    assert.equal(allUserCards[0].owners_history.length, 1, "Unexpected number of owners history in the array");
    assert.equal(allUserCards[0].owners_history[0].toLowerCase(), accounts[0].toLowerCase(), "Unexpected owner address in the history");
    

  
    // Verifica i dettagli della seconda carta
    assert.equal(allUserCards[1].name, "Pikachu", "Unexpected card name");
    assert.equal(allUserCards[1].grade, 10, "Unexpected card grade");
    assert.equal(allUserCards[1].condition, "Mint", "Unexpected card condition");
    assert.equal(allUserCards[1].cardCode, 2, "Unexpected card condition");
    assert.equal(allUserCards[1].owners_count,1,"Unexpected number of owners in history");
    assert.equal(allUserCards[1].owners_history.length, 1, "Unexpected number of owners history in the array");
    assert.equal(allUserCards[1].owners_history[0].toLowerCase(), accounts[1].toLowerCase(), "Unexpected owner address in the history");

  
    // Verifica i dettagli della terza carta
    assert.equal(allUserCards[2].name, "Bulbasaur", "Unexpected card name");
    assert.equal(allUserCards[2].grade, 8, "Unexpected card grade");
    assert.equal(allUserCards[2].condition, "Near Mint", "Unexpected card condition");
    assert.equal(allUserCards[2].cardCode, 3, "Unexpected card condition");
    assert.equal(allUserCards[2].owners_count,1,"Unexpected number of owners in history");
    assert.equal(allUserCards[2].owners_history.length, 1, "Unexpected number of owners history in the array");
    assert.equal(allUserCards[2].owners_history[0].toLowerCase(), accounts[2].toLowerCase(), "Unexpected owner address in the history");

  });
});

contract("NFTMarketplace", (accounts) => {

  ///////REGISTER FUNCTION//////////7
  it("should register a new card", async () => {
    const nftMarketplace = await NFTMarketplace.deployed();

    // Chiamata alla funzione `registerCard` per registrare una nuova carta
    await nftMarketplace.registerCard(
      "Charizard",
      9,
      "Mint",
      6,
      { from: accounts[0] }
    );

    // Verifica che la carta sia stata registrata correttamente
    const cardCount = await nftMarketplace.getCardCount(accounts[0]);
    assert.equal(cardCount, 1, "Unexpected card count");

    const userCards = await nftMarketplace.getUserCards(accounts[0]);
    assert.equal(userCards.length, 1, "Unexpected number of user cards");
    assert.equal(userCards[0].name, "Charizard", "Unexpected card name");
    assert.equal(userCards[0].grade, 9, "Unexpected card grade");
    assert.equal(userCards[0].condition, "Mint", "Unexpected card condition");
    assert.equal(userCards[0].cardCode, 6, "Unexpected card code");
    assert.equal(userCards[0].owners_count,1,"Unexpected number of owners in history");
    assert.equal(userCards[0].owners_history.length, 1, "Unexpected number of owners history in the array");
    assert.equal(userCards[0].owners_history[0].toLowerCase(), accounts[0].toLowerCase(), "Unexpected owner address in the history");
  });

  /////////CARD TRANSFER TEST///////////////////////////////
  it("should transfer a card from one user to another", async () => {
    const nftMarketplace = await NFTMarketplace.deployed();

    // Chiamata alla funzione `registerCard` per registrare una carta per l'account[0]
    await nftMarketplace.registerCard(
      "Charizard",
      9,
      "Mint",
      6,
      { from: accounts[0] }
    );

    // Chiamata alla funzione `transferCard` per trasferire la carta dall'account[0] all'account[1]
    await nftMarketplace.transferCard(
      accounts[1],
      0,
      { from: accounts[0] }
    );

    // Ottieni le carte degli account[1]
    const userCards = await nftMarketplace.getUserCards(accounts[1]);

    // Verifica che la carta sia stata trasferita correttamente
    assert.equal(userCards.length, 1, "Unexpected number of cards");
    assert.equal(userCards[0].name, "Charizard", "Unexpected card name");
    assert.equal(userCards[0].grade, 9, "Unexpected card grade");
    assert.equal(userCards[0].cardCode, 6, "Unexpected card code");
    assert.equal(userCards[0].condition, "Mint", "Unexpected card condition");
    assert.equal(userCards[0].owners_count,2,"Unexpected number of owners in history");
    assert.equal(userCards[0].owners_history.length, 2, "Unexpected number of owners history in the array");
    assert.equal(userCards[0].owners_history[0].toLowerCase(), accounts[0].toLowerCase(), "Unexpected owner address in the history");
    assert.equal(userCards[0].owners_history[1].toLowerCase(), accounts[1].toLowerCase(), "Unexpected owner address in the history");

  });  

  //////////TRANSFER CARD SBAGLIATO/////////////////////
  it("should revert when transferring a non-existing card", async () => {
    const nftMarketplace = await NFTMarketplace.deployed();

    // Verifica che l'account[2] non abbia ancora nessuna carta
    const cardCountSender = await nftMarketplace.getUserCards(accounts[2]);
    assert.equal(cardCountSender.length, 0, "Unexpected card count for sender");

    // Verifica che l'account[3] non abbia ancora nessuna carta
    const cardCountReceiver = await nftMarketplace.getCardCount(accounts[3]);
    assert.equal(cardCountReceiver, 0, "Unexpected card count for receiver");

    // Tenta di trasferire una carta inesistente dall'account[2] all'account[3]
    try {
      await nftMarketplace.transferCard(accounts[3], 0, { from: accounts[2] });
      assert.fail("Expected revert exception");
    } catch (error) {
      assert(
        error.message.includes("Invalid card index"),
        "Unexpected revert message"
      );
    }

    // Verifica che il conteggio delle carte sia rimasto invariato
    const finalCardCountSender = await nftMarketplace.getCardCount(accounts[2]);
    assert.equal(finalCardCountSender, 0, "Unexpected card count for sender");
    const finalCardCountReceiver = await nftMarketplace.getCardCount(accounts[3]);
    assert.equal(finalCardCountReceiver, 0, "Unexpected card count for receiver");
  });
  
  ////////////7TEST COUNT /////////////////////////7
  it("should return the correct card count for a user", async () => {
    const nftMarketplace = await NFTMarketplace.deployed();

    // Chiamata alla funzione `registerCard` per registrare due carte per l'account[0]
    await nftMarketplace.registerCard(
      "Charizard",
      9,
      "Mint",
      6,
      { from: accounts[4] }
    );
    await nftMarketplace.registerCard(
      "Pikachu",
      10,
      "Mint",
      25,
      { from: accounts[4] }
    );

    // Ottieni il conteggio delle carte dell'account[0]
    const cardCount = await nftMarketplace.getCardCount(accounts[4]);

    // Verifica che il conteggio delle carte sia corretto (2)
    assert.equal(cardCount, 2, "Unexpected card count for user");
  });

//////////////////TESTING NFT /////////////////////////////////////////////////////


////GET ALL CARDS//////////////


});

contract("NFTMarketplace", accounts => {
  ///////////7CREATE TOKEN/////////////////////////
  it("should create a new token", async () => {
    const nftMarketplace = await NFTMarketplace.deployed();

    // Chiamata alla funzione `createToken` per creare un nuovo token
    const tokenID = await nftMarketplace.createToken(
      "https://gateway.pinata.cloud/ipfs/QmYokg8wYFVLXGGyFXni4GwDeGtPnFwmSMGrGv1rZou4ys",
      web3.utils.toWei("1", "ether"),
      { from: accounts[0], value: web3.utils.toWei("0.01", "ether") }
    );

    // Verifica che il token sia stato creato correttamente
    //assert.equal(tokenID.toString(), "1", "Unexpected token ID");

    // Verifica che gli eventi siano stati emessi correttamente
    const tokenListedEvents = await nftMarketplace.getPastEvents("TokenListedSuccess");
    assert.equal(tokenListedEvents.length, 1, "Unexpected number of TokenListedSuccess events");

    const tokenListedEvent = tokenListedEvents[0];
    assert.equal(tokenListedEvent.returnValues.tokenId.toString(), "1", "Unexpected token ID in TokenListedSuccess event");
    assert.equal(tokenListedEvent.returnValues.owner, nftMarketplace.address, "Unexpected owner address in TokenListedSuccess event");
    assert.equal(tokenListedEvent.returnValues.seller, accounts[0], "Unexpected seller address in TokenListedSuccess event");
    assert.equal(tokenListedEvent.returnValues.price.toString(), web3.utils.toWei("1", "ether"), "Unexpected token price in TokenListedSuccess event");
    assert.equal(tokenListedEvent.returnValues.currentlyListed, true, "Unexpected currentlyListed value in TokenListedSuccess event");
  });
  //////////////////////////EXECUTE SALE//////////////////////////
  /*it("should execute a sale and transfer the token to the new owner", async () => {
    const nftMarketplace = await NFTMarketplace.deployed();
  
    const tokenId = 1;
    const seller = accounts[0];
    const buyer = accounts[1];
    const tokenPrice = web3.utils.toWei("1", "ether");
  
    const sellerBalanceBefore = await web3.eth.getBalance(seller);
    // Eseguire l'acquisto del token da parte dell'acquirente
    await nftMarketplace.executeSale(tokenId, { from: buyer, value: tokenPrice });
  
    const sellerBalanceAfter = await web3.eth.getBalance(seller);
    // Verificare che il token sia stato trasferito correttamente al nuovo proprietario
    const owner = await nftMarketplace.ownerOf(tokenId);
    assert.equal(owner, buyer, "Unexpected owner after sale");
    // Verifica saldo
    const expectedSellerBalance = web3.utils.fromWei(sellerBalanceBefore + tokenPrice, "ether");
    assert.ok(web3.utils.fromWei(sellerBalanceAfter, "ether"), expectedSellerBalance, "Unexpected seller balance after sale");
  });*/
  
  //////////////GET ALL THE TOKEN/////////////////////////////////////
  it("should get all the tokens", async () => {
    const nftMarketplace = await NFTMarketplace.deployed();

    //Create new token for account[0] with tokenID 2
    const tokenID = await nftMarketplace.createToken(
      "https://gateway.pinata.cloud/ipfs/QmYokg8wYFVLXGGyFXni4GwDeGtPnFwmSMGrGv1rZou4ys",
      web3.utils.toWei("1", "ether"),
      { from: accounts[1], value: web3.utils.toWei("0.01", "ether") }
    );
    // Call getAllNFTs() to retrieve all tokens
    const tokens = await nftMarketplace.getAllNFTs();
    // Verify the returned tokens
    assert.equal(tokens.length, 2, "Unexpected number of tokens");

    assert.equal(tokens[0].tokenID, 1, "Unexpected token ID");
    assert.equal(tokens[0].owner, nftMarketplace.address, "Unexpected owner address");
    assert.equal(tokens[0].seller, accounts[0], "Unexpected seller address");
    assert.equal(tokens[0].price, web3.utils.toWei("1", "ether"), "Unexpected token price");
    assert.equal(tokens[0].currentlyListed, true, "Token should be currently listed");

    assert.equal(tokens[1].tokenID, 2, "Unexpected token ID");
    assert.equal(tokens[1].owner, nftMarketplace.address, "Unexpected owner address");
    assert.equal(tokens[1].seller, accounts[1], "Unexpected seller address");
    assert.equal(tokens[1].price, web3.utils.toWei("1", "ether"), "Unexpected token price");
    assert.equal(tokens[1].currentlyListed, true, "Token should be currently listed");
  });
  ////////7GET ALL TOKEN OF A USER//////////////////////////
  it("should get all the tokens of a user", async () => {
    const nftMarketplace = await NFTMarketplace.deployed();

    //Create new token for account[0] with tokenID 3
    const tokenID = await nftMarketplace.createToken(
      "https://gateway.pinata.cloud/ipfs/QmYokg8wYFVLXGGyFXni4GwDeGtPnFwmSMGrGv1rZou4ys",
      web3.utils.toWei("0.5", "ether"),
      { from: accounts[0], value: web3.utils.toWei("0.01", "ether") }
    );
    const tokens = await nftMarketplace.getAllMyNFTs({ from: accounts[0] });
    assert.equal(tokens[0].tokenID, 1, "Unexpected token ID");
    assert.equal(tokens[0].owner, nftMarketplace.address, "Unexpected owner address");
    assert.equal(tokens[0].seller, accounts[0], "Unexpected seller address");
    assert.equal(tokens[0].price, web3.utils.toWei("1", "ether"), "Unexpected token price");
    assert.equal(tokens[0].currentlyListed, true, "Token should be currently listed");

    assert.equal(tokens[1].tokenID, 3, "Unexpected token ID");
    assert.equal(tokens[1].owner, nftMarketplace.address, "Unexpected owner address");
    assert.equal(tokens[1].seller, accounts[0], "Unexpected seller address");
    assert.equal(tokens[1].price, web3.utils.toWei("0.5", "ether"), "Unexpected token price");
    assert.equal(tokens[1].currentlyListed, true, "Token should be currently listed");

  });
  //////////////////////////NOT EXECUTE SALE//////////////////////////
  /*it("should not execute a sale and transfer the token to the new owner", async () => {
    const nftMarketplace = await NFTMarketplace.deployed();

    const tokenId = 2;
    const seller = accounts[1];
    const buyer = accounts[2];
    const tokenPrice = web3.utils.toWei("1", "ether");
  
    const sellerBalanceBefore = await web3.eth.getBalance(seller);
    // Eseguire l'acquisto del token da parte dell'acquirente
    
    await nftMarketplace.executeSale(tokenId, { from: buyer, value: tokenPrice });
     
  
    const sellerBalanceAfter = await web3.eth.getBalance(seller);
    // Verifica che il token non sia stato trasferito al nuovo proprietario
    const owner = await nftMarketplace.ownerOf(tokenId);
    assert.equal(owner, accounts[0], "Unexpected owner after sale");
    // Verifica che il saldo del venditore sia rimasto lo stesso
    assert.equal(sellerBalanceBefore.toString(), sellerBalanceAfter.toString(), "Unexpected seller balance after sale");*/


});