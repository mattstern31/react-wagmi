import { vi } from 'vitest'

// Make dates stable across runs
Date.now = vi.fn(() => new Date(Date.UTC(2022, 1, 1)).valueOf())
