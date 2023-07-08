const assert = require("assert");

const Authenticator = artifacts.require("../contracts/Authenticator.sol");
const NFTMarketplace = artifacts.require("../contracts/NFTMarketplace.sol");

Contract("authenticator", (accounts) => {
    ////////CARD INSERT TEST////////////
    it("should register a new card", async () => {
        const authenticator = await Authenticator.deployed();
    
        // Chiamata alla funzione `registerCard`
        await authenticator.registerCard(
          "Charizard",
          9,
          "Mint",
          { from: accounts[0] }
        );
    
        // Ottieni le carte dell'utente
        const userCards = await authenticator.getUserCards(accounts[0]);
    
        // Verifica che sia stata registrata una carta correttamente
        assert.equal(userCards.length, 1, "Unexpected number of cards");
        assert.equal(userCards[0].name, "Charizard", "Unexpected card name");
        assert.equal(userCards[0].grade, 9, "Unexpected card grade");
        assert.equal(userCards[0].condition, "Mint", "Unexpected card condition");
      });

      /////////CARD TRANSFER TEST///////////////////////////////
      it("should transfer a card from one user to another", async () => {
        const authenticator = await Authenticator.deployed();
    
        // Chiamata alla funzione `registerCard` per registrare una carta per l'account[0]
        await authenticator.registerCard(
          "Charizard",
          9,
          "Mint",
          { from: accounts[0] }
        );
    
        // Chiamata alla funzione `transferCard` per trasferire la carta dall'account[0] all'account[1]
        await authenticator.transferCard(
          accounts[1],
          0,
          { from: accounts[0] }
        );
    
        // Ottieni le carte degli account[1]
        const userCards = await authenticator.getUserCards(accounts[1]);
    
        // Verifica che la carta sia stata trasferita correttamente
        assert.equal(userCards.length, 1, "Unexpected number of cards");
        assert.equal(userCards[0].name, "Charizard 1", "Unexpected card name");
        assert.equal(userCards[0].grade, 9, "Unexpected card grade");
        assert.equal(userCards[0].condition, "Mint", "Unexpected card condition");
      });  
      
      ////////7TEST DELETE CARD//////////////////////////////////
      it("should remove a card from user's account", async () => {
        const authenticator = await Authenticator.deployed();
    
        // Chiamata alla funzione `registerCard` per registrare una carta per l'account[0]
        await authenticator.registerCard(
          "Charizard",
          9,
          "Mint",
          { from: accounts[0] }
        );
    
        // Chiamata alla funzione `removeElement` per rimuovere la carta dall'account[0]
        await authenticator.removeElement(0, { from: accounts[0] });
    
        // Ottieni le carte dell'account[0]
        const userCards = await authenticator.getUserCards(accounts[0]);
    
        // Verifica che l'array delle carte dell'account[0] sia vuoto
        assert.equal(userCards.length, 0, "Unexpected number of cards after removal");
      });

      ////////////7TEST COUNT /////////////////////////7
      it("should return the correct card count for a user", async () => {
        const authenticator = await Authenticator.deployed();
    
        // Chiamata alla funzione `registerCard` per registrare due carte per l'account[0]
        await authenticator.registerCard(
          "Charizard",
          9,
          "Mint",
          { from: accounts[0] }
        );
        await authenticator.registerCard(
          "Pikachu",
          10,
          "Mint",
          { from: accounts[0] }
        );
    
        // Ottieni il conteggio delle carte dell'account[0]
        const cardCount = await authenticator.getCardCount(accounts[0]);
    
        // Verifica che il conteggio delle carte sia corretto (2)
        assert.equal(cardCount, 2, "Unexpected card count for user");
      });
});





Contract("NFTMarketplace", (accounts) => {
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
    assert.equal(userCards[0].name, "Charizard 1", "Unexpected card name");
    assert.equal(userCards[0].grade, 9, "Unexpected card grade");
    assert.equal(userCards[0].cardCode, 6, "Unexpected card code");
    assert.equal(userCards[0].condition, "Mint", "Unexpected card condition");
  });  

  //////////TRANSFER CARD SBAGLIATO/////////////////////
  it("should revert when transferring a non-existing card", async () => {
    const nftMarketplace = await NFTMarketplace.deployed();

    // Verifica che l'account[0] non abbia ancora nessuna carta
    const cardCountSender = await nftMarketplace.getCardCount(accounts[0]);
    assert.equal(cardCountSender, 0, "Unexpected card count for sender");

    // Verifica che l'account[1] non abbia ancora nessuna carta
    const cardCountReceiver = await nftMarketplace.getCardCount(accounts[1]);
    assert.equal(cardCountReceiver, 0, "Unexpected card count for receiver");

    // Tenta di trasferire una carta inesistente dall'account[0] all'account[1]
    try {
      await nftMarketplace.transferCard(accounts[1], 0, { from: accounts[0] });
      assert.fail("Expected revert exception");
    } catch (error) {
      assert(
        error.message.includes("Invalid card index"),
        "Unexpected revert message"
      );
    }

    // Verifica che il conteggio delle carte sia rimasto invariato
    const finalCardCountSender = await nftMarketplace.getCardCount(accounts[0]);
    assert.equal(finalCardCountSender, 0, "Unexpected card count for sender");
    const finalCardCountReceiver = await nftMarketplace.getCardCount(accounts[1]);
    assert.equal(finalCardCountReceiver, 0, "Unexpected card count for receiver");
  });

  ///////////DELETE TEST///////////////////////////////////////
  it("should remove a card from user's account", async () => {
    const nftMarketplace = await NFTMarketplace.deployed();

    // Chiamata alla funzione `registerCard` per registrare una carta per l'account[0]
    await nftMarketplace.registerCard(
      "Charizard",
      9,
      "Mint",
      6,
      { from: accounts[0] }
    );

    // Chiamata alla funzione `removeElement` per rimuovere la carta dall'account[0]
    await nftMarketplace.removeElement(0, { from: accounts[0] });

    // Ottieni le carte dell'account[0]
    const userCards = await nftMarketplace.getUserCards(accounts[0]);

    // Verifica che l'array delle carte dell'account[0] sia vuoto
    assert.equal(userCards.length, 0, "Unexpected number of cards after removal");
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
      { from: accounts[0] }
    );
    await authenticator.registerCard(
      "Pikachu",
      10,
      "Mint",
      25,
      { from: accounts[0] }
    );

    // Ottieni il conteggio delle carte dell'account[0]
    const cardCount = await nftMarketplace.getCardCount(accounts[0]);

    // Verifica che il conteggio delle carte sia corretto (2)
    assert.equal(cardCount, 2, "Unexpected card count for user");
  });

});

