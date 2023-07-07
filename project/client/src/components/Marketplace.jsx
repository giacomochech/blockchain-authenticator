import Navbar from "./Navigation";
import NFTTile from "./NFTTile";
import axios from "axios";
import { useState } from "react";
import useEth from "./../contexts/EthContext/useEth";
import { GetIpfsUrlFromPinata } from "../pinata.js";

export default function Marketplace() {
  const sampleData = [];
  const [data, updateData] = useState(sampleData);
  const [dataFetched, updateFetched] = useState(false);
  const {
    state: { contract, accounts },
  } = useEth();
  async function getAllNFTs() {
    const ethers = require("ethers");

    let transaction = await contract.methods
      .getAllNFTs()
      .call({ from: accounts[0] });

    //Fetch all the details of every NFT from the contract and display
    const items = await Promise.all(
      transaction.map(async (i) => {
        var tokenURI = await contract.methods
          .tokenURI(i.tokenId)
          .call({ from: accounts[0] });
        console.log("getting this tokenUri", tokenURI);
        tokenURI = GetIpfsUrlFromPinata(tokenURI);
        let meta = await axios.get(tokenURI);
        meta = meta.data;

        let price = ethers.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toString(),
          seller: i.seller,
          owner: i.owner,
          image: meta.image,
          name: meta.name,
          description: meta.description,
        };
        return item;
      })
    );

    updateFetched(true);
    updateData(items);
  }

  if (!dataFetched) getAllNFTs();

  return (
    <div>
      <div className="flex flex-col place-items-center mt-20">
        <div className="md:text-xl font-bold text-white">Top NFTs</div>
        <div className="flex mt-5 justify-between flex-wrap max-w-screen-xl text-center">
          {data.map((value, index) => {
            return <NFTTile data={value} key={index}></NFTTile>;
          })}
        </div>
      </div>
    </div>
  );
}
