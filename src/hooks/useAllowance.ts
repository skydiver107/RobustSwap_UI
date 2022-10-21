import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { Contract } from '@ethersproject/contracts'
import useActiveWeb3React from './useActiveWeb3React'

// Retrieve IFO allowance
export const useIfoAllowance = (tokenContract: Contract, spenderAddress: string, dependency?: any) => {
  const { account } = useActiveWeb3React()
  const [allowance, setAllowance] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await tokenContract.allowance(account, spenderAddress)
        setAllowance(new BigNumber(res))
      } catch (e) {
        setAllowance(null)
      }
    }
    fetch()
  }, [account, spenderAddress, tokenContract, dependency])

  return allowance
}
