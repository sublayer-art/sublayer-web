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
    return Http.post<PaginateData<CollectionDTO>>("/user/collections", null, { params });
  }
}

export type CollectionDTO = {
  address: "0xf8eb6B50399f7Ca8360D68D9156760B043BD756E";
  tokenId: "12";
  categoryId: 0;
  royalties: "";
  nftVerify: 0;
  creator: "0x8a3080b08bCe64606Fd1682e55764D4CE6D8FeDE";
  user: null;
  txHash: null;
  metadataUrl: "ipfs://ipfs/QmPwKiXQntC2xj5haYrD6Q53YCnug9JPBF1ZHfsTX6Hupv";
  metadataContent: '{"image":"ipfs://ipfs/Qmc2xUTDDH2duqeHknSUd4ZEnBv1VSSj7RVzhJH8skKySo","animation_url":"","external_url":"null/detail/0xf8eb6B50399f7Ca8360D68D9156760B043BD756E:12","name":"Sublayer","attributes":[]}';
  items: [
    {
      address: "0xf8eb6B50399f7Ca8360D68D9156760B043BD756E";
      tokenId: "12";
      price: null;
      paytokenAddress: null;
      paytokenName: null;
      paytokenDecimals: 0;
      paytokenSymbol: null;
      itemOwner: "0x8a3080b08bCe64606Fd1682e55764D4CE6D8FeDE";
      categoryId: 0;
      onsell: false;
      onsellTime: null;
      user: {
        address: "0x8a3080b08bCe64606Fd1682e55764D4CE6D8FeDE";
      };
    }
  ];
};
