import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import {
  fetchFarmUserDataAsync,
  updateUserStakedBalance,
  updateUserBalance,
  updateUserPendingReward,
} from 'state/actions'
import { emergencyWithdraw, unstake, sousUnstake, sousEmegencyUnstake } from 'utils/callHelpers'
import { useMasterchef, useSousChef } from './useContract'
import useActiveWeb3React from './useActiveWeb3React'

const useUnstake = (pid: number) => {
  const dispatch = useDispatch()
  const { account } = useActiveWeb3React()
  const masterChefContract = useMasterchef()

  const handleUnstake = useCallback(
    async (amount: string) => {
      await emergencyWithdraw(masterChefContract, pid)
      dispatch(fetchFarmUserDataAsync(account))
    },
    [account, dispatch, masterChefContract, pid],
  )

  return { onUnstake: handleUnstake }
}

const SYRUPIDS = [99999]

export const useSousUnstake = (sousId) => {
  const dispatch = useDispatch()
  const { account } = useActiveWeb3React()
  const masterChefContract = useMasterchef()
  const sousChefContract = useSousChef(sousId)
  const isOldSyrup = SYRUPIDS.includes(sousId)

  const handleUnstake = useCallback(
    async (amount: string) => {
      if (sousId === 0) {
        const txHash = await unstake(masterChefContract, 0, amount, account)
        console.info(txHash)
      } else if (isOldSyrup) {
        const txHash = await sousEmegencyUnstake(sousChefContract, amount, account)
        console.info(txHash)
      } else {
        const txHash = await sousUnstake(sousChefContract, amount, account)
        console.info(txHash)
      }
      dispatch(updateUserStakedBalance(sousId, account))
      dispatch(updateUserBalance(sousId, account))
      dispatch(updateUserPendingReward(sousId, account))
    },
    [account, dispatch, isOldSyrup, masterChefContract, sousChefContract, sousId],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstake
