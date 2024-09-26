import Http from "@/tools/http";

export default class InscribeService {
  static async createDeployOrder(data: {
    userWallet: string;
    receiveAddress: string;
    feeRate: string;
    tick: string;
    max: number;
    mintFee: number;
    file: File;
  }) {
    if (!data.file) throw Error("file is undefined");
    const formData = new FormData();
    formData.append("op", "deploy");
    formData.append("lim", "1");
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const value = (data as Record<string, any>)[key];
        formData.append(key, value);
      }
    }

    return Http.post("/nftInscription/orders/public/createOrder", formData);
  }

  static async createMintOrder(data: {
    userWallet: string;
    goodsId: string;
    feeRate: number;
  }) {
    return Http.post("/nftInscription/orders/public/mintOrderCreate", data);
  }

  static async queryOrders(params: {
    pageNumber?: number;
    pageSize?: number;
    userWallet?: string;
  }) {
    return Http.post("/nftInscription/orders/public/queryPage", params);
  }

  static async payConfirm(params: { tx: string; orderNo: string }) {
    return Http.post("/nftInscription/orders/public/payConfirm", params);
  }
}
