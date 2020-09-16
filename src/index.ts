interface Macro<Args extends unknown[]> {
  (...args: Args): void;
  title?(providedTitle: string, ...args: Args): string;
}

type MacroTitle<Args extends unknown[]> = (
  providedTitle: string,
  ...args: Args
) => string;

interface Run extends RunFunction {
  /**
   * Run a test macro.
   */
  <Args extends unknown[]>(macro: Macro<Args>, ...args: Args): void;
  /**
   * Only runs this test in the current file.
   */
  only: RunFunction;
  /**
   * Skips running this test in the current file.
   */
  skip: RunFunction;
  /**
   * Sketch out which tests to write in the future.
   */
  todo: RunFunction;
}

interface RunFunction {
  <Args extends unknown[]>(
    title: string,
    macro: Macro<Args>,
    ...args: Args
  ): void;
  <Args extends unknown[]>(macro: Macro<Args>, ...args: Args): void;
}

const buildRun = (type?: keyof Run): RunFunction => <Args extends unknown[]>(
  macro: Macro<Args> | string,
  ...args: Args
) => {
  let providedTitle = '';

  if (typeof macro === 'string') {
    providedTitle = macro;
    // eslint-disable-next-line no-param-reassign
    macro = args.shift() as Macro<Args>;
  }

  const title = macro.title?.(providedTitle, ...args) ?? providedTitle;
  // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/naming-convention
  const it_ = type ? it[type] : it;

  it_(title, () => {
    (macro as Macro<Args>)(...args);
  });
};

const run: Run = Object.assign(buildRun(), {
  only: buildRun('only'),
  skip: buildRun('skip'),
  todo: buildRun('todo'),
});

export const createMacro = <Args extends unknown[]>(
  test: Macro<Args>,
  title: MacroTitle<Args>,
): Macro<Args> => {
  // eslint-disable-next-line no-param-reassign
  (test as Macro<Args>).title = title;

  return test as Macro<Args>;
};

export default run;
