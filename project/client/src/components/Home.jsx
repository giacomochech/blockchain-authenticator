import { useState, useEffect } from "react";
import useEth from "../contexts/EthContext/useEth";
import React from "react";

function Contract({ value }) {
  const {
    state: { contract, accounts },
  } = useEth();
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState("");
  const [cardIndex, setCardIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const cards = await contract.methods
        .getAllUserCards()
        .call({ from: accounts[0] });
      setItems(cards);
    };
    fetchData();
  }, [contract, accounts]);

  const searchItems = () => {
    let foundIndex = null;
    for (let i = 0; i < items.length; i++) {
      console.log("inserito:" + searchTerm, "trovato:" + items[i].cardCode);
      if (items[i].cardCode === searchTerm) {
        foundIndex = i;
        break;
      }
    }
    if (foundIndex !== null) {
      setSearchResult("Found");
      setCardIndex(foundIndex);
    } else {
      setSearchResult("Not Found");
      setCardIndex(null);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "40vh",
        backgroundColor: "#f2f2f2",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.16)",
          borderRadius: "10px",
          marginBottom: "40px",
        }}
      >
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "700px",
            height: "70px",
            padding: "8px",
            fontSize: "16px",
            border: "none",
            borderRadius: "4px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        />
        <button
          onClick={searchItems}
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            fontSize: "16px",
            fontWeight: "bold",
            color: "#fff",
            backgroundColor: "#007bff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          Search
        </button>
      </div>
      {searchResult === "Found" && cardIndex !== null ? (
        <div
          style={{
            width: "400px",
            height: "200px",
            backgroundColor: "green",
            borderRadius: "10px",
            padding: "40px",
            color: "#fff",
            textAlign: "center",
            fontSize: "16px",
          }}
        >
          <ul>
            <li>Nome: {items[cardIndex].name}</li>
            <li>Descrizione: {items[cardIndex].condition}</li>
            <li>Numero: {items[cardIndex].cardCode}</li>
          </ul>
        </div>
      ) : (
        <div
          style={{
            width: "400px",
            height: "200px",
            backgroundColor: "red",
            borderRadius: "10px",
            padding: "40px",
            color: "#fff",
            textAlign: "center",
            fontSize: "16px",
          }}
        >
          Non è originale
        </div>
      )}
    </div>
  );
}

export default Contract;
