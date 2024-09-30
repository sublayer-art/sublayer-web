import Http from "@/tools/http";

export default class NFTService {
  static add(params: {
    nft: {
      contractId: number;
      address: string;
      categoryId: 0;
      imgUrl: string;
      storageId: number;
      tokenId: "";
      locked: true;
      lockedContent: "";
      name: string;
      description?: string;
      royalties: "";
      properties: "";
      nftVerify: 0;
      isSync: true;
      creator: string;
      txHash: string;
      animUrl: "";
      animStorageId: 0;
      metadataUrl: "";
      metadataContent: "";
      getMetaTimes: 0;
    };
    address: string;
  }) {
    return Http.post("/nft/add", {}, { params });
  }

  static nftHistory() {
    return Http.post("/nft/history");
  }
}

export type ContractDTO = {
  id: 1;
  createTime: "2024-05-09T06:28:14.000+00:00";
  updateTime: "2024-05-09T07:09:57.000+00:00";
  deleted: false;
  name: "Sublayer";
  symbol: "SLR";
  address: "0xf8eb6B50399f7Ca8360D68D9156760B043BD756E";
  shortUrl: null;
  version: null;
  cover: null;
  storageId: null;
  owner: "0x8aab0d36dd9DD45ABCFeBd26C15735c08D0ee775";
  isAdmin: false;
  verify: false;
  description: null;
  lastTokenId: 5;
  bannerUrl: null;
  getInfoTimes: 4;
  isRoyalties: false;
  signer: "0x8aab0d36dd9DD45ABCFeBd26C15735c08D0ee775";
  isSync: false;
};
