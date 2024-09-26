import Http from "@/tools/http";

export default class MarketService {
  /**
   * 上架
   * @param data
   * @returns
   */
  static async list(data: {
    goodsItemNo: string;
    goodsItemPrice: number;
    psbt: string;
  }) {
    return Http.post("/nftInscription/goodsItem/public/shelfGoodsItem", data);
  }

  /**
   * 下架
   * @param goodsItemNo
   * @returns
   */
  static async unlist(goodsItemNo: string) {
    return Http.get("/nftInscription/goodsItem/public/unShelfGoodsItem", {
      params: { goodsItemNo },
    });
  }

  static async queryCollections(params: {
    pageNumber: number;
    pageSize: number;
    goodsName?: string;
    isFree?: boolean;
    goodsSource?: "0" | "1"; // 商品来源：0=import，1=deploy
  }) {
    return Http.post("/nftInscription/goods/public/queryPage", params);
  }

  static async queryCollectionItems(params: {
    pageNumber?: number;
    pageSize?: number;
    goodsId: number;
    isOnSale?: boolean;
    isMint?: boolean;
  }) {
    return Http.post("/nftInscription/goodsItem/public/queryPage", params);
  }
}
