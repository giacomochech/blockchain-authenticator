import { useRef, useEffect } from "react";
import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";

function Contract({ value }) {

  const {
    state: { contract, accounts },
  } = useEth();

  const [items, setItems] = useState([]);     //Ho tolto const non so se è una buona cosa
  const [cardIndex, setCardIndex] = useState('');
  const [cardReceiver, setCardReceiver] = useState('');

  const showCollection = async (e) =>  {

   const cards = await contract.methods.getUserCards(accounts[0]).call({ from: accounts[0] })
   setItems(cards)
  };

  const transferCard = async (e) => {
    e.preventDefault();
    // Handle form submission logic here

    console.log('Card Index:', cardIndex);
    console.log('Card Receiver:', cardReceiver);
    
 
    if (e.target.tagName === "INPUT") {
      return;
    }

    //Aggiungi controlli input

    await contract.methods.transferCard(cardReceiver, cardIndex).send({ from: accounts[0] });
    console.log("Items", items)
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
      </div>

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
