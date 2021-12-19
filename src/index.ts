interface Macro<Args extends unknown[]> {
  (...args: Args): void | Promise<void>;
  title?(titleHint: string, ...args: Args): string;
}

type TitledMacro<Args extends unknown[]> = Required<Macro<Args>>;

type MacroTitle<Args extends unknown[]> = (
  titleHint: string,
  ...args: Args
) => string;

interface Run extends RunFunction {
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
  /**
   * Run a test macro.
   */
  <Args extends unknown[]>(macro: TitledMacro<Args>, ...args: Args): void;
  /**
   * Run a test macro with a title hint.
   */
  <Args extends unknown[]>(
    titleHint: string,
    macro: Macro<Args> | TitledMacro<Args>,
    ...args: Args
  ): void;
}

const buildRun = (type?: keyof Run): RunFunction => <Args extends unknown[]>(
  macro: TitledMacro<Args> | Macro<Args> | string,
  ...args: Args
) => {
  let titleHint = '';

  if (typeof macro === 'string') {
    titleHint = macro;
    // eslint-disable-next-line no-param-reassign
    macro = args.shift() as Macro<Args>;
  }

  const title = macro.title?.(titleHint, ...args) ?? titleHint;

  if (!title) {
    throw new Error('Test macro was run without a title');
  }

  // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/naming-convention
  const it_ = type ? it[type] : it;

  it_(title, () => (macro as Macro<Args>)(...args));
};

const run: Run = Object.assign(buildRun(), {
  only: buildRun('only'),
  skip: buildRun('skip'),
  todo: buildRun('todo'),
});

export const createMacro = <Args extends unknown[]>(
  test: Macro<Args>,
  title: MacroTitle<Args>,
): TitledMacro<Args> => {
  // eslint-disable-next-line no-param-reassign
  (test as Macro<Args>).title = title;

  return test as TitledMacro<Args>;
};

export default run;
