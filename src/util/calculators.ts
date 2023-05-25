type CountTrueParams = boolean | (() => boolean)

export function countBooleans(...args: CountTrueParams[]): { count: number, percentage: number } {
  let count = 0;

  args.forEach((it) => {
    if (typeof it === 'boolean') count += it ? 1 : 0;
    if (typeof it === 'function') count += it() ? 1 : 0;
  });

  return {
    count,
    percentage: Math.round((count / args.length) * 100)
  };
}