export default function sortByOldest(data) {
  return [...data].sort((a, b) => new Date(a.date) - new Date(b.date))
}