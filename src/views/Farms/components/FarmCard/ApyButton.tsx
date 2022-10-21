import React from 'react'
import BigNumber from 'bignumber.js'
import { CalculateIcon, IconButton, useModal } from '@robustswap-libs/uikit'
import { Address } from 'config/constants/types'
import ApyCalculatorModal from './ApyCalculatorModal'

export interface ApyButtonProps {
  lpLabel?: string
  rbsPrice?: BigNumber
  apy?: BigNumber
  lpTotalInQuoteToken?: BigNumber
  quoteTokenAdresses?: Address
  quoteTokenSymbol?: string
  tokenAddresses: Address
}

const ApyButton: React.FC<ApyButtonProps> = ({
  lpLabel,
  quoteTokenAdresses,
  lpTotalInQuoteToken,
  quoteTokenSymbol,
  tokenAddresses,
  rbsPrice,
  apy,
}) => {
  const [onPresentApyModal] = useModal(
    <ApyCalculatorModal
      lpLabel={lpLabel}
      quoteTokenAdresses={quoteTokenAdresses}
      lpTotalInQuoteToken={lpTotalInQuoteToken}
      quoteTokenSymbol={quoteTokenSymbol}
      tokenAddresses={tokenAddresses}
      rbsPrice={rbsPrice}
      apy={apy}
    />,
  )

  return (
    <IconButton onClick={onPresentApyModal} variant="text" size="sm" ml="4px">
      <CalculateIcon />
    </IconButton>
  )
}

export default ApyButton
