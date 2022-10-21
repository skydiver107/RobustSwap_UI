import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useReferral } from './useContract'
import useRefresh from './useRefresh'
import useActiveWeb3React from './useActiveWeb3React'

const useReferralsCount = () => {
  const [referralsCount, setReferralsCount] = useState(new BigNumber(0))
  const { account } = useActiveWeb3React()
  const { fastRefresh } = useRefresh()
  const referralContract = useReferral()

  useEffect(() => {
    async function fetchReferralsCount() {
      const count = await referralContract.referralsCount(account)
      setReferralsCount(new BigNumber(count.toString()))
    }

    if (account) {
      fetchReferralsCount()
    }
  }, [account, fastRefresh, referralContract])

  return referralsCount
}

export const useTotalReferralCommissions = () => {
  const [totalReferralCommissions, setTotalReferralCommissions] = useState(new BigNumber(0))

  const { account } = useActiveWeb3React()
  const { slowRefresh } = useRefresh()
  const referralContract = useReferral()

  useEffect(() => {
    async function fetchTotalReferralCommissions() {
      const commissions = await referralContract.totalReferralCommissions(account)
      setTotalReferralCommissions(new BigNumber(commissions.toString()))
    }

    if (account) {
      fetchTotalReferralCommissions()
    }
  }, [account, slowRefresh, referralContract])

  return totalReferralCommissions
}

export const useReferrerAddressFromContract = () => {
  const zeroAddress = '0x0000000000000000000000000000000000000000'
  const [referrer, setReferrer] = useState(zeroAddress)
  const { account } = useActiveWeb3React()
  const { slowRefresh } = useRefresh()
  const referralContract = useReferral()

  useEffect(() => {
    async function fetchReferrer() {
      const res = await referralContract.getReferrer(account)
      setReferrer(res)
    }

    if (account) {
      fetchReferrer()
    }
  }, [account, slowRefresh, referralContract])

  return referrer
}

export default useReferralsCount
