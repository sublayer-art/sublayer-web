import Http from "@/tools/http";

export default class OrderService {
  static list(params: {
    caddress?: string;
    tokenId?: string;
    owner?: string;
    type?: TxType;
  }) {
    return Http.post("/order/get", null, {
      params,
    });
  }

  static prepare(params: OrderParamsDTO) {
    return Http.post("/order/prepare", null, { params });
  }
  static add(params: OrderParamsDTO) {
    return Http.post("/order/add", null, { params });
  }

  static buy(params: {
    type: OrderType;
    sellToken: string;
    sellTokenId: string;
    owner: string;
    salt: string;
  }) {
    return Http.post("/order/buyerFee", null, { params });
  }
}

// RING("RING", 0), ERC20("ERC20", 1), ERC721("ERC721", 3), ERC721Deprecated("ERC721Deprecated", 4);
type TxType = "0" | "1" | "3" | "4";

// SALE(1), BID(2);
type OrderType = "1" | "2";

type OrderParamsDTO = {
  type: OrderType;
  owner: string;
  sellToken: string;
  sellTokenId: string;
  sellValue: string;
  sellType: TxType;
  buyToken: string;
  buyTokenId: string;
  buyValue: string;
  buyType: TxType;
  sellFee?: string;
  salt: string;
  signature?: string;
  nftItemsId?: string;
  message?: string;
  quantity: number;
  buyFee?: string;
  r: string;
  s: string;
  v: string;
};
