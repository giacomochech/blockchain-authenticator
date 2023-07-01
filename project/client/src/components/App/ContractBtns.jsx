import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";

const CardForm = () => {
  
   const {
      state: { contract, accounts },
    } = useEth();
   
  const [cardName, setCardName] = useState('');
  const [cardGrade, setCardGrade] = useState('');
  const [cardCondition, setCardCondition] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic here

    console.log('Card Name:', cardName);
    console.log('Card Grade:', cardGrade);
    console.log('Card Condition:', cardCondition);
 
    if (e.target.tagName === "INPUT") {
      return;
    }

    /*
   if (inputValue === "") {
     alert("Please enter a value to write.");
     return;
   }
   */

   //const cardGrade_num = parseInt(cardGrade);  SE SI ROMPE SCOMMENTA
   
    //chiamate allo smart contract !!!
    await contract.methods.registerCard(cardName, cardGrade, cardCondition).send({ from: accounts[0] });
    
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
      <button type="submit">Submit</button>
    </form>
  );
};

export default CardForm;
