import { ContractDTO, ContractItemDTO } from "@/services/contract";
import { createContext, useContext } from "react";

export type TransactionType = "buy" | "sell";

export type StateOfTransactionType = {
  items: ContractItemDTO[];
  loading: boolean;
  hasMore: boolean;
  currentPage: number;
  selectedItems: Array<any>;
};

interface CollectionTradeState {
  collectionData?: ContractDTO;
  transactionType: TransactionType;
  buyState: StateOfTransactionType;
  sellState: StateOfTransactionType;
  loadItems: () => Promise<void>;
  onSelectItem: (item: any) => void;
  onSliderChange: (value: number) => void;
}

const CollectionTradeContext = createContext({} as CollectionTradeState);
export { CollectionTradeContext, useCollectionTradeContext };

function useCollectionTradeContext() {
  const context = useContext(CollectionTradeContext);
  return context;
}
