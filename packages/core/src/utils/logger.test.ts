import { afterEach, describe, expect, it, vi } from 'vitest'

import { createConfig } from '../config'

import { logWarn } from './logger'

let consoleWarnMessages: string[] = []
const consoleWarn = vi
  .spyOn(console, 'warn')
  .mockImplementation((message) => consoleWarnMessages.push(message))

describe('logger', () => {
  afterEach(() => {
    consoleWarnMessages = []
    consoleWarn.mockClear()
  })

  describe('logWarn', () => {
    it('logs warnings', () => {
      createConfig({ publicClient: () => null as any })
      logWarn('foo')
      logWarn('bar')
      logWarn('baz')
      expect(consoleWarnMessages).toEqual(['foo', 'bar', 'baz'])
      expect(consoleWarn).toBeCalledTimes(3)
    })

    it('custom logger', () => {
      const warnMessages: string[] = []
      createConfig({
        publicClient: () => null as any,
        logger: {
          warn: (message) => warnMessages.push(message),
        },
      })
      logWarn('foo')
      logWarn('bar')
      logWarn('baz')
      expect(warnMessages).toEqual(['foo', 'bar', 'baz'])
      expect(consoleWarnMessages).toEqual([])
      expect(consoleWarn).toBeCalledTimes(0)
    })

    it('custom logger - nullish warn', () => {
      createConfig({
        publicClient: () => null as any,
        logger: {
          warn: null,
        },
      })
      logWarn('foo')
      logWarn('bar')
      logWarn('baz')
      expect(consoleWarnMessages).toEqual([])
      expect(consoleWarn).toBeCalledTimes(0)
    })
  })
})
