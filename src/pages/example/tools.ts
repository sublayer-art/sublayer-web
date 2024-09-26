import { keccak256 } from "ethereumjs-util";
import Web3 from "web3";

const web3 = new Web3();
export function id(assetName: string) {
  return `0x${keccak256(assetName).toString("hex").substring(0, 8)}`;
}

function AssetType(assetClass: string, data: string): Example.AssetType {
  return { assetClass, data };
}

export function Asset(
  assetClass: string,
  assetData: string,
  value: number
): Example.Asset {
  return { assetType: AssetType(assetClass, assetData), value };
}

export function Order(
  maker: Address,
  makeAsset: Example.Asset,
  taker: string,
  takeAsset: Example.Asset,
  salt: number,
  start: number,
  end: number,
  dataType: string,
  data: string
) {
  return {
    maker,
    makeAsset,
    taker,
    takeAsset,
    salt,
    start,
    end,
    dataType,
    data,
  };
}

export function encToken(token: string, tokenId: number) {
  if (tokenId) {
    return web3.eth.abi.encodeParameters(
      ["address", "uint"],
      [token, tokenId]
    );
  } else {
    return web3.eth.abi.encodeParameter("address", token);
  }
}
export function enc(data: any) {
  console.log("enc", data);

  const types = ["[]", "[]", "bool"];
  return web3.eth.abi.encodeParameters(types, data);
}
