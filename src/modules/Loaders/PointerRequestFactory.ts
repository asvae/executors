import { PointerRequest } from './InfiniteLoader'

/**
 * Generate an array with sequence of numbers
 */
function range (start: number, end: number): number[] {
  const length = (end - start)
  return Array(length).fill(0).map((item, index: number) => start + index)
}

export default class PointerRequestFactory {
  static getPointerRequest (timeout: number = 100): PointerRequest {
    return (pointer: number, perStep: number): Promise<number[]> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(range(pointer, pointer + perStep))
        }, timeout)
      })
    }
  }
}