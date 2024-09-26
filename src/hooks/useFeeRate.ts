import { useEffect, useState } from "react";

const baseMempoolUrl = "https://mempool.space/testnet";
const baseMempoolApiUrl = baseMempoolUrl + "/api";

export default function useRecommendedFeeRate() {
  const [feeRates, setFeeRates] = useState<{
    fastestFee: number;
    halfHourFee: number;
    hourFee: number;
    economyFee: number;
    minimumFee: number;
  }>();

  useEffect(() => {
    fetch(`${baseMempoolApiUrl}/v1/fees/recommended`)
      .then((response) => response.json())
      .then(setFeeRates);
  }, []);

  return { feeRates };
}
