import { ReadableStream, WritableStream, TransformStream } from 'web-streams-polyfill';

if (import.meta.env.FIREFOX) {
  // @ts-ignore
  globalThis.ReadableStream = ReadableStream;
  // @ts-ignore
  globalThis.WritableStream = WritableStream;
  // @ts-ignore
  globalThis.TransformStream = TransformStream;
}
