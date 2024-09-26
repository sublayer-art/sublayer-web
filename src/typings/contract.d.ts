declare namespace Exchange {
  type Order = {
    maker: Address;
    taker: Address;
    salt: number;
    start: number;
    end: number;
    dataType: any;
    data: any;
  };

  type Asset = {
    assetType: {
      assetClass: string;
      data: string;
    };
    value: number;
  };
}
