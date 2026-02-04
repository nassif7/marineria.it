export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const yyyy = date.getFullYear()
  const mm = date.getMonth() + 1
  const dd = date.getDate()

  return `${dd < 10 ? '0' + dd : dd}/${mm < 10 ? '0' + mm : mm}/${yyyy}`
}

export const getAge = (birthDate: string): number => {
  const today = new Date()
  const birthDateObj = new Date(birthDate)
  let age = today.getFullYear() - birthDateObj.getFullYear()
  const monthDiff = today.getMonth() - birthDateObj.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
    age--
  }

  return age
}

export const getAgeByYear = (birthYear: string): number => {
  const today = new Date()
  const birthYearObj = new Date(birthYear)
  let age = today.getFullYear() - birthYearObj.getFullYear()

  return age
}
