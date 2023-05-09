import { shallow } from 'zustand/shallow'

import { getConfig } from '../../config'
import type { Connector } from '../../connectors'
import type { PublicClient } from '../../types'
import type { GetAccountResult } from './getAccount'
import { getAccount } from './getAccount'

export type WatchAccountCallback<
  TPublicClient extends PublicClient = PublicClient,
> = (data: GetAccountResult<TPublicClient>) => void

export type WatchAccountConfig = {
  selector?({
    address,
    connector,
    status,
  }: {
    address?: string
    connector?: Connector
    status: GetAccountResult['status']
  }): any
}

export function watchAccount<TPublicClient extends PublicClient>(
  callback: WatchAccountCallback<TPublicClient>,
  { selector = (x) => x }: WatchAccountConfig = {},
) {
  const config = getConfig()
  const handleChange = () => callback(getAccount())
  const unsubscribe = config.subscribe(
    ({ data, connector, status }) =>
      selector({
        address: data?.account,
        connector,
        status,
      }),
    handleChange,
    {
      equalityFn: shallow,
    },
  )
  return unsubscribe
}
