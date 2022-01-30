type MacroFunction = (...args: never[]) => void | Promise<void>;

type MacroTitle<T extends MacroFunction> = (
  titleHint: string,
  ...args: Parameters<T>
) => string;

type Macro<T extends MacroFunction> = T & {
  title?: MacroTitle<T>;
};

type TitledMacro<T extends MacroFunction> = T & {
  title: MacroTitle<T>;
};

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
  <T extends MacroFunction>(
    macro: TitledMacro<T>,
    ...args: Parameters<T>
  ): void;
  /**
   * Run a test macro with a title hint.
   */
  <T extends MacroFunction>(
    titleHint: string,
    macro: Macro<T>,
    ...args: Parameters<T>
  ): void;
}

const buildRun = (type?: keyof Run): RunFunction => <T extends MacroFunction>(
  macro: Macro<T> | string,
  ...args: Parameters<T>
) => {
  let titleHint = '';

  if (typeof macro === 'string') {
    titleHint = macro;
    // eslint-disable-next-line no-param-reassign
    macro = (args.shift() as unknown) as Macro<T>;
  }

  const title = macro.title?.(titleHint, ...args) ?? titleHint;

  if (!title) {
    throw new Error('Test macro was run without a title');
  }

  // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/naming-convention
  const it_ = type ? it[type] : it;

  it_(title, () => (macro as Macro<T>)(...args));
};

const run: Run = Object.assign(buildRun(), {
  only: buildRun('only'),
  skip: buildRun('skip'),
  todo: buildRun('todo'),
});

export const createMacro = <T extends MacroFunction>(
  test: T,
  title: MacroTitle<T>,
): TitledMacro<T> => {
  // eslint-disable-next-line no-param-reassign
  (test as Macro<T>).title = title;

  return test as TitledMacro<T>;
};

export default run;
