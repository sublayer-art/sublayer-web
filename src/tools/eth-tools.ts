import Web3 from "web3";

export function wei2Eth(wei?: bigint | string, decimals = 6) {
  if (!wei) return 0;
  const v = Number(wei) / 1e18; // 1 RING = 10^18 Gwei
  if (decimals) {
    return Math.ceil(v * 10 ** decimals) / 10 ** decimals;
  }
  return v;
}

export function eth2Wei(eth: number) {
  if (!eth) return "0";
  return Web3.utils.toWei(eth, "ether");
}

export const UINT256_MAX = "1";
