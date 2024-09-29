import Http, { PaginateData } from "@/tools/http";

export default class UserService {
  /**
   * 用户使用钱包签名登录，返回Token
   * @param data
   */
  static loginWithSignature(data: {
    userAddress: string;
    signature: string;
    timestamp: number;
  }) {
    return Http.post("/user/login", data, {
      params: data,
    });
  }

  static nftList(params: {
    creator?: string;
    owner?: string;
    address?: string;
    tokenId?: string;
  }) {
    return Http.post<PaginateData<any>>("/user/nftlist", {}, { params });
  }
  static collectionList(params: { address: string }) {
    return Http.post<PaginateData<CollectionDTO>>("/user/collections", null, {
      params,
    });
  }
}

export type CollectionDTO = {
  address: "0x6f262Bac05a66A8744C6278B0956a8696c6Bc33e";
  tokenId: "2";
  categoryId: 0;
  imgUrl: string;
  royalties: "";
  nftVerify: 0;
  creator: "0xf42220e63E90067C5387cc42fF796DD16F2a9A53";
  user: null;
  txHash: null;
  metadataUrl: "ipfs://ipfs/QmY92TJCPhAbYbqHzVxVK61kr3YJdTzZ6v9f5eE1THnAEB";
  metadataContent: '{"animation_url":"","external_url":"https://sublayer.art/detail/0x6f262Bac05a66A8744C6278B0956a8696c6Bc33e:2","name":"Zodiac Mouse","attributes":[]}';
  items: [
    {
      address: "0x6f262Bac05a66A8744C6278B0956a8696c6Bc33e";
      tokenId: "2";
      price: null;
      paytokenAddress: null;
      paytokenName: null;
      paytokenDecimals: 0;
      paytokenSymbol: null;
      itemOwner: "0xf42220e63E90067C5387cc42fF796DD16F2a9A53";
      categoryId: 0;
      onsell: false;
      onsellTime: null;
      user: {
        address: "0xf42220e63E90067C5387cc42fF796DD16F2a9A53";
      };
    }
  ];
};
