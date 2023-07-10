import { useRef, useEffect } from "react";
import { useState } from "react";
import useEth from "../contexts/EthContext/useEth";
import React from "react";

function YourCollection({ value }) {
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

    console.log("Card Index:", cardIndex);
    console.log("Card Receiver:", cardReceiver);

    if (e.target.tagName === "INPUT") {
      return;
    }

    await contract.methods
      .transferCard(cardReceiver, cardIndex)
      .send({ from: accounts[0] });
    console.log("Items", items);
  };

  return (
    <div className="mt-8">
      <header className="bg-purple-500 text-white py-4">
        <nav className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">NFT Marketplace</h1>
        </nav>
      </header>
      <div className="mb-4">
        <h3 className=" text-purple-500 text-xl font-bold mb-6">
          Your Collection
        </h3>
        <button
          onClick={showCollection}
          className="bg-purple-500 hover:bg-purple-700 text-black font-bold py-2 px-4 rounded"
        >
          Show Collection
        </button>
        <ul>
          {items.map((item, index) => (
            <li key={index}>{item.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default YourCollection;
