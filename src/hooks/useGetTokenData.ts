import { useEffect, useState } from 'react'
import axios from 'axios'

const useGetTokenData = () => {
  const [data, setData] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd')
        setData(result?.data?.binancecoin?.usd)
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }
    fetchData()
  }, [setData])

  return data
}

export default useGetTokenData
