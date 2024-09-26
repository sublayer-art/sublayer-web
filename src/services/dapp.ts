import Http from "@/tools/http";

export default class DAPPService {
  /**
   * 返回签名的r s v(目前mint需要)
   * @param address
   * @returns
   */
  static signMessage(address: string) {
    return Http.post("/dapp/sign", { address }, { params: { address } });
  }
}
