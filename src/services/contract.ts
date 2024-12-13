import Http, { PaginateData } from "@/tools/http";

export default class ContractService {
  /**
   * NFT集合查询
   * @returns
   */
  static listAll() {
    return Http.post<PaginateData<ContractDTO>>("/contract/listall");
  }

  static listItems(params: { address?: string; isSell?: boolean }) {
    return Http.post<PaginateData<ContractItemDTO>>(
      "/contract/listitems",
      null,
      {
        params,
      }
    );
  }

  static info(caddress: string) {
    return Http.post<ContractDTO>("/contract/info", null, {
      params: { caddress },
    });
  }
}

export type ContractItemDTO = {
  address: "0xf8eb6B50399f7Ca8360D68D9156760B043BD756E";
  tokenId: "39";
  categoryId: 0;
  royalties: "";
  nftVerify: 0;
  creator: "0x8a3080b08bCe64606Fd1682e55764D4CE6D8FeDE";
  user: null;
  txHash: null;
  imgUrl: string;
  metadataUrl: "ipfs://ipfs/QmTEJgLXdwibUkcpqjki5kNCv6bcE7ejTjcPa2JztQhVXR";
  metadataContent: '{"image":"ipfs://ipfs/Qmc2xUTDDH2duqeHknSUd4ZEnBv1VSSj7RVzhJH8skKySo","animation_url":"","external_url":"null/detail/0xf8eb6B50399f7Ca8360D68D9156760B043BD756E:39","name":"Sublayer","attributes":[]}';
  items: [
    {
      address: "0xf8eb6B50399f7Ca8360D68D9156760B043BD756E";
      tokenId: "39";
      price: "10000000000000000";
      paytokenAddress: "0x0000000000000000000000000000000000000000";
      paytokenName: "RING";
      paytokenDecimals: 18;
      paytokenSymbol: "RING";
      itemOwner: "0x8a3080b08bCe64606Fd1682e55764D4CE6D8FeDE";
      categoryId: 0;
      onsell: true;
      onsellTime: "2024-05-16T06:06:29.000+00:00";
      user: {
        address: "0x8a3080b08bCe64606Fd1682e55764D4CE6D8FeDE";
      };
    }
  ];
};

export type ContractItemMetaData = {
  animation_url: string;
  attributes: any[];
  external_url: string;
  image: string;
  name: string;
};

export type ContractDTO = {
  id: number;
  collectionCount: number;
  saleCount: number;
  price: number | null;
  createTime: "2024-05-09T06:28:14.000+00:00";
  updateTime: "2024-05-09T07:09:57.000+00:00";
  deleted: false;
  name: "Sublayer";
  symbol: "SLR";
  address: "0xf8eb6B50399f7Ca8360D68D9156760B043BD756E";
  shortUrl: null;
  version: null;
  cover: string;
  coverIpfs: string;
  storageId: null;
  owner: "0x8aab0d36dd9DD45ABCFeBd26C15735c08D0ee775";
  isAdmin: false;
  verify: false;
  description?: string;
  lastTokenId: 5;
  bannerUrl: null;
  getInfoTimes: 4;
  isRoyalties: false;
  supply: number;
  signer: "0x8aab0d36dd9DD45ABCFeBd26C15735c08D0ee775";
  isSync: false;
};
