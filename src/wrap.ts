import type { TransformerEnv } from './types.ts'

export function wrapClasses(
  classStr: string,
  {
    env,
    before,
  }: {
    env: TransformerEnv
    before: string
  },
) {
  if ((env.options.tailwindApplyWrap ?? 'none') === 'none') return classStr

  before = '\n' + before + ' '.repeat(env.options.tabWidth)
  const classList = classStr.split(/[\t\r\f\n ]+/)

  switch (env.options.tailwindApplyWrap) {
    case 'each':
      return before + classList.join(before)

    case 'fill':
      let result = ''
      let line = before
      let sep = ''
      for (const className of classList) {
        // newline and pre-class whitespace chars offset each other in length check
        if (line.length + className.length > env.options.printWidth) {
          result += line
          line = before + className
        } else {
          line += sep + className
        }
        sep = ' '
      }
      return result + line

    default:
      throw new Error(
        `Unknown tailwind class list wrap method '${env.options.tailwindApplyWrap}'`,
      )
  }
}
