import { HasDate } from "../types"

export function sortByNewest<T extends HasDate>(data: T[]): T[] {
  return [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}


export function sortByOldest<T extends HasDate>(data: T[]): T[] {
  return [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}