const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('fetch data is me')
    }, 1000)
  })
}

(async () => {
  try {
    const data = await fetchData()
    console.log('data is ->', data)
  } catch (err) {
    console.log('err is ->', err)
  }
})()