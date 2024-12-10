import { ContractDTO, ContractItemDTO } from "@/services/contract";
import { createContext, useContext } from "react";

export type TransactionType = "buy" | "sell";

export type StateOfTransactionType = {
  items: ContractItemDTO[];
  loading: boolean;
  hasMore: boolean;
  currentPage: number;
};

interface CollectionTradeState {
  collectionData?: ContractDTO;
  transactionType: TransactionType;
  buyState: StateOfTransactionType;
  sellState: StateOfTransactionType;
  loadItems: () => Promise<void>;
  refresh: () => void;
}

const CollectionTradeContext = createContext({} as CollectionTradeState);
export { CollectionTradeContext, useCollectionTradeContext };

function useCollectionTradeContext() {
  const context = useContext(CollectionTradeContext);
  return context;
}
