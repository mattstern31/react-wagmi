import type { ResolvedConfig } from 'abitype'
import type { MulticallResult } from 'viem'
import { assertType, describe, expect, it } from 'vitest'

import {
  act,
  mlootContractConfig,
  renderHook,
  wagmigotchiContractConfig,
} from '../../../test'
import { useContractReads } from './useContractReads'

const contracts = [
  {
    ...wagmigotchiContractConfig,
    functionName: 'love',
    args: ['0x27a69ffba1e939ddcfecc8c7e0f967b872bac65c'],
  },
  {
    ...wagmigotchiContractConfig,
    functionName: 'love',
    args: ['0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC'],
  },
  { ...wagmigotchiContractConfig, functionName: 'getAlive' },
  {
    ...mlootContractConfig,
    functionName: 'tokenOfOwnerByIndex',
    args: ['0xA0Cf798816D4b9b9866b5330EEa46a18382f251e', 0n],
  },
] as const

describe('useContractRead', () => {
  it('mounts', async () => {
    const { result, waitFor } = renderHook(() =>
      useContractReads({ contracts }),
    )

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy())
    const { internal: _, ...res } = result.current
    assertType<
      | [
          MulticallResult<ResolvedConfig['BigIntType']>,
          MulticallResult<ResolvedConfig['BigIntType']>,
          MulticallResult<boolean>,
          MulticallResult<ResolvedConfig['BigIntType']>,
        ]
      | undefined
    >(res.data)
    expect(res).toMatchInlineSnapshot(`
      {
        "data": [
          {
            "result": 2n,
            "status": "success",
          },
          {
            "result": 1n,
            "status": "success",
          },
          {
            "result": false,
            "status": "success",
          },
          {
            "result": 370395n,
            "status": "success",
          },
        ],
        "error": null,
        "fetchStatus": "idle",
        "isError": false,
        "isFetched": true,
        "isFetchedAfterMount": true,
        "isFetching": false,
        "isIdle": false,
        "isLoading": false,
        "isRefetching": false,
        "isSuccess": true,
        "refetch": [Function],
        "status": "success",
      }
    `)
  })

  describe('configuration', () => {
    it('allowFailure=false', async () => {
      const { result, waitFor } = renderHook(() =>
        useContractReads({ allowFailure: false, contracts }),
      )

      await waitFor(() => expect(result.current.isSuccess).toBeTruthy())

      const { internal: _, ...res } = result.current
      assertType<
        | [
            ResolvedConfig['BigIntType'],
            ResolvedConfig['BigIntType'],
            boolean,
            ResolvedConfig['BigIntType'],
          ]
        | undefined
      >(res.data)
      expect(res.data).toMatchInlineSnapshot(`
        [
          2n,
          1n,
          false,
          370395n,
        ]
      `)
    })

    it('scopeKey', async () => {
      const { result, waitFor } = renderHook(() => {
        return {
          contractReads: useContractReads({
            contracts,
          }),
          contractReadswithoutScopeKey: useContractReads({
            contracts,
            enabled: false,
          }),
          contractReadswithScopeKey: useContractReads({
            contracts,
            scopeKey: 'wagmi',
            enabled: false,
          }),
        }
      })

      await waitFor(() =>
        expect(result.current.contractReads.isSuccess).toBeTruthy(),
      )
      await waitFor(() =>
        expect(
          result.current.contractReadswithoutScopeKey.isSuccess,
        ).toBeTruthy(),
      )
      await waitFor(() =>
        expect(result.current.contractReadswithScopeKey.isIdle).toBeTruthy(),
      )
    })

    it('chainId', async () => {
      const { result, waitFor } = renderHook(() =>
        useContractReads({
          contracts: contracts.map((contract) => ({ ...contract, chainId: 1 })),
        }),
      )

      await waitFor(() => expect(result.current.isSuccess).toBeTruthy())

      const { internal: _, ...res } = result.current
      expect(res).toMatchInlineSnapshot(`
        {
          "data": [
            {
              "result": 2n,
              "status": "success",
            },
            {
              "result": 1n,
              "status": "success",
            },
            {
              "result": false,
              "status": "success",
            },
            {
              "result": 370395n,
              "status": "success",
            },
          ],
          "error": null,
          "fetchStatus": "idle",
          "isError": false,
          "isFetched": true,
          "isFetchedAfterMount": true,
          "isFetching": false,
          "isIdle": false,
          "isLoading": false,
          "isRefetching": false,
          "isSuccess": true,
          "refetch": [Function],
          "status": "success",
        }
      `)
    })

    it('enabled', async () => {
      const { result, waitFor } = renderHook(() =>
        useContractReads({ contracts, enabled: false }),
      )

      await waitFor(() => expect(result.current.isIdle).toBeTruthy())

      const { internal: _, ...res } = result.current
      assertType<
        | [
            MulticallResult<ResolvedConfig['BigIntType']>,
            MulticallResult<ResolvedConfig['BigIntType']>,
            MulticallResult<boolean>,
            MulticallResult<ResolvedConfig['BigIntType']>,
          ]
        | undefined
      >(res.data)
      expect(res).toMatchInlineSnapshot(`
        {
          "data": undefined,
          "error": null,
          "fetchStatus": "idle",
          "isError": false,
          "isFetched": false,
          "isFetchedAfterMount": false,
          "isFetching": false,
          "isIdle": true,
          "isLoading": false,
          "isRefetching": false,
          "isSuccess": false,
          "refetch": [Function],
          "status": "idle",
        }
      `)
    })
  })

  describe('return value', () => {
    it('refetch', async () => {
      const { result } = renderHook(() =>
        useContractReads({ contracts, enabled: false }),
      )

      await act(async () => {
        const { data } = await result.current.refetch()
        assertType<
          | [
              MulticallResult<ResolvedConfig['BigIntType']>,
              MulticallResult<ResolvedConfig['BigIntType']>,
              MulticallResult<boolean>,
              MulticallResult<ResolvedConfig['BigIntType']>,
            ]
          | undefined
        >(data)
        expect(data).toMatchInlineSnapshot(`
          [
            {
              "result": 2n,
              "status": "success",
            },
            {
              "result": 1n,
              "status": "success",
            },
            {
              "result": false,
              "status": "success",
            },
            {
              "result": 370395n,
              "status": "success",
            },
          ]
        `)
      })
    })
  })

  describe('behavior', () => {
    it('does not run when contracts is undefined', async () => {
      const config = {
        contracts: undefined,
      } as const
      const utils = renderHook(() => useContractReads(config))
      const { rerender, result, waitFor } = utils

      await waitFor(() => expect(result.current.isIdle).toBeTruthy())

      // @ts-expect-error assigning to readonly object
      config.contracts = [
        {
          address: wagmigotchiContractConfig.address,
          abi: wagmigotchiContractConfig.abi,
          functionName: 'love',
          args: ['0x27a69ffba1e939ddcfecc8c7e0f967b872bac65c'],
        },
      ]
      rerender()

      await waitFor(() => expect(result.current.isSuccess).toBeTruthy())
    })

    it('does not run when not all contracts are complete', async () => {
      const config = {
        contracts: [
          {
            abi: wagmigotchiContractConfig.abi,
            functionName: 'love',
            args: ['0x27a69ffba1e939ddcfecc8c7e0f967b872bac65c'],
          },
        ],
      } as const
      const utils = renderHook(() => useContractReads(config))
      const { rerender, result, waitFor } = utils

      await waitFor(() => expect(result.current.isIdle).toBeTruthy())

      // @ts-expect-error assigning to readonly object
      config.contracts = [
        {
          address: wagmigotchiContractConfig.address,
          abi: wagmigotchiContractConfig.abi,
          functionName: 'love',
          args: ['0x27a69ffba1e939ddcfecc8c7e0f967b872bac65c'],
        },
      ]
      rerender()

      await waitFor(() => expect(result.current.isSuccess).toBeTruthy())
    })
  })
})
