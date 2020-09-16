import run_, { createMacro as createMacro_ } from './index';

declare global {
  export const run: typeof run_;
  export const createMacro: typeof createMacro_;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
(global as any).run = run_;
(global as any).createMacro = createMacro_;
/* eslint-enable */
