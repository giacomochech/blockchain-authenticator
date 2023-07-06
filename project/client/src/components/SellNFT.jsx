import Navbar from "./Navigation";
import React, { useEffect } from "react";
import { useState } from "react";
import { ethers } from "ethers";
import { uploadFileToIPFS, uploadJSONToIPFS } from "./pinata";
import useEth from "../contexts/EthContext/useEth";
import { useParams } from "react-router-dom";

export default function SellNFT() {
  const [formParams, updateFormParams] = useState({
    name: "",
    description: "",
    grade: "",
    price: "",
  });
  const params = useParams();
  const tokenId = params.tokenId;
  const [tokenIdd, setTokenIdd] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
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
    const { name, grade, description, price } = formParams;
    //Make sure that none of the fields are empty
    if (!name || !grade || !description || !price || !fileURL) {
      updateMessage("Please fill all the fields!");
      return -1;
    }

    const nftJSON = {
      name,
      grade,
      description,
      price,
      image: fileURL,
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

      //After adding your Hardhat network to your metamask, this code will get providers and signers
      //const provider = new ethers.providers.Web3Provider(web3.currentProvider);
      //const signer = provider.getSigner();

      disableButton();
      updateMessage(
        "Uploading NFT(takes 5 mins).. please dont click anything!"
      );

      /*
            Pull the deployed contract instance
            let contract = new ethers.Contract(Marketplace.address, Marketplace.abi, signer)
            */

      //message the params to be sent to the create NFT request
      const price = ethers.parseUnits(formParams.price, "ether");
      let listingPrice = await contract.methods
        .getListPrice()
        .call({ from: accounts[0] });
      listingPrice = listingPrice.toString();

      //actually create the NFT
      let transaction = await contract.methods
        .createToken(metadataURL, price)
        .send({ from: accounts[0], value: listingPrice });
      //await transaction.wait();

      alert("Successfully listed your NFT!");
      enableButton();
      updateMessage("");
      updateFormParams({ name: "", description: "", price: "" });
      //window.location.replace("/") ***TODO: redirect to the main page
    } catch (e) {
      alert("Upload error" + e);
    }
  }

  async function sellNFT(tokenId, address) {
    // funzione per trasferire l'nft a un altro utente

    try {
      let transaction = await contract.methods
        .transferToken(tokenId, address)
        .send({ from: accounts[0] });
      //await transaction.wait();
      alert("Successfully transfer your NFT!");
    } catch (e) {
      alert("Transfer error" + e);
    }
  }

  //console.log("Working", process.env);
  return (
    <div className="">
      <Navbar></Navbar>
      <div className="flex flex-col place-items-center mt-10" id="nftForm">
        <form className="bg-white shadow-md rounded px-8 pt-4 pb-8 mb-4">
          <h3 className="text-center font-bold text-purple-500 mb-8">
            Upload your NFT to the marketplace
          </h3>
          <div className="mb-4">
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
              placeholder="Axie#4563"
              onChange={(e) =>
                updateFormParams({ ...formParams, name: e.target.value })
              }
              value={formParams.name}
            ></input>
          </div>
          <div className="mb-5">
            <label
              className="block text-purple-500 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Gradation
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="grade"
              type="text"
              placeholder="1-10"
              onChange={(e) =>
                updateFormParams({ ...formParams, grade: e.target.value })
              }
              value={formParams.grade}
            ></input>
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
              placeholder="Axie Infinity Collection"
              value={formParams.description}
              onChange={(e) =>
                updateFormParams({ ...formParams, description: e.target.value })
              }
            ></textarea>
          </div>
          <div className="mb-7">
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
            ></input>
          </div>
          <div>
            <label
              className="block text-purple-500 text-sm font-bold mb-2"
              htmlFor="image"
            >
              Upload Image (&lt;500 KB)
            </label>
            <input type={"file"} onChange={OnChangeFile}></input>
          </div>
          <br></br>
          <div className="text-red-500 text-center">{message}</div>
          <button
            onClick={listNFT}
            className="font-bold mt-10 w-full bg-purple-500 text-white rounded p-2 shadow-lg"
            id="list-button"
          >
            List NFT
          </button>
        </form>

        <div>
          <h3>Sell NFT</h3>
          <form onSubmit={sellNFT(tokenId, recipientAddress)}>
            {/* <label>
              Token ID:
              <input
                type="number"
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
              />
            </label> */}
            <br />
            <label>
              Recipient Address:
              <input
                type="text"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
              />
            </label>
            <br />
            <button type="submit">Sell NFT</button>
          </form>
        </div>
      </div>
    </div>
  );
}