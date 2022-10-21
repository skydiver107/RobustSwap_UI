import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { fetchFarmUserDataAsync, updateUserStakedBalance, updateUserBalance } from 'state/actions'
import { stake, sousStake, sousStakeBnb } from 'utils/callHelpers'
import { useMasterchef, useSousChef } from './useContract'
import { useReferrerAddressFromCookie } from '../state/hooks'
import useActiveWeb3React from './useActiveWeb3React'

const useStake = (pid: number) => {
  const dispatch = useDispatch()
  const { account } = useActiveWeb3React()
  const masterChefContract = useMasterchef()
  const referrer = useReferrerAddressFromCookie()

  const handleStake = useCallback(
    async (amount: string) => {
      const txHash = await stake(masterChefContract, pid, amount, account, referrer)
      dispatch(fetchFarmUserDataAsync(account))
      console.info(txHash)
    },
    [account, dispatch, masterChefContract, pid, referrer],
  )

  return { onStake: handleStake }
}

export const useSousStake = (sousId, isUsingBnb = false) => {
  const dispatch = useDispatch()
  const { account } = useActiveWeb3React()
  const masterChefContract = useMasterchef()
  const sousChefContract = useSousChef(sousId)
  const referrer = useReferrerAddressFromCookie()

  const handleStake = useCallback(
    async (amount: string) => {
      if (sousId === 0) {
        await stake(masterChefContract, 0, amount, account, referrer)
      } else if (isUsingBnb) {
        await sousStakeBnb(sousChefContract, amount, account)
      } else {
        await sousStake(sousChefContract, amount, account)
      }
      dispatch(updateUserStakedBalance(sousId, account))
      dispatch(updateUserBalance(sousId, account))
    },
    [account, dispatch, isUsingBnb, masterChefContract, sousChefContract, sousId, referrer],
  )

  return { onStake: handleStake }
}

export default useStake
