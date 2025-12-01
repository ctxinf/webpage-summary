import { InputContentLengthExceededStrategy } from "../types/summary";

export const contentLengthExceededStrategys: Record<InputContentLengthExceededStrategy, {
  name: string,
  desc: string,
  exec: (length: number, maxLength: number) => { start: number, end: number }
}> = {
  "cut-preserve-front": {
    name: 'cut-preserve-front',
    desc: 'Split the content, keeping the first half with the maximum length.',
    exec: (length: number, maxLength: number) => {
      return { start: 0, end: Math.min(maxLength, length) }
    }
  },
  "cut-preserve-end": {
    name: 'cut-preserve-end',
    desc: 'Split the content, keeping the second half with the maximum length. ',
    exec: (length: number, maxLength: number) => {
      return { start: Math.max(0, length - maxLength), end: length }
    }

  },
  "cut-preserve-middle": {
    name: 'cut-preserve-middle',
    desc: 'Split the content into 3 parts, with the middle part of maximum length beging preserved, front and end sides are equally divided.',
    exec: (length: number, maxLength: number) => {
      const maxHalf = Math.floor(maxLength / 2);
      const half = Math.floor(length / 2);
      return { start: Math.max(0, half - maxHalf), end: Math.min(length, half + maxHalf) }
    }
  },
  "nothing": {
    name: 'nothing',
    desc: 'do nothing ',
    exec: (length: number, maxLength: number) => {
      return { start: 0, end: length }
    }
  },
}