export { createConfig } from './config'
export type { Config, CreateConfigParameters } from './config'

export { Context, WagmiConfig, useConfig } from './context'
export type { WagmiConfigProps } from './context'

export {
  paginatedIndexesConfig,
  useAccount,
  useBalance,
  useBlockNumber,
  useChainId,
  useConnect,
  useContractEvent,
  useContractInfiniteReads,
  useContractRead,
  useContractReads,
  useContractWrite,
  useDisconnect,
  useEnsAddress,
  useEnsAvatar,
  useEnsName,
  useEnsResolver,
  useFeeData,
  useInfiniteQuery,
  useMutation,
  useNetwork,
  usePublicClient,
  useQuery,
  useQueryClient,
  useSendTransaction,
  usePrepareContractWrite,
  usePrepareSendTransaction,
  useSignMessage,
  useSignTypedData,
  useSwitchNetwork,
  useToken,
  useTransaction,
  useWaitForTransaction,
  useWalletClient,
  useWatchPendingTransactions,
  useWebSocketPublicClient,
  type UseContractEventConfig,
  type UseContractInfiniteReadsConfig,
  type UseContractReadConfig,
  type UseContractReadsConfig,
  type UseContractWriteConfig,
  type UsePrepareContractWriteConfig,
} from './hooks'

export {
  ChainMismatchError,
  ChainNotConfiguredError,
  Connector,
  ConnectorAlreadyConnectedError,
  ConnectorNotFoundError,
  ConfigChainsNotFound,
  SwitchChainNotSupportedError,
  configureChains,
  createStorage,
  deepEqual,
  deserialize,
  erc20ABI,
  erc721ABI,
  erc4626ABI,
  readContracts,
  serialize,
} from '@wagmi/core'
export type {
  ChainProviderFn,
  ConnectorData,
  ConnectorEvents,
  PublicClient,
  Storage,
  Unit,
  WalletClient,
  WebSocketPublicClient,
  WindowProvider,
} from '@wagmi/core'

export type { Address } from 'viem'
export { mainnet, sepolia, type Chain } from 'viem/chains'
