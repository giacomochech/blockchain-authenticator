import { useState } from "react";
import useEth from "../contexts/EthContext/useEth";

const CardForm = () => {
  const {
    state: { contract, accounts },
  } = useEth();

  const [cardName, setCardName] = useState("");
  const [cardGrade, setCardGrade] = useState("");
  const [cardCondition, setCardCondition] = useState("");
  const [cardCode, setCardCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic here

    console.log("Card Name:", cardName);
    console.log("Card Grade:", cardGrade);
    console.log("Card Condition:", cardCondition);
    console.log("Card Code:", cardCode);

    if (e.target.tagName === "INPUT") {
      return;
    }

    /*
   if (inputValue === "") {
     alert("Please enter a value to write.");
     return;
   }
   */
    const cardGrade_num = parseInt(cardGrade); //converts string to number

    //chiamate allo smart contract !!!
    await contract.methods
      .registerCard(cardName, cardGrade_num, cardCondition, cardCode)
      .send({ from: accounts[0] });
  };

  const generateCardCode = () => {
    const cardCode = Math.floor(Math.random() * 10000000);
    setCardCode(cardCode);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Card Name:</label>
        <input
          type="text"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
        />
      </div>
      <div>
        <label>Card Grade:</label>
        <input
          type="text"
          value={cardGrade}
          onChange={(e) => setCardGrade(e.target.value)}
        />
      </div>
      <div>
        <label>Card Condition:</label>
        <input
          type="text"
          value={cardCondition}
          onChange={(e) => setCardCondition(e.target.value)}
        />
      </div>

      <button onClick={generateCardCode} type="submit">
        Submit
      </button>
    </form>
  );
};

export default CardForm;
