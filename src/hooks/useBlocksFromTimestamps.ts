import React from 'react'
import request, { gql } from 'graphql-request'

interface Block {
  number: number
  timestamp: string
}

const blocksQueryConstructor = (subqueries: string[]) => {
  return gql`query blocks {
    ${subqueries}
  }`
}

const getBlockSubqueries = (timestamps: number[]) =>
  timestamps.map((timestamp) => {
    return `t${timestamp}:blocks(first: 1, orderBy: timestamp, orderDirection: desc, where: { timestamp_gt: ${timestamp}, timestamp_lt: ${timestamp + 600
      } }) {
      number
    }`
  })

export const BLOCKS_CLIENT = 'https://api.thegraph.com/subgraphs/name/pancakeswap/blocks'

export const multiQuery = async (
  queryConstructor: (subqueries: string[]) => string,
  subqueries: string[],
  endpoint: string,
  skipCount = 1000,
) => {
  let fetchedData = {}
  let allFound = false
  let skip = 0
  try {
    while (!allFound) {
      let end = subqueries.length
      if (skip + skipCount < subqueries.length) {
        end = skip + skipCount
      }
      const subqueriesSlice = subqueries.slice(skip, end)
      // eslint-disable-next-line no-await-in-loop
      const result = await request(endpoint, queryConstructor(subqueriesSlice))
      fetchedData = {
        ...fetchedData,
        ...result,
      }
      allFound = Object.keys(result).length < skipCount || skip + skipCount > subqueries.length
      skip += skipCount
    }
    return fetchedData
  } catch (error) {
    console.error('Failed to fetch info data', error)
    return null
  }
}

export const getBlocksFromTimestamps = async (
  timestamps: number[],
  sortDirection: 'asc' | 'desc' = 'desc',
  skipCount = 500,
): Promise<Block[]> => {
  if (timestamps?.length === 0) {
    return []
  }

  const fetchedData: any = await multiQuery(
    blocksQueryConstructor,
    getBlockSubqueries(timestamps),
    BLOCKS_CLIENT,
    skipCount,
  )

  const sortingFunction =
    sortDirection === 'desc' ? (a: Block, b: Block) => b.number - a.number : (a: Block, b: Block) => a.number - b.number

  const blocks: Block[] = []
  if (fetchedData) {
    // eslint-disable-next-line no-restricted-syntax
    for (const key of Object.keys(fetchedData)) {
      if (fetchedData[key].length > 0) {
        blocks.push({
          timestamp: key.split('t')[1],
          number: parseInt(fetchedData[key][0].number, 10),
        })
      }
    }
    // graphql-request does not guarantee same ordering of batched requests subqueries, hence manual sorting
    blocks.sort(sortingFunction)
  }
  return blocks
}