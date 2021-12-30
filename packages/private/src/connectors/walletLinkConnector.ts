import { WalletLink, WalletLinkProvider } from 'walletlink'
import { WalletLinkOptions } from 'walletlink/dist/WalletLink'

import { UserRejectedRequestError } from '../errors'
import { Chain } from '../types'
import { getAddress, normalizeChainId, normalizeMessage } from '../utils'
import { Connector } from './base'

type Options = WalletLinkOptions & { jsonRpcUrl?: string }

export class WalletLinkConnector extends Connector<
  WalletLinkProvider,
  Options
> {
  readonly name = 'Coinbase Wallet'
  readonly ready = true

  private _client?: WalletLink
  private _provider?: WalletLinkProvider

  constructor(config: { chains?: Chain[]; options: Options }) {
    super(config)
  }

  get provider() {
    if (!this._provider) {
      this._client = new WalletLink(this.options)
      this._provider = this._client.makeWeb3Provider(this.options.jsonRpcUrl)
      return this._provider
    }
    return this._provider
  }

  async connect() {
    try {
      const provider = this.provider
      provider.on('accountsChanged', this.onAccountsChanged)
      provider.on('chainChanged', this.onChainChanged)
      provider.on('disconnect', this.onDisconnect)

      const accounts = await provider.enable()
      const account = getAddress(accounts[0])
      const chainId = await this.getChainId()
      return { account, chainId, provider }
    } catch (error) {
      if ((<ProviderRpcError>error).message === 'User closed modal')
        throw new UserRejectedRequestError()
      throw error
    }
  }

  async disconnect() {
    if (!this._provider) return

    const provider = this.provider
    provider.removeListener('accountsChanged', this.onAccountsChanged)
    provider.removeListener('chainChanged', this.onChainChanged)
    provider.removeListener('disconnect', this.onDisconnect)
    provider.disconnect()
    provider.close()

    if (typeof localStorage !== 'undefined') {
      let n = localStorage.length
      while (n--) {
        const key = localStorage.key(n)
        if (!key) continue
        if (!/-walletlink/.test(key)) continue
        localStorage.removeItem(key)
      }
    }
  }

  async getAccount() {
    const provider = this.provider
    const accounts = await provider.request<string[]>({
      method: 'eth_accounts',
    })
    // return checksum address
    return getAddress(accounts[0])
  }

  async getChainId() {
    const provider = this.provider
    const chainId = normalizeChainId(provider.chainId)
    return chainId
  }

  async isAuthorized() {
    try {
      const account = await this.getAccount()
      return !!account
    } catch {
      return false
    }
  }

  async signMessage({ message }: { message: string }) {
    try {
      const provider = this.provider
      const account = await this.getAccount()
      const signature = await provider.request<string>({
        method: 'personal_sign',
        params: [normalizeMessage(message), account],
      })
      return signature
    } catch (error) {
      if ((<ProviderRpcError>error).code === 4001)
        throw new UserRejectedRequestError()
      throw error
    }
  }

  protected onAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) this.emit('disconnect')
    else this.emit('change', { account: accounts[0] })
  }

  protected onChainChanged = (chainId: number | string) => {
    this.emit('change', { chainId: normalizeChainId(chainId) })
  }

  protected onDisconnect = () => {
    this.emit('disconnect')
  }
}
