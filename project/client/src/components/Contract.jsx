import { useRef, useEffect } from "react";
import { useState } from "react";
import useEth from "../contexts/EthContext/useEth";

function Contract({ value }) {
  const {
    state: { contract, accounts },
  } = useEth();

  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");

  const showCollection = async (e) => {
    const cards = await contract.methods
      .getUserCards(accounts[0])
      .call({ from: accounts[0] });
    setItems(cards);
  };

  return (
    <div>
      <button onClick={showCollection}>showCollection</button>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default Contract;
