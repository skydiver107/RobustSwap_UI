import { useEffect, useState } from 'react'

/*
 * Due to Cors the api was forked and a proxy was created
 * @see https://github.com/pancakeswap/gatsby-pancake-api/commit/e811b67a43ccc41edd4a0fa1ee704b2f510aa0ba
 */
export const baseUrl = 'https://api.robustswap.com/api'
export const exchangeBaseUrl = 'https://api.robustswap.info/api'

/* eslint-disable camelcase */

export interface TradePair {
  swap_pair_contract: string
  base_symbol: string
  quote_symbol: string
  last_price: number
  base_volume_24_h: number
  quote_volume_24_h: number
}

export interface ApiStatResponse {
  update_at: string
  '24h_total_volume': number
  total_value_locked: number
  total_value_locked_all: number
  trade_pairs: {
    [key: string]: TradePair
  }
}

export interface ApiExchangeStatResponse {
  updated_at: string
  data: {
    total_liquidity_BNB: string
    total_liquidity_USD: string
    total_volume_BNB: string
    total_volume_USD: string
    volume_BNB: string
    volume_USD: string
    tx_count: number
  }
}

export const useGetStats = () => {
  const [data, setData] = useState<ApiStatResponse | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/stat`)
        const responsedata: ApiStatResponse = await response.json()

        setData(responsedata)
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }

    fetchData()
  }, [setData])

  return data
}

export const useExchangeStats = () => {
  const [data, setData] = useState<ApiExchangeStatResponse | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${exchangeBaseUrl}/stats`)
        const responseData: ApiExchangeStatResponse = await response.json()

        setData(responseData)
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }

    fetchData()
  }, [setData])

  return data
}
