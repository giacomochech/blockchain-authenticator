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

    
    await contract.methods
      .registerCard(cardName, cardGrade_num, cardCondition, cardCode)
      .send({ from: accounts[0] });
  };

  const generateCardCode = () => {
    const cardCode = Math.floor(Math.random() * 10000000);
    setCardCode(cardCode);
  };
  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <div className="mb-4">
          <label
            htmlFor="cardName"
            className="block text-gray-700 font-bold mb-2"
          >
            Card Name:
          </label>
          <input
            type="text"
            id="cardName"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="cardGrade"
            className="block text-gray-700 font-bold mb-2"
          >
            Card Grade:
          </label>
          <input
            type="text"
            id="cardGrade"
            value={cardGrade}
            onChange={(e) => setCardGrade(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="cardCondition"
            className="block text-gray-700 font-bold mb-2"
          >
            Card Condition:
          </label>
          <input
            type="text"
            id="cardCondition"
            value={cardCondition}
            onChange={(e) => setCardCondition(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          onClick={generateCardCode}
          type="submit"
          className="bg-purple-500 hover:bg-purple-700 text-black font-bold py-2 px-4 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CardForm;
