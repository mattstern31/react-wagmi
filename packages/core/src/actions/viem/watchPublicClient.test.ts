import { describe, expect, it } from 'vitest'

import { setupConfig } from '../../../test'
import { mainnet, optimism } from '../../chains'
import { connect } from '../accounts/connect'
import { disconnect } from '../accounts/disconnect'
import type { GetPublicClientResult } from './getPublicClient'
import { watchPublicClient } from './watchPublicClient'

describe('watchPublicClient', () => {
  it('callback receives data', async () => {
    const config = setupConfig()

    const publicClients: GetPublicClientResult[] = []
    const unwatch = watchPublicClient({}, (publicClient) =>
      publicClients.push(publicClient),
    )

    await connect({ connector: config.connectors[0]!, chainId: mainnet.id })
    await disconnect()
    await connect({ connector: config.connectors[0]!, chainId: optimism.id })
    await disconnect()
    await connect({ connector: config.connectors[0]!, chainId: mainnet.id })
    unwatch()

    expect(publicClients).toMatchInlineSnapshot(`
      [
        "<PublicClient network={10} />",
        "<PublicClient network={1} />",
      ]
    `)
  })
})
