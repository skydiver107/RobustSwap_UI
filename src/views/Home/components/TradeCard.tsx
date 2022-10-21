import React from 'react'
import styled from 'styled-components'
import { Card, Text } from '@robustswap-libs/uikit'

const StyledTradeCard = styled(Card)`
  border-radius: 8px;
  background: #FF6B2A;
  padding: 24px 24px;
  margin-bottom: 40px;
`

const LinkButton = styled.a`
  background: #1E215C;
  padding: 8px 21px;
  text-align: center;
  align-items: center;
  border-radius: 8px;
`;

const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const TradeCard = () => {

  return (
    <StyledTradeCard>
      <Wrapper>
        <Text style={{ fontSize: 24, fontWeight: 600, color: '#151745' }}>Be part of PANTHER family.</Text>
        <LinkButton href=''>TRADE NOW</LinkButton>
      </Wrapper>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src="/images/security.svg" alt="security" style={{ width: 16, height: 16, marginRight: 8 }} />
        <Text>Audit completed by TechRate</Text>
      </div>
    </StyledTradeCard>
  )
}

export default TradeCard
