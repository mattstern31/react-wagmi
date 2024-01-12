import { expect, test } from 'vitest'

import * as react from './index.js'

test('exports', () => {
  expect(Object.keys(react)).toMatchInlineSnapshot(`
    [
      "WagmiContext",
      "WagmiProvider",
      "Context",
      "WagmiConfig",
      "BaseError",
      "WagmiProviderNotFoundError",
      "useAccount",
      "useAccountEffect",
      "useBalance",
      "useBlock",
      "useBlockNumber",
      "useBlockTransactionCount",
      "useCall",
      "useChainId",
      "useClient",
      "useConfig",
      "useConnect",
      "useConnections",
      "useConnectors",
      "useConnectorClient",
      "useDisconnect",
      "useEnsAddress",
      "useEnsAvatar",
      "useEnsName",
      "useEnsResolver",
      "useEstimateFeesPerGas",
      "useFeeData",
      "useEstimateGas",
      "useEstimateMaxPriorityFeePerGas",
      "useFeeHistory",
      "useGasPrice",
      "useInfiniteReadContracts",
      "useContractInfiniteReads",
      "useProof",
      "usePublicClient",
      "useReadContract",
      "useContractRead",
      "useReadContracts",
      "useContractReads",
      "useReconnect",
      "useSendTransaction",
      "useSignMessage",
      "useSignTypedData",
      "useSimulateContract",
      "useSwitchAccount",
      "useSwitchChain",
      "useToken",
      "useTransaction",
      "useTransactionCount",
      "useTransactionReceipt",
      "useVerifyMessage",
      "useVerifyTypedData",
      "useWalletClient",
      "useWaitForTransactionReceipt",
      "useWatchBlocks",
      "useWatchBlockNumber",
      "useWatchContractEvent",
      "useWatchPendingTransactions",
      "useWriteContract",
      "useContractWrite",
      "Hydrate",
      "createConfig",
      "createConnector",
      "ChainNotConfiguredError",
      "ConnectorAlreadyConnectedError",
      "ConnectorNotFoundError",
      "ConnectorAccountNotFoundError",
      "ProviderNotFoundError",
      "SwitchChainNotSupportedError",
      "createStorage",
      "noopStorage",
      "custom",
      "fallback",
      "http",
      "webSocket",
      "unstable_connector",
      "cookieStorage",
      "cookieToInitialState",
      "deepEqual",
      "deserialize",
      "normalizeChainId",
      "parseCookie",
      "serialize",
      "version",
    ]
  `)
})
