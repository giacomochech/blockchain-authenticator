import { useState } from "react";
import useEth from "./../contexts/EthContext/useEth";
import Contract from "./Contract";
import ContractBtns from "./ContractBtns";
import NoticeNoArtifact from "./NoticeNoArtifact";
import NoticeWrongNetwork from "./NoticeWrongNetwork";
import YourCollection from "./YourCollection";
import SellNFT from "./SellNFT1";
function Demo() {
  const { state } = useEth();
  const [value, setValue] = useState("");
  const demo = (
    <>
      <div className="contract-container">
        {/* <Contract  />
        <ContractBtns  /> */}
        <YourCollection />
        <SellNFT />
      </div>
    </>
  );

  return (
    <div className="demo">
      {/* <Title /> */}
      {!state.artifact ? (
        <NoticeNoArtifact />
      ) : !state.contract ? (
        <NoticeWrongNetwork />
      ) : (
        demo
      )}
    </div>
  );
}

export default Demo;
