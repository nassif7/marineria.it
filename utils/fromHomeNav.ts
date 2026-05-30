let _fromHome = false
export const setFromHome = () => {
  _fromHome = true
}
export const consumeFromHome = () => {
  const v = _fromHome
  _fromHome = false
  return v
}
