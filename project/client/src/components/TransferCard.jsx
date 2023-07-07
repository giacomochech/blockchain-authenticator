import { useRef, useEffect } from "react";
import { useState } from "react";
import useEth from "../contexts/EthContext/useEth";
import React from "react";

function TransferCard({ value }) {
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
    // if (items[0].cardCode === searchTerm) {
    //   setSearchResult("Found");
    // } else {
    //   setSearchResult("Not Found");
    // }
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
    <div className="mt-8">
      <header className="bg-purple-500 text-white py-4">
        <nav className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">NFT Marketplace</h1>
        </nav>
      </header>
      <div className="mb-4">
        <h3 className=" text-purple-500 text-xl font-bold mb-6">
          Transfer your cards to another user
        </h3>
      </div>

      <form onSubmit={transferCard} className="mt-4">
        <div className="mb-4">
          <label
            htmlFor="receiver"
            className="block text-gray-700 font-bold mb-2"
          >
            Receiver:
          </label>
          <input
            type="text"
            id="receiver"
            value={cardReceiver}
            onChange={(e) => setCardReceiver(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="cardIndex"
            className="block text-gray-700 font-bold mb-2"
          >
            Card Index:
          </label>
          <input
            type="text"
            id="cardIndex"
            value={cardIndex}
            onChange={(e) => setCardIndex(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          type="submit"
          className="bg-purple-500 hover:bg-purple-700 text-black font-bold py-2 px-4 rounded"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default TransferCard;
