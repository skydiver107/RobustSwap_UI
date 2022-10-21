import { useCallback } from 'react'
import { Contract } from '@ethersproject/contracts'
import { ethers } from 'ethers'
import { useDispatch } from 'react-redux'
import { updateUserAllowance, fetchFarmUserDataAsync } from 'state/actions'
import { approve } from 'utils/callHelpers'
import { useMasterchef, useSousChef } from './useContract'
import useActiveWeb3React from './useActiveWeb3React'

// Approve a Farm
export const useApprove = (lpContract: Contract) => {
  const dispatch = useDispatch()
  const { account } = useActiveWeb3React()
  const masterChefContract = useMasterchef()

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(lpContract, masterChefContract, account)
      dispatch(fetchFarmUserDataAsync(account))
      return tx
    } catch (e) {
      console.log("error:", e)
      return false
    }
  }, [account, dispatch, lpContract, masterChefContract])

  return { onApprove: handleApprove }
}

// Approve a Pool
export const useSousApprove = (lpContract: Contract, sousId) => {
  const dispatch = useDispatch()
  const { account } = useActiveWeb3React()
  const sousChefContract = useSousChef(sousId)

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(lpContract, sousChefContract, account)
      dispatch(updateUserAllowance(sousId, account))
      return tx
    } catch (e) {
      return false
    }
  }, [account, dispatch, lpContract, sousChefContract, sousId])

  return { onApprove: handleApprove }
}

// Approve an IFO
export const useIfoApprove = (tokenContract: Contract, spenderAddress: string) => {
  const onApprove = useCallback(async () => {
    try {
      const tx = await tokenContract
        .approve(spenderAddress, ethers.constants.MaxUint256)
      return tx
    } catch {
      return false
    }
  }, [spenderAddress, tokenContract])

  return onApprove
}
