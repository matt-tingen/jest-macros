/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import run, { createMacro } from './index';

// #region untitled macros
const nullary = () => {};
const unary = (a: number) => {};
const binary = (a: number, b: string) => {};

run('hint', nullary);
run('hint', unary, 0);
run('hint', binary, 0, '');

run.skip('hint', unary, 0);
run.only('hint', unary, 0);
run.todo('hint', unary, 0);

// @ts-expect-error
run(nullary);
// @ts-expect-error
run(unary, 0);
// @ts-expect-error
run(binary, 0, '');

// @ts-expect-error
run();
// @ts-expect-error
run(unary);
// @ts-expect-error
run(unary, '');
// @ts-expect-error
run(binary, 0);
// @ts-expect-error
run(binary, '');
// #endregion

// #region titled macros
const titledNullary = createMacro(nullary, () => 'title');
const titledUnary = createMacro(unary, (hint, a) => hint || a.toString());
const titledBinary = createMacro(
  binary,
  (hint, a, b) => hint || a.toString() + b,
);

run('hint', titledNullary);
run('hint', titledUnary, 0);
run('hint', titledBinary, 0, '');

run.skip('hint', titledUnary, 0);
run.only('hint', titledUnary, 0);
run.todo('hint', titledUnary, 0);

run(titledNullary);
run(titledUnary, 0);
run(titledBinary, 0, '');

const testBinary2 = createMacro(binary, (hint) => `works with ${hint}`);
const testBinary3 = createMacro(
  (a: number, b: string) => {},
  (hint) => `works with ${hint}`,
);
const testRepeat = createMacro(
  (value: string, numRepeats: number, expected: string[]) => {},
  (hint) => `repeat handles ${hint}`,
);
// #endregion
