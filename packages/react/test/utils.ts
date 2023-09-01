import { act } from '@testing-library/react'
import type {
  Connector,
  PublicClient,
  WebSocketPublicClient,
} from '@wagmi/core'
import { MockConnector } from '@wagmi/core/connectors/mock'
import { goerli, mainnet } from 'viem/chains'
import { expect } from 'vitest'

import type { renderHook } from '.'
import { getPublicClient, getWalletClients } from '../../core/test/utils'
import type { CreateConfigParameters } from '../src'
import { createConfig } from '../src'
import type { UseAccountConfig } from '../src/hooks/accounts/useAccount'
import { useAccount as useAccount_ } from '../src/hooks/accounts/useAccount'
import { useNetwork as useNetwork_ } from '../src/hooks/accounts/useNetwork'

type Config = Partial<CreateConfigParameters>

export function setupConfig(config: Config = {}) {
  return createConfig<PublicClient, WebSocketPublicClient>({
    connectors: [
      new MockConnector({
        options: {
          walletClient: getWalletClients()[0]!,
        },
      }),
    ],
    publicClient: ({ chainId }) =>
      getPublicClient({ chainId, chains: [mainnet, goerli] }),
    ...config,
  })
}

export async function actConnect(config: {
  chainId?: number
  connector?: Connector
  utils: ReturnType<typeof renderHook<any, any>>
}) {
  const connector = config.connector
  const getConnect = (utils: ReturnType<typeof renderHook>) =>
    (utils.result.current as any)?.connect || utils.result.current
  const utils = config.utils

  await act(async () => {
    const connect = getConnect(utils)
    await connect.connectAsync?.({
      chainId: config.chainId,
      connector: connector ?? connect.connectors?.[0],
    })
  })

  const { waitFor } = utils
  await waitFor(() => expect(getConnect(utils).isSuccess).toBeTruthy())
}

export async function actDisconnect(config: {
  utils: ReturnType<typeof renderHook>
}) {
  const getDisconnect = (utils: ReturnType<typeof renderHook>) =>
    (utils.result.current as any)?.disconnect || utils.result.current
  const utils = config.utils

  await act(async () => {
    const disconnect = getDisconnect(utils)
    disconnect.disconnectAsync?.()
  })

  const { waitFor } = utils
  await waitFor(() => expect(getDisconnect(utils).isSuccess).toBeTruthy())
}

export async function actSwitchNetwork(config: {
  chainId: number
  utils: ReturnType<typeof renderHook>
}) {
  const chainId = config.chainId
  const getNetwork = (utils: ReturnType<typeof renderHook>) =>
    (utils.result.current as any)?.switchNetwork || utils.result.current
  const utils = config.utils

  await act(async () => {
    getNetwork(utils).switchNetwork(chainId)
  })

  const { waitFor } = utils
  await waitFor(() => expect(getNetwork(utils).isSuccess).toBeTruthy())
}

/**
 * `renderHook` in `@testing-library/react` doesn't play well
 * with tracked values, so we need to use custom hooks.
 */

export function useAccount(config: UseAccountConfig = {}) {
  const { ...values } = useAccount_(config)
  return values
}

export function useNetwork() {
  const { ...values } = useNetwork_()
  return values
}
