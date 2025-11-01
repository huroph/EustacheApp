// src/test/vitest-globals.d.ts
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers'
import 'vitest'

declare module 'vitest' {
  interface Assertion<T = any> extends TestingLibraryMatchers<T, void> {}
  interface AsymmetricMatchersContaining extends TestingLibraryMatchers {}
}