import * as React from 'react'

import { renderHook } from '../test'
import { useContext } from './context'

describe('useContext', () => {
  it('should throw when not inside Provider', () => {
    const wrapper = ({ children }: { children: React.ReactElement }) =>
      React.createElement('div', { children })
    const { result } = renderHook(() => useContext(), { wrapper })
    expect(() => result.current).toThrowErrorMatchingInlineSnapshot(
      `"Must be used within Provider"`,
    )
  })

  it('inits', () => {
    const { result } = renderHook(() => useContext())
    const state = result.current.state
    expect(state.cacheBuster).toEqual(1)
    expect(state.connector).toEqual(undefined)
    expect(state.data).toEqual(undefined)
    expect(state.provider).toBeDefined()
    expect(state.webSocketProvider).toEqual(undefined)
  })
})
