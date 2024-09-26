export const ExchangeV2Abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "oldValue",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newValue",
        type: "uint256",
      },
    ],
    name: "BuyerFeeAmountChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "hash",
        type: "bytes32",
      },
    ],
    name: "Cancel",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "oldValue",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newValue",
        type: "address",
      },
    ],
    name: "FeeReceiverChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "leftHash",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "rightHash",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newLeftFill",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newRightFill",
        type: "uint256",
      },
    ],
    name: "Match",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes4",
        name: "assetType",
        type: "bytes4",
      },
      {
        indexed: false,
        internalType: "address",
        name: "matcher",
        type: "address",
      },
    ],
    name: "MatcherChange",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "userAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address payable",
        name: "relayerAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "functionSignature",
        type: "bytes",
      },
    ],
    name: "MetaTransactionExecuted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes4",
        name: "assetType",
        type: "bytes4",
      },
      {
        indexed: false,
        internalType: "address",
        name: "proxy",
        type: "address",
      },
    ],
    name: "ProxyChange",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "oldValue",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newValue",
        type: "uint256",
      },
    ],
    name: "SellerFeeAmountChanged",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_transferProxy",
        type: "address",
      },
      {
        internalType: "address",
        name: "_erc20TransferProxy",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "newProtocolFee",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "newDefaultFeeReceiver",
        type: "address",
      },
      {
        internalType: "contract IRoyaltiesProvider",
        name: "newRoyaltiesProvider",
        type: "address",
      },
    ],
    name: "__ExchangeV2_init",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "maker",
            type: "address",
          },
          {
            components: [
              {
                components: [
                  {
                    internalType: "bytes4",
                    name: "assetClass",
                    type: "bytes4",
                  },
                  {
                    internalType: "bytes",
                    name: "data",
                    type: "bytes",
                  },
                ],
                internalType: "struct LibAsset.AssetType",
                name: "assetType",
                type: "tuple",
              },
              {
                internalType: "uint256",
                name: "value",
                type: "uint256",
              },
            ],
            internalType: "struct LibAsset.Asset",
            name: "makeAsset",
            type: "tuple",
          },
          {
            internalType: "address",
            name: "taker",
            type: "address",
          },
          {
            components: [
              {
                components: [
                  {
                    internalType: "bytes4",
                    name: "assetClass",
                    type: "bytes4",
                  },
                  {
                    internalType: "bytes",
                    name: "data",
                    type: "bytes",
                  },
                ],
                internalType: "struct LibAsset.AssetType",
                name: "assetType",
                type: "tuple",
              },
              {
                internalType: "uint256",
                name: "value",
                type: "uint256",
              },
            ],
            internalType: "struct LibAsset.Asset",
            name: "takeAsset",
            type: "tuple",
          },
          {
            internalType: "uint256",
            name: "salt",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "start",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "end",
            type: "uint256",
          },
          {
            internalType: "bytes4",
            name: "dataType",
            type: "bytes4",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
        ],
        internalType: "struct LibOrder.Order",
        name: "order",
        type: "tuple",
      },
    ],
    name: "cancel",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "bidMaker",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "bidNftAmount",
            type: "uint256",
          },
          {
            internalType: "bytes4",
            name: "nftAssetClass",
            type: "bytes4",
          },
          {
            internalType: "bytes",
            name: "nftData",
            type: "bytes",
          },
          {
            internalType: "uint256",
            name: "bidPaymentAmount",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "paymentToken",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "bidSalt",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "bidStart",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "bidEnd",
            type: "uint256",
          },
          {
            internalType: "bytes4",
            name: "bidDataType",
            type: "bytes4",
          },
          {
            internalType: "bytes",
            name: "bidData",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "bidSignature",
            type: "bytes",
          },
          {
            internalType: "uint256",
            name: "sellOrderPaymentAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "sellOrderNftAmount",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "sellOrderData",
            type: "bytes",
          },
        ],
        internalType: "struct LibDirectTransfer.AcceptBid",
        name: "direct",
        type: "tuple",
      },
    ],
    name: "directAcceptBid",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "sellOrderMaker",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "sellOrderNftAmount",
            type: "uint256",
          },
          {
            internalType: "bytes4",
            name: "nftAssetClass",
            type: "bytes4",
          },
          {
            internalType: "bytes",
            name: "nftData",
            type: "bytes",
          },
          {
            internalType: "uint256",
            name: "sellOrderPaymentAmount",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "paymentToken",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "sellOrderSalt",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "sellOrderStart",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "sellOrderEnd",
            type: "uint256",
          },
          {
            internalType: "bytes4",
            name: "sellOrderDataType",
            type: "bytes4",
          },
          {
            internalType: "bytes",
            name: "sellOrderData",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "sellOrderSignature",
            type: "bytes",
          },
          {
            internalType: "uint256",
            name: "buyOrderPaymentAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "buyOrderNftAmount",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "buyOrderData",
            type: "bytes",
          },
        ],
        internalType: "struct LibDirectTransfer.Purchase",
        name: "direct",
        type: "tuple",
      },
    ],
    name: "directPurchase",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "userAddress",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "functionSignature",
        type: "bytes",
      },
      {
        internalType: "bytes32",
        name: "sigR",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "sigS",
        type: "bytes32",
      },
      {
        internalType: "uint8",
        name: "sigV",
        type: "uint8",
      },
    ],
    name: "executeMetaTransaction",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "fills",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getNonce",
    outputs: [
      {
        internalType: "uint256",
        name: "nonce",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "maker",
            type: "address",
          },
          {
            components: [
              {
                components: [
                  {
                    internalType: "bytes4",
                    name: "assetClass",
                    type: "bytes4",
                  },
                  {
                    internalType: "bytes",
                    name: "data",
                    type: "bytes",
                  },
                ],
                internalType: "struct LibAsset.AssetType",
                name: "assetType",
                type: "tuple",
              },
              {
                internalType: "uint256",
                name: "value",
                type: "uint256",
              },
            ],
            internalType: "struct LibAsset.Asset",
            name: "makeAsset",
            type: "tuple",
          },
          {
            internalType: "address",
            name: "taker",
            type: "address",
          },
          {
            components: [
              {
                components: [
                  {
                    internalType: "bytes4",
                    name: "assetClass",
                    type: "bytes4",
                  },
                  {
                    internalType: "bytes",
                    name: "data",
                    type: "bytes",
                  },
                ],
                internalType: "struct LibAsset.AssetType",
                name: "assetType",
                type: "tuple",
              },
              {
                internalType: "uint256",
                name: "value",
                type: "uint256",
              },
            ],
            internalType: "struct LibAsset.Asset",
            name: "takeAsset",
            type: "tuple",
          },
          {
            internalType: "uint256",
            name: "salt",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "start",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "end",
            type: "uint256",
          },
          {
            internalType: "bytes4",
            name: "dataType",
            type: "bytes4",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
        ],
        internalType: "struct LibOrder.Order",
        name: "orderLeft",
        type: "tuple",
      },
      {
        internalType: "bytes",
        name: "signatureLeft",
        type: "bytes",
      },
      {
        components: [
          {
            internalType: "address",
            name: "maker",
            type: "address",
          },
          {
            components: [
              {
                components: [
                  {
                    internalType: "bytes4",
                    name: "assetClass",
                    type: "bytes4",
                  },
                  {
                    internalType: "bytes",
                    name: "data",
                    type: "bytes",
                  },
                ],
                internalType: "struct LibAsset.AssetType",
                name: "assetType",
                type: "tuple",
              },
              {
                internalType: "uint256",
                name: "value",
                type: "uint256",
              },
            ],
            internalType: "struct LibAsset.Asset",
            name: "makeAsset",
            type: "tuple",
          },
          {
            internalType: "address",
            name: "taker",
            type: "address",
          },
          {
            components: [
              {
                components: [
                  {
                    internalType: "bytes4",
                    name: "assetClass",
                    type: "bytes4",
                  },
                  {
                    internalType: "bytes",
                    name: "data",
                    type: "bytes",
                  },
                ],
                internalType: "struct LibAsset.AssetType",
                name: "assetType",
                type: "tuple",
              },
              {
                internalType: "uint256",
                name: "value",
                type: "uint256",
              },
            ],
            internalType: "struct LibAsset.Asset",
            name: "takeAsset",
            type: "tuple",
          },
          {
            internalType: "uint256",
            name: "salt",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "start",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "end",
            type: "uint256",
          },
          {
            internalType: "bytes4",
            name: "dataType",
            type: "bytes4",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
        ],
        internalType: "struct LibOrder.Order",
        name: "orderRight",
        type: "tuple",
      },
      {
        internalType: "bytes",
        name: "signatureRight",
        type: "bytes",
      },
    ],
    name: "matchOrders",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "protocolFee",
    outputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        internalType: "uint48",
        name: "buyerAmount",
        type: "uint48",
      },
      {
        internalType: "uint48",
        name: "sellerAmount",
        type: "uint48",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "royaltiesRegistry",
    outputs: [
      {
        internalType: "contract IRoyaltiesProvider",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_receiver",
        type: "address",
      },
      {
        internalType: "uint48",
        name: "_buyerAmount",
        type: "uint48",
      },
      {
        internalType: "uint48",
        name: "_sellerAmount",
        type: "uint48",
      },
    ],
    name: "setAllProtocolFeeData",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "assetType",
        type: "bytes4",
      },
      {
        internalType: "address",
        name: "matcher",
        type: "address",
      },
    ],
    name: "setAssetMatcher",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint48",
        name: "_buyerAmount",
        type: "uint48",
      },
    ],
    name: "setPrtocolFeeBuyerAmount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_receiver",
        type: "address",
      },
    ],
    name: "setPrtocolFeeReceiver",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint48",
        name: "_sellerAmount",
        type: "uint48",
      },
    ],
    name: "setPrtocolFeeSellerAmount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IRoyaltiesProvider",
        name: "newRoyaltiesRegistry",
        type: "address",
      },
    ],
    name: "setRoyaltiesRegistry",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "assetType",
        type: "bytes4",
      },
      {
        internalType: "address",
        name: "proxy",
        type: "address",
      },
    ],
    name: "setTransferProxy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
