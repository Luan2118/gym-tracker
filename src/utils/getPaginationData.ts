
type getPaginationDataReturnData<T> = {
  pageNumbers: number[]
  paginatedData: T[]
  totalPages: number
}

export default function getPaginationData<T>(itemsPerPage: number, data: T[], currentPage: number): getPaginationDataReturnData<T> {
  console.log(typeof itemsPerPage)
  console.log(data)
  console.log(typeof currentPage)

  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage))

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage


  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2)

  const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);

  const paginatedData = data.slice(startIndex, endIndex)

  console.log({
    pageNumbers,
    paginatedData,
    totalPages
  })
  return {
    pageNumbers,
    paginatedData,
    totalPages
  }
}