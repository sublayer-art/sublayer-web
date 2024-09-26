declare namespace Example {
  type AssetType = {
    assetClass: string;
    data: string;
  };

  type Asset = {
    assetType: AssetType;
    value: number;
  };
}
