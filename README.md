# Jest Macros

## Rationale

Running variants of the same test can be a little repetitive in jest or require tradeoffs in test isolation.

Two common patterns are the built-in `it.each` and calling `it` in a loop over an array of test cases.
Neither of these allow isolating an individual test case with `.only` for debugging.
Other test cases may be commented out, but that isn't very ergonomic and such test will not be reported as "skipped" which makes it easier to forget to restore them.
Additionally, the test title string interpolation of `it.each` is not type-checked.

This package takes inspiration from [`ava`'s macro feature](https://github.com/avajs/ava/blob/f328a6933af7aca221b08f694bb14b03701eca68/docs/01-writing-tests.md#reusing-test-logic-through-macros) to allow separating test cases from the test implementation in a way which allows isolating or skipping individual test cases.

## Setup

```
yarn add @matt-tingen/jest-macros
```

In `jest.config.js`:

```
setupFilesAfterEnv: ['./jest.setup.ts'],
```

In `jest.setup.js`:

```ts
import 'jest-macros/global';
```

## Usage

```ts
const double = (x: number) => x * 2;

const testDouble = createMacro(
  (input: number, expected: number) => {
    expect(double(input)).toBe(expected);
  },
  (provided, input, expected) => provided || `${input} doubles to ${expected}`,
);

describe('double', () => {
  run(testDouble, 1, 2);
  run.skip(testDouble, 2, 4);
  run.only(testDouble, 3, 6);
  run('alternate title', testDouble, 4, 8);

  it('standard test', () => {
    // ...
  });
});
```

Output:

```
✓ 3 doubles to 6 (1 ms)
○ skipped 1 doubles to 2
○ skipped 2 doubles to 4
○ skipped alternate title
○ skipped standard test
```
