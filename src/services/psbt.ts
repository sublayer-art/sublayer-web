import Http from "@/tools/http";

export default class PSBTService {
  static async createListPSBT(data: {
    inscriptionOutput: string;
    price: number;
    sellerAddress: string;
  }) {
    return Http.post("/psbt/list", data);
  }

  static async createBuyPSBT(data: {
    payerAddress: string;
    receiverAddress: string;
    goodsItem: any;
    feeRate: number;
  }) {
    return Http.post("/psbt/buy", data);
  }

  static async submitSignedPSBT(signedStr: string) {
    return Http.post("/psbt/submit", { signedStr });
  }
  static async broadcastSignedPSBT(signedStr: string) {
    return Http.post("/psbt/broadcast", { signedStr });
  }
}
