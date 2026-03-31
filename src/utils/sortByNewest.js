export default function sortByNewest(data) {
  return [...data].sort((a, b) => new Date(b.date) - new Date(a.date))
}