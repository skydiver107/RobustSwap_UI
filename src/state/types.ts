import BigNumber from 'bignumber.js'
import { FarmConfig, PoolConfig } from 'config/constants/types'

export interface Farm extends FarmConfig {
  tokenAmount?: BigNumber
  // quoteTokenAmount?: BigNumber
  lpTotalSupply?: BigNumber
  quoteTokenBlanceLP?: BigNumber
  lpTotalInQuoteToken?: BigNumber
  tokenPriceVsQuote?: BigNumber
  poolWeight?: number
  depositFeeBP?: number
  harvestInterval?: number
  rbsPerBlock?: number
  userData?: {
    allowance: BigNumber
    tokenBalance: BigNumber
    stakedBalance: BigNumber
    nextHarvestUntil: number
    canHarvest: boolean
    earnings: BigNumber
  }
}

export interface Pool extends PoolConfig {
  totalStaked?: BigNumber
  startBlock?: number
  endBlock?: number
  poolLimitPerUser?: BigNumber
  withdrawalInterval?: number
  rewardTokenPrice?: BigNumber
  userData?: {
    allowance: BigNumber
    stakingTokenBalance: BigNumber
    stakedBalance: BigNumber
    pendingReward: BigNumber
    nextWithdrawalUntil?: number
  }
}

// Slices states

export interface FarmsState {
  data: Farm[]
}

export interface PoolsState {
  data: Pool[]
}

// Global state

export interface State {
  farms: FarmsState
  pools: PoolsState
}