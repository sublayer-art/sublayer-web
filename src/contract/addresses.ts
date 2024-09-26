export const ERC721RaribleFactoryC2Address: Record<string, AddressType> = {
  sepolia: "0xB020bA7fcF43DCc59eF0103624BD6FADE66d105E",
};
export const NFTAddress: Record<string, AddressType> = {
  sepolia: "0xf8eb6B50399f7Ca8360D68D9156760B043BD756E",
};
export const NftExchange: Record<string, AddressType> = {
  sepolia: "0xDe077A07E50d37B5971845C502209f5c7aD05927",
};
export const ExchangeOrdersHolder: Record<string, AddressType> = {
  sepolia: "0xbE27F9d8a77d2c9a52bb479d4bfA113C5437299D",
};
export const ExchangeState: Record<string, AddressType> = {
  sepolia: "0xbE382Feb99db228a2196c8Fe0068EaF3d897D093",
};
export const TransferProxy: Record<string, AddressType> = {
  sepolia: "0x2Ee141Ff5467Cf5e6a02c72E110ea846e14CF4de",
};
/**
 * ERC721RaribleFactoryC2部署的Token列表
 */
export const ERC721TokenAddress: Record<string, AddressType[]> = {
  sepolia: [
    "0x2C848b84E2b7745d0411226289f057183DbD8950",
    "0x3a0Bf922B6D3f6F006F33d88e7055e37323830C4",
  ],
};

export type AddressType = `0x${string}`;
