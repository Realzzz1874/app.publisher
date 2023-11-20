// 1-10 位的数字和字母组合
export const validateUsernameInput = (username: string) => {
  const regex = /^[a-zA-Z0-9]{1,10}$/
  return regex.test(username)
}
