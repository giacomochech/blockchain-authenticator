import { useRef, useEffect } from "react";
import { useState } from "react";
import useEth from "../contexts/EthContext/useEth";
import React from "react";

function Contract({ value }) {
  const {
    state: { contract, accounts },
  } = useEth();

  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cardIndex, setCardIndex] = useState("");
  const [cardReceiver, setCardReceiver] = useState("");
  const [searchResult, setSearchResult] = useState("");

  const showCollection = async (e) => {
    const cards = await contract.methods
      .getUserCards(accounts[0])
      .call({ from: accounts[0] });
    setItems(cards);
  };

  const searchItems = async (e) => {
    const cards = await contract.methods
      .getUserCards(accounts[0])
      .call({ from: accounts[0] });
    setItems(cards);
    console.log("Items", items);
    for (let i = 0; i < items.length; i++) {
      if (items[i].cardCode === searchTerm) {
        setSearchResult("Found");
      } else {
        setSearchResult("Not Found");
      }
    }
    
  };

  const transferCard = async (e) => {
    e.preventDefault();
    // Handle form submission logic here

    console.log("Card Index:", cardIndex);
    console.log("Card Receiver:", cardReceiver);

    if (e.target.tagName === "INPUT") {
      return;
    }

    //Aggiungi controlli input

    await contract.methods
      .transferCard(cardReceiver, cardIndex)
      .send({ from: accounts[0] });
    console.log("Items", items);
  };

  return (
    <div>
      <div>
        <button onClick={showCollection}>showCollection</button>
        <ul>
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        {/* <ul>
          <li>Card Name: {items[1]}</li>
        </ul> */}
      </div>
      {/* <div>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={searchItems}>Search</button>
        <p>Result: {searchResult}</p>
      </div> */}

      <form onSubmit={transferCard}>
        <div>
          <label> Receiver:</label>
          <input
            type="text"
            value={cardReceiver}
            onChange={(e) => setCardReceiver(e.target.value)} //da cambiare
          />
        </div>
        <div>
          <label>Card Index:</label>
          <input
            type="text"
            value={cardIndex}
            onChange={(e) => setCardIndex(e.target.value)}
          />
        </div>
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Contract;
