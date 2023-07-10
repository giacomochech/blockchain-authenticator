import { useState } from "react";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
import { ethers } from "ethers";
import useEth from "../contexts/EthContext/useEth";

export default function SellNFT() {
  const [formParams, updateFormParams] = useState({
    name: "",
    grade: "",
    description: "",
    cardCode: "",
    price: "",
  });
  const [fileURL, setFileURL] = useState(null); //This is the URL of the image uploaded to IPFS
  const {
    state: { contract, accounts },
  } = useEth(); //This is the contract instance

  const ethers = require("ethers");
  const [message, updateMessage] = useState("");

  async function disableButton() {
    const listButton = document.getElementById("list-button");
    listButton.disabled = true;
    listButton.style.backgroundColor = "grey";
    listButton.style.opacity = 0.3;
  }

  async function enableButton() {
    const listButton = document.getElementById("list-button");
    listButton.disabled = false;
    listButton.style.backgroundColor = "#A500FF";
    listButton.style.opacity = 1;
  }

  //This function uploads the NFT image to IPFS
  async function OnChangeFile(e) {
    var file = e.target.files[0];
    //check for file extension
    try {
      //upload the file to IPFS
      disableButton();
      updateMessage("Uploading image.. please dont click anything!");
      const response = await uploadFileToIPFS(file);
      if (response.success === true) {
        enableButton();
        updateMessage("");
        console.log("Uploaded image to Pinata: ", response.pinataURL);
        setFileURL(response.pinataURL);
      }
    } catch (e) {
      console.log("Error during file upload", e);
    }
  }

  //This function uploads the metadata to IPFS
  async function uploadMetadataToIPFS() {
    const { name, grade, description, cardCode, price } = formParams;
    //Make sure that none of the fields are empty
    if (!name || !grade || !description || !cardCode || !price || !fileURL) {
      updateMessage("Please fill all the fields!");
      return -1;
    }
   
    const nftJSON = {
      name,
      grade,
      description,
      cardCode,
      price,
      image: fileURL
    };

    try {
      //upload the metadata JSON to IPFS
      const response = await uploadJSONToIPFS(nftJSON);
      if (response.success === true) {
        console.log("Successfully uploaded JSON to Pinata: ", response);
        return response.pinataURL;
      }
    } catch (e) {
      console.log("error uploading JSON metadata:", e);
    }
  }

  async function listNFT(e) {
    e.preventDefault();

    //Upload data to IPFS
    try {
      const metadataURL = await uploadMetadataToIPFS();
      if (metadataURL === -1) return;
    
      const card_owner = await contract.methods.getOwner(formParams.cardCode).call({ from: accounts[0] });
      console.log("card_owner", card_owner);
      console.log("accounts[0]", accounts[0]);
      console.log("checkProperty", accounts[0] == card_owner);
      if(accounts[0].toString().toLowerCase() != card_owner.toLowerCase()){
        alert("You are not the owner of this card!");
        return;
      }

      disableButton();
      updateMessage(
        "Uploading NFT(takes 5 mins).. please dont click anything!"
      );

      //message the params to be sent to the create NFT request
      const price = ethers.parseUnits(formParams.price, 'ether');
      let listingPrice = await contract.methods
        .getListPrice()
        .call({ from: accounts[0] });
      listingPrice = listingPrice.toString();

      //actually create the NFT
      let transaction = await contract.methods
        .createToken(metadataURL, price)
        .send({ from: accounts[0], value: listingPrice });
      

      alert("Successfully listed your NFT!");
      enableButton();
      updateMessage("");
      updateFormParams({ name: "", grade: "", description: "", cardCode: "", price: "" });
      
    } catch (e) {
      alert("Upload error" + e);
    }
    
  }

  
  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-purple-500 text-white py-4">
        <nav className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">NFT creation</h1>
        </nav>
      </header>
      <main className="container mx-auto py-10">
        <div className="max-w-md mx-auto bg-white shadow-md rounded px-8 py-6">
          <h3 className=" text-purple-500 text-xl font-bold mb-6">
            Upload your NFT 
          </h3>
          <div className="mb-6">
            <label
              className="block text-purple-500 text-sm font-bold mb-2"
              htmlFor="name"
            >
              NFT Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="MyNFT#123"
              onChange={(e) =>
                updateFormParams({ ...formParams, name: e.target.value })
              }
              value={formParams.name}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-purple-500 text-sm font-bold mb-2"
              htmlFor="grade"
            >
              Gradation
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="grade"
              type="number"
              placeholder="1-10"
              onChange={(e) =>
                updateFormParams({ ...formParams, grade: e.target.value })
              }
              value={formParams.grade}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-purple-500 text-sm font-bold mb-2"
              htmlFor="description"
            >
              NFT Description
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              cols="40"
              rows="5"
              id="description"
              type="text"
              placeholder="Insert NFT description here"
              value={formParams.description}
              onChange={(e) =>
                updateFormParams({ ...formParams, description: e.target.value })
              }
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-purple-500 text-sm font-bold mb-2"
              htmlFor="cardCode"
            >
              Card Code
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="cardCode"
              type="number"
              placeholder="xxxxxxxx"
              onChange={(e) =>
                updateFormParams({ ...formParams, cardCode: e.target.value })
              }
              value={formParams.cardCode}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-purple-500 text-sm font-bold mb-2"
              htmlFor="price"
            >
              Price (in ETH)
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="number"
              placeholder="Min 0.01 ETH"
              step="0.01"
              value={formParams.price}
              onChange={(e) =>
                updateFormParams({ ...formParams, price: e.target.value })
              }
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-purple-500 text-sm font-bold mb-2"
              htmlFor="image"
            >
              Upload Image (&lt;500 KB)
            </label>
            <input type="file" onChange={OnChangeFile} />
          </div>
          <div className="text-red-500 text-center mb-4">{message}</div>
          <button
            onClick={listNFT}
            className="w-full bg-purple-500 text-black rounded p-2 shadow-lg font-bold"
            id="list-button"
          >
            List NFT
          </button>
        </div>
      </main>
    </div>
  );
}
