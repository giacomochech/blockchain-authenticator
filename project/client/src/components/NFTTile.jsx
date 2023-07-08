//import axie from "../tile.jpeg";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { GetIpfsUrlFromPinata } from "../pinata.js";

function NFTTile(data) {
  const newTo = {
    pathname: "/nftPage/" + data.data.tokenId,
  };

  const IPFSUrl = GetIpfsUrlFromPinata(data.data.image);

  return (
    <div className="border-2 ml-12 mt-5 mb-12 flex  rounded-lg w-48 md:w-72 shadow-2xl">
      <img
        src={IPFSUrl}
        alt=""
        className="w-72 h-80 rounded-lg object-cover"
        crossOrigin="anonymous"
        height={400}
        width={300}
      />
      <div className="text-black w-full p-2 bg-gradient-to-t from-[#454545] to-transparent rounded-lg pt-5 -mt-20">
        <strong className="text-xl">{data.data.name}</strong>
        <p className="display-inline">{data.data.description}</p>
        <p className="text-xl mt-2">{data.data.grade}</p>
      </div>
    </div>
  );
}

export default NFTTile;
