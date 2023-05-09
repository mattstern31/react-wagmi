import type { SwitchNetworkArgs, SwitchNetworkResult } from '@wagmi/core'
import { switchNetwork } from '@wagmi/core'
import * as React from 'react'

import { useConfig } from '../../context'
import type { MutationConfig } from '../../types'
import { useForceUpdate, useMutation } from '../utils'

export type UseSwitchNetworkArgs = Partial<SwitchNetworkArgs>

export type UseSwitchNetworkConfig = MutationConfig<
  SwitchNetworkResult,
  Error,
  SwitchNetworkArgs
> & {
  throwForSwitchChainNotSupported?: boolean
}

export const mutationKey = (args: UseSwitchNetworkArgs) =>
  [{ entity: 'switchNetwork', ...args }] as const

const mutationFn = (args: UseSwitchNetworkArgs) => {
  const { chainId } = args
  if (!chainId) throw new Error('chainId is required')
  return switchNetwork({ chainId })
}

export function useSwitchNetwork({
  chainId,
  throwForSwitchChainNotSupported,
  onError,
  onMutate,
  onSettled,
  onSuccess,
}: UseSwitchNetworkArgs & UseSwitchNetworkConfig = {}) {
  const config = useConfig()
  const forceUpdate = useForceUpdate()

  const {
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    mutate,
    mutateAsync,
    reset,
    status,
    variables,
  } = useMutation(mutationKey({ chainId }), mutationFn, {
    onError,
    onMutate,
    onSettled,
    onSuccess,
  })

  const switchNetwork_ = React.useCallback(
    (chainId_?: SwitchNetworkArgs['chainId']) =>
      mutate({ chainId: chainId_ ?? chainId } as SwitchNetworkArgs),
    [chainId, mutate],
  )

  const switchNetworkAsync_ = React.useCallback(
    (chainId_?: SwitchNetworkArgs['chainId']) =>
      mutateAsync({ chainId: chainId_ ?? chainId } as SwitchNetworkArgs),
    [chainId, mutateAsync],
  )

  // Trigger update when connector changes since not all connectors support chain switching
  React.useEffect(() => {
    const unwatch = config.subscribe(
      ({ chains, connector }) => ({
        chains,
        connector,
      }),
      forceUpdate,
    )
    return unwatch
  }, [config, forceUpdate])

  let switchNetwork
  let switchNetworkAsync
  const supportsSwitchChain = !!config.connector?.switchChain
  if (throwForSwitchChainNotSupported || supportsSwitchChain) {
    switchNetwork = switchNetwork_
    switchNetworkAsync = switchNetworkAsync_
  }

  return {
    chains: config.chains ?? [],
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    pendingChainId: variables?.chainId,
    reset,
    status,
    switchNetwork,
    switchNetworkAsync,
    variables,
  } as const
}
