/**
 * This is a queuing/limiting system based on the `p-limit` npm package, but heavily simplified
 * to a minimal API surface. All it does is ensure tasks run one at a time, sequentially.
 *
 * @example
 * const queue = pQueue();
 * const input = [
 * 	limit(() => fetchSomething('foo')),
 * 	limit(() => fetchSomething('bar')),
 * 	limit(() => doSomething())
 * ];
 * // Each promise is run sequentially rather than in parallel.
 * await Promise.all(input);
 */
export declare function pQueue(): <T extends unknown>(
  task: () => T,
) => Promise<T>;
