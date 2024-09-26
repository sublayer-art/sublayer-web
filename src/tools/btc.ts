export function satToBtc(sat: string | number, decimals = 6) {
  const v = Number(sat) / Math.pow(10, 8);
  if (decimals) {
    return Math.ceil(v * 10 ** decimals) / 10 ** decimals;
  }
  return v;
}
export function btcToSat(btcValue: number) {
  return Math.floor(btcValue * Math.pow(10, 8));
}

export function previewInscribeUrl(inscirbeId: string) {
  return `https://testnet.ordinals.com/inscription/${inscirbeId}`;
}

export function viewAddressUrl(address: string) {
  return `https://mempool.space/testnet/address/${address}`;
}
