export const formatSalary = (salaryFrom: string, salaryTo: string): string => {
  if (!salaryFrom && !salaryTo) {
    return 'NA'
  } else if (!salaryFrom || !salaryTo) {
    return salaryFrom || salaryTo
  } else if (salaryFrom === salaryTo) {
    return salaryFrom
  } else {
    return `${salaryFrom} - ${salaryTo}`
  }
}
