/**
 * Produces a mapped type where all keys from `T` that are **not** in `U`
 * are set to `never` (optionally). Used internally by `XOR` to enforce
 * mutual exclusion between two types.
 *
 * @template T The type whose exclusive keys will be set to `never`.
 * @template U The reference type; keys present in `U` are excluded from the result.
 *
 * @example
 * type A = { a: string; b: number };
 * type B = { b: number; c: boolean };
 * type W = Without<A, B>; // { a?: never }
 */
export type Without<T, U> = {
  [K in Exclude<keyof T, keyof U>]?: never;
};

/**
 * Exclusive OR (XOR) type — accepts **either** `T` or `U`, but never both at the same time.
 * This is a stricter alternative to `T | U`, which normally allows mixing properties from both.
 *
 * Useful for mutually exclusive prop variants (e.g., a component that accepts either
 * `{ autoUpload: true; uploadFile: Fn }` or `{ autoUpload?: false }`).
 *
 * @template T The first allowed shape.
 * @template U The second allowed shape.
 *
 * @example
 * type A = { kind: 'url'; url: string };
 * type B = { kind: 'file'; file: File };
 *
 * type Attachment = XOR<A, B>;
 *
 * const ok1: Attachment = { kind: 'url', url: 'https://…' };     // ✅
 * const ok2: Attachment = { kind: 'file', file: myFile };         // ✅
 * const bad: Attachment = { kind: 'url', url: '…', file: myFile }; // ❌ TypeScript error
 */
export type XOR<T, U> = (T & Without<U, T>) | (U & Without<T, U>);
