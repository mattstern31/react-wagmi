import { getClient } from '../../client'
import {
  ConnectorNotFoundError,
  SwitchChainNotSupportedError,
} from '../../errors'
import type { Chain } from '../../types'

export type SwitchNetworkArgs = {
  chainId: number
}

export type SwitchNetworkResult = Chain

export async function switchNetwork({
  chainId,
}: SwitchNetworkArgs): Promise<SwitchNetworkResult> {
  const { connector } = getClient()
  if (!connector) throw new ConnectorNotFoundError()
  if (!connector.switchChain)
    throw new SwitchChainNotSupportedError({
      connector,
    })

  return connector.switchChain(chainId)
}
