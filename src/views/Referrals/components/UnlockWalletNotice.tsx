import React from 'react'
import { Card, CardBody, Text } from '@robustswap-libs/uikit'
import { useMedia } from 'react-use'
import styled from 'styled-components'
import UnlockButton from '../../../components/UnlockButton'
import useI18n from '../../../hooks/useI18n'

const StyledCard = styled(Card)`
  text-align: center;
  margin-top: 28px;
  margin-bottom: 70px;
`
const StyledCardAccent = styled.div`
  background: linear-gradient(
    180deg, #89FFE3, #FFF174
  );
  max-width: 990px;
  width: 90%;
  background-size: 300% 300%;
  border-radius: 8px;
  position: absolute;
  margin-left:auto;
  margin-right:auto;
  padding: 1px;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  z-index: -1;
`

const UnlockWalletNotice = () => {
  const TranslateString = useI18n()
  const isMobile = useMedia('(max-width: 575px)')

  return (
    <>
      <StyledCard>
        <StyledCardAccent />
        <CardBody style={{ padding: '32px', margin: '1px auto', background: '#151745', borderRadius: 8, display: isMobile ? 'block' : 'flex', justifyContent: 'space-between', maxWidth: 987, width: '89.5%', marginLeft: 'auto', marginRight: 'auto', height: isMobile ? 'auto' : 120 }}>
          <Text fontSize="24px" color="white" style={{ fontWeight: 600, marginTop: 'auto', marginBottom: 'auto' }}>
            {TranslateString(10008, 'Unlock your wallet & Get started')}
          </Text>
          <UnlockButton variant="primary" />
        </CardBody>
      </StyledCard>
    </>
  )
}

export default UnlockWalletNotice
