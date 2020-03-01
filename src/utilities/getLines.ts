import getBitData from './getBitData'
import { applyMedianFilter } from './medianFilter'

export function getLines(data: Uint8ClampedArray, width: number, height: number): number[] {
  let bitData = getBitData(data, width, height)
  const lines: number[] = []
  let count = 0
  let columnAverageLast = 0

  bitData = applyMedianFilter(bitData, width, height)

  for (let column = 0; column < width; column += 1) {
    let columnSum = 0
    let columnAverage = 0

    for (let row = 0; row < height; row += 1) {
      const index = row * width + column
      columnSum += bitData[index]
    }

    // pixels are same in column
    columnAverage = columnSum / height >= 127 ? 255 : 0

    // skip white padding in the start & end
    if (columnAverage === 255 && count === 0) continue

    // count line width
    if (columnAverage === columnAverageLast) {
      count += 1
    } else {
      lines.push(count)
      columnAverageLast = columnAverage
      count = 1
    }

    // skip padding in the last
    if (column === width - 1 && columnAverage === 0) {
      lines.push(count)
    }
  }

  return lines
}
