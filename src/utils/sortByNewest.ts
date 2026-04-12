
type HasDate = {
  date: string
}

export default function sortByNewest<T extends HasDate>(data: T[]): T[] {
  return [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}