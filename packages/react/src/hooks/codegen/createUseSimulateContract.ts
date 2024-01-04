import {
  type Config,
  type ResolvedRegister,
  type SimulateContractErrorType,
  type SimulateContractParameters,
} from '@wagmi/core'
import { type ScopeKeyParameter, type UnionPartial } from '@wagmi/core/internal'
import {
  type SimulateContractData,
  type SimulateContractQueryFnData,
  type SimulateContractQueryKey,
} from '@wagmi/core/query'
import {
  type Abi,
  type Address,
  type ContractFunctionArgs,
  type ContractFunctionName,
} from 'viem'

import {
  type ConfigParameter,
  type QueryParameter,
} from '../../types/properties.js'
import { useAccount } from '../useAccount.js'
import { useChainId } from '../useChainId.js'
import {
  type UseSimulateContractReturnType,
  useSimulateContract,
} from '../useSimulateContract.js'

type stateMutability = 'nonpayable' | 'payable'

export type CreateUseSimulateContractParameters<
  abi extends Abi | readonly unknown[],
  address extends Address | Record<number, Address> | undefined = undefined,
  functionName extends
    | ContractFunctionName<abi, stateMutability>
    | undefined = undefined,
> = {
  abi: abi | Abi | readonly unknown[]
  address?: address | Address | Record<number, Address> | undefined
  functionName?:
    | functionName
    | ContractFunctionName<abi, stateMutability>
    | undefined
}

export type CreateUseSimulateContractReturnType<
  abi extends Abi | readonly unknown[],
  address extends Address | Record<number, Address> | undefined,
  functionName extends ContractFunctionName<abi, stateMutability> | undefined,
> = <
  name extends functionName extends ContractFunctionName<abi, stateMutability>
    ? functionName
    : ContractFunctionName<abi, stateMutability>,
  args extends ContractFunctionArgs<abi, stateMutability, name>,
  config extends Config = ResolvedRegister['config'],
  chainId extends config['chains'][number]['id'] | undefined = undefined,
  selectData = SimulateContractData<abi, name, args, config, chainId>,
>(
  parameters?: {
    abi?: undefined
    address?: address extends undefined ? Address : undefined
    functionName?: functionName extends undefined ? name : undefined
    chainId?: address extends Record<number, Address>
      ?
          | keyof address
          | (chainId extends keyof address ? chainId : never)
          | undefined
      : chainId | number | undefined
  } & UnionPartial<
    // TODO: Take `abi` and `address` from above and omit from below (currently breaks inference)
    SimulateContractParameters<abi, name, args, config, chainId>
  > &
    ScopeKeyParameter &
    ConfigParameter<config> &
    QueryParameter<
      SimulateContractQueryFnData<abi, name, args, config, chainId>,
      SimulateContractErrorType,
      selectData,
      SimulateContractQueryKey<abi, name, args, config, chainId>
    >,
) => UseSimulateContractReturnType<abi, name, args, config, chainId, selectData>

export function createUseSimulateContract<
  const abi extends Abi | readonly unknown[],
  const address extends
    | Address
    | Record<number, Address>
    | undefined = undefined,
  functionName extends
    | ContractFunctionName<abi, stateMutability>
    | undefined = undefined,
>(
  config: CreateUseSimulateContractParameters<abi, address, functionName>,
): CreateUseSimulateContractReturnType<abi, address, functionName> {
  if (config.address !== undefined && typeof config.address === 'object')
    return (parameters) => {
      const configChainId = useChainId()
      const account = useAccount()
      const chainId =
        (parameters as { chainId?: number })?.chainId ??
        account.chainId ??
        configChainId
      return useSimulateContract({
        ...(parameters as any),
        ...(config.functionName ? { functionName: config.functionName } : {}),
        address: config.address?.[chainId],
        abi: config.abi,
      })
    }

  return (parameters) => {
    return useSimulateContract({
      ...(parameters as any),
      ...(config.address ? { address: config.address } : {}),
      ...(config.functionName ? { functionName: config.functionName } : {}),
      abi: config.abi,
    })
  }
}
