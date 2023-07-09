
import NFTTile from "./NFTTile";
import axios from "axios";
import { useState, useEffect } from "react";
import { GetIpfsUrlFromPinata } from "../pinata";
import useEth from "./../contexts/EthContext/useEth";

export default function Marketplace() {
  const sampleData = [];
  const [data, updateData] = useState(sampleData);
  const [dataFetched, updateFetched] = useState(false);
  const {
    state: { contract, accounts },
  } = useEth();
  
  async function getAllNFTs() {
    const ethers = require("ethers");
   
    //console.log("AAAAA", accounts[0]) //LOG
    let transaction = await contract.methods
      .getAllMyNFTs()
      .call({ from: accounts[0] });
    //console.log("transaction:", transaction); //LOG

    //Fetch all the details of every NFT from the contract and display
    const items = await Promise.all(
      transaction.map(async i => {
        //console.log("getting this tokenId", i.tokenID); //LOG
        var tokenURI = await contract.methods
          .tokenURI(i.tokenID)
          .call({ from: accounts[0] });
        //console.log("getting this tokenUri", tokenURI); //LOG
        tokenURI = GetIpfsUrlFromPinata(tokenURI);
        let meta = await axios.get(tokenURI);
        meta = meta.data;

        let price = ethers.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenID.toString(),
          seller: i.seller,
          owner: i.owner,
          image: meta.image,
          name: meta.name,
          grade: meta.grade,
          description: meta.description,
          cardCode: meta.cardCode
        };
        return item;
      }))

    updateFetched(true);
    updateData(items);
  }

  try{
    if (!dataFetched) getAllNFTs();
  }
  catch(e){
    console.log("error fetching NFTs", e);
  }

  return (
    <div>
      <div className="flex flex-col place-items-center mt-20">
        <div className="flex mt-5 justify-between flex-wrap max-w-screen-xl text-center">
          {data.map((value, index) => {
            return <NFTTile data={value} key={index}></NFTTile>;
          })}
        </div>
      </div>
    </div>
  );
}
