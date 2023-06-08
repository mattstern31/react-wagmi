import { connect } from '@wagmi/core'
import { MockConnector } from '@wagmi/core/connectors/mock'
import { describe, expect, it } from 'vitest'

import {
  act,
  actConnect,
  getWalletClients,
  renderHook,
  setupConfig,
} from '../../../test'
import type { UseConnectArgs, UseConnectConfig } from './useConnect'
import { useConnect } from './useConnect'
import type {
  UseSwitchNetworkArgs,
  UseSwitchNetworkConfig,
} from './useSwitchNetwork'
import { useSwitchNetwork } from './useSwitchNetwork'

function useSwitchNetworkWithConnect(
  config: {
    connect?: UseConnectArgs & UseConnectConfig
    network?: UseSwitchNetworkArgs & UseSwitchNetworkConfig
  } = {},
) {
  return {
    connect: useConnect(config.connect),
    network: useSwitchNetwork(config.network),
  }
}

describe('useSwitchNetwork', () => {
  describe('mounts', () => {
    it('is connected', async () => {
      const config = setupConfig()
      await connect({ connector: config.connectors[0]! })

      const { result, waitFor } = renderHook(() => useSwitchNetwork(), {
        initialProps: { config },
      })

      await waitFor(() => expect(result.current.isIdle).toBeTruthy())

      const { chains, ...res } = result.current
      expect(chains.length).toMatchInlineSnapshot('2')
      expect(res).toMatchInlineSnapshot(`
        {
          "data": undefined,
          "error": null,
          "isError": false,
          "isIdle": true,
          "isLoading": false,
          "isSuccess": false,
          "pendingChainId": undefined,
          "reset": [Function],
          "status": "idle",
          "switchNetwork": [Function],
          "switchNetworkAsync": [Function],
          "variables": undefined,
        }
      `)
    })

    it('is not connected', async () => {
      const { result, waitFor } = renderHook(() => useSwitchNetwork())

      await waitFor(() => expect(result.current.isIdle).toBeTruthy())

      const { chains, ...res } = result.current
      expect(chains.length).toMatchInlineSnapshot('0')
      expect(res).toMatchInlineSnapshot(`
        {
          "data": undefined,
          "error": null,
          "isError": false,
          "isIdle": true,
          "isLoading": false,
          "isSuccess": false,
          "pendingChainId": undefined,
          "reset": [Function],
          "status": "idle",
          "switchNetwork": undefined,
          "switchNetworkAsync": undefined,
          "variables": undefined,
        }
      `)
    })
  })

  describe('configuration', () => {
    it('chainId', async () => {
      const { result, waitFor } = renderHook(() =>
        useSwitchNetwork({ chainId: 1 }),
      )

      await waitFor(() => expect(result.current.isIdle).toBeTruthy())

      const { chains, ...res } = result.current
      expect(chains.length).toMatchInlineSnapshot('0')
      expect(res).toMatchInlineSnapshot(`
        {
          "data": undefined,
          "error": null,
          "isError": false,
          "isIdle": true,
          "isLoading": false,
          "isSuccess": false,
          "pendingChainId": undefined,
          "reset": [Function],
          "status": "idle",
          "switchNetwork": undefined,
          "switchNetworkAsync": undefined,
          "variables": undefined,
        }
      `)
    })

    it('throwForSwitchChainNotSupported', async () => {
      const connector = new MockConnector({
        options: {
          flags: { noSwitchChain: true },
          walletClient: getWalletClients()[0]!,
        },
      })
      const utils = renderHook(() =>
        useSwitchNetworkWithConnect({
          connect: { connector },
          network: {
            chainId: 4,
            throwForSwitchChainNotSupported: true,
          },
        }),
      )
      const { result, waitFor } = utils

      await actConnect({ utils, connector })
      await act(async () => result.current.network.switchNetwork?.())

      await waitFor(() => expect(result.current.network.isError).toBeTruthy())

      expect(result.current.network.error).toMatchInlineSnapshot(
        `[SwitchChainNotSupportedError: "Mock" does not support programmatic chain switching.]`,
      )
    })
  })

  describe('return value', () => {
    describe('switchNetwork', () => {
      it('uses configuration', async () => {
        const utils = renderHook(() =>
          useSwitchNetworkWithConnect({
            network: {
              chainId: 4,
            },
          }),
        )
        const { result, waitFor } = utils

        await actConnect({ utils })

        await act(async () => result.current.network.switchNetwork?.())
        await waitFor(() =>
          expect(result.current.network.isSuccess).toBeTruthy(),
        )

        const { chains, data, ...res } = result.current.network
        expect(data?.id).toMatchInlineSnapshot('4')
        expect(chains.length).toMatchInlineSnapshot('2')
        expect(res).toMatchInlineSnapshot(`
          {
            "error": null,
            "isError": false,
            "isIdle": false,
            "isLoading": false,
            "isSuccess": true,
            "pendingChainId": 4,
            "reset": [Function],
            "status": "success",
            "switchNetwork": [Function],
            "switchNetworkAsync": [Function],
            "variables": {
              "chainId": 4,
            },
          }
        `)
      })

      it('uses deferred args', async () => {
        const utils = renderHook(() => useSwitchNetworkWithConnect())
        const { result, waitFor } = utils

        await actConnect({ utils })

        await act(async () => result.current.network.switchNetwork?.(4))

        await waitFor(() =>
          expect(result.current.network.isSuccess).toBeTruthy(),
        )

        const { chains, data, ...res } = result.current.network
        expect(data?.id).toMatchInlineSnapshot('4')
        expect(chains.length).toMatchInlineSnapshot('2')
        expect(res).toMatchInlineSnapshot(`
          {
            "error": null,
            "isError": false,
            "isIdle": false,
            "isLoading": false,
            "isSuccess": true,
            "pendingChainId": 4,
            "reset": [Function],
            "status": "success",
            "switchNetwork": [Function],
            "switchNetworkAsync": [Function],
            "variables": {
              "chainId": 4,
            },
          }
        `)
      })

      it('fails', async () => {
        const connector = new MockConnector({
          options: {
            flags: { failSwitchChain: true },
            walletClient: getWalletClients()[0]!,
          },
        })
        const utils = renderHook(() =>
          useSwitchNetworkWithConnect({
            connect: { connector },
          }),
        )
        const { result, waitFor } = utils

        await actConnect({ utils, connector })
        await act(async () => result.current.network.switchNetwork?.(4))
        await waitFor(() => expect(result.current.network.isError).toBeTruthy())

        const { chains, ...res } = result.current.network
        expect(chains.length).toMatchInlineSnapshot('2')
        expect(res).toMatchInlineSnapshot(`
          {
            "data": undefined,
            "error": [UserRejectedRequestError: User rejected the request.

          Details: Failed to switch chain.
          Version: viem@1.0.0],
            "isError": true,
            "isIdle": false,
            "isLoading": false,
            "isSuccess": false,
            "pendingChainId": 4,
            "reset": [Function],
            "status": "error",
            "switchNetwork": [Function],
            "switchNetworkAsync": [Function],
            "variables": {
              "chainId": 4,
            },
          }
        `)
      })

      it('unsupported chain', async () => {
        const utils = renderHook(() =>
          useSwitchNetworkWithConnect({
            network: { chainId: 69 },
          }),
        )
        const { result, waitFor } = utils

        await actConnect({ utils })

        await act(async () => result.current.network.switchNetwork?.())

        await waitFor(() =>
          expect(result.current.network.isSuccess).toBeTruthy(),
        )

        const { chains, data, ...res } = result.current.network
        expect(data?.id).toMatchInlineSnapshot('69')
        expect(chains.length).toMatchInlineSnapshot('2')
        expect(res).toMatchInlineSnapshot(`
          {
            "error": null,
            "isError": false,
            "isIdle": false,
            "isLoading": false,
            "isSuccess": true,
            "pendingChainId": 69,
            "reset": [Function],
            "status": "success",
            "switchNetwork": [Function],
            "switchNetworkAsync": [Function],
            "variables": {
              "chainId": 69,
            },
          }
        `)
      })
    })

    describe('switchNetworkAsync', () => {
      it('uses configuration', async () => {
        const utils = renderHook(() =>
          useSwitchNetworkWithConnect({
            network: {
              chainId: 5,
            },
          }),
        )
        const { result, waitFor } = utils

        await actConnect({ utils })

        await act(async () => {
          const res = await result.current.network.switchNetworkAsync?.()
          expect(res).toMatchInlineSnapshot(`
            {
              "blockExplorers": {
                "default": {
                  "name": "Etherscan",
                  "url": "https://goerli.etherscan.io",
                },
                "etherscan": {
                  "name": "Etherscan",
                  "url": "https://goerli.etherscan.io",
                },
              },
              "contracts": {
                "ensRegistry": {
                  "address": "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
                },
                "ensUniversalResolver": {
                  "address": "0x56522D00C410a43BFfDF00a9A569489297385790",
                  "blockCreated": 8765204,
                },
                "multicall3": {
                  "address": "0xca11bde05977b3631167028862be2a173976ca11",
                  "blockCreated": 6507670,
                },
              },
              "id": 5,
              "name": "Goerli",
              "nativeCurrency": {
                "decimals": 18,
                "name": "Goerli Ether",
                "symbol": "ETH",
              },
              "network": "goerli",
              "rpcUrls": {
                "alchemy": {
                  "http": [
                    "https://eth-goerli.g.alchemy.com/v2",
                  ],
                  "webSocket": [
                    "wss://eth-goerli.g.alchemy.com/v2",
                  ],
                },
                "default": {
                  "http": [
                    "https://rpc.ankr.com/eth_goerli",
                  ],
                },
                "infura": {
                  "http": [
                    "https://goerli.infura.io/v3",
                  ],
                  "webSocket": [
                    "wss://goerli.infura.io/ws/v3",
                  ],
                },
                "public": {
                  "http": [
                    "https://rpc.ankr.com/eth_goerli",
                  ],
                },
              },
              "testnet": true,
            }
          `)
        })

        await waitFor(() =>
          expect(result.current.network.isSuccess).toBeTruthy(),
        )
      })

      it('throws error', async () => {
        const connector = new MockConnector({
          options: {
            flags: { failSwitchChain: true },
            walletClient: getWalletClients()[0]!,
          },
        })
        const utils = renderHook(() =>
          useSwitchNetworkWithConnect({
            connect: { connector },
          }),
        )
        const { result, waitFor } = utils

        await actConnect({ utils, connector })

        await act(async () => {
          await expect(
            result.current.network.switchNetworkAsync?.(4),
          ).rejects.toThrowErrorMatchingInlineSnapshot(
            `
            "User rejected the request.

            Details: Failed to switch chain.
            Version: viem@1.0.0"
          `,
          )
        })

        await waitFor(() => expect(result.current.network.isError).toBeTruthy())
      })
    })
  })

  describe('behavior', () => {
    it('connector does not support programmatic switching', async () => {
      const connector = new MockConnector({
        options: {
          flags: { noSwitchChain: true },
          walletClient: getWalletClients()[0]!,
        },
      })
      const utils = renderHook(() =>
        useSwitchNetworkWithConnect({
          connect: { connector },
        }),
      )
      const { result } = utils

      await actConnect({ utils, connector })

      await act(async () => {
        try {
          result.current.network.switchNetwork?.(4)
        } catch (error) {
          expect(error).toMatchInlineSnapshot(
            '[TypeError: result.current.network.switchNetwork is not a function]',
          )
        }
      })
    })
  })
})
