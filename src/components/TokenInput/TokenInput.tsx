import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js/bignumber'
import { Button, Flex, Text } from '@robustswap-libs/uikit'
import useI18n from '../../hooks/useI18n'
import Input, { InputProps } from '../Input'

interface TokenInputProps extends InputProps {
  max: number | string
  symbol: string
  onSelectMax?: () => void
  depositFeeBP?: number
  mode?: number
}

const TokenInput: React.FC<TokenInputProps> = ({ max, symbol, onChange, onSelectMax, value, depositFeeBP = 0, mode }) => {
  const TranslateString = useI18n()
  const image = `/images/farms/${symbol === 'WBNB' ? 'BNB' : symbol}.svg`;

  return (
    <StyledTokenInput style={{ marginBottom: mode === 0 ? 0 : 20 }}>
      <Input
        endAdornment={
          <StyledTokenAdornmentWrapper>
            <div>
              <Button variant="text" size="sm" onClick={onSelectMax}>
                {TranslateString(452, 'MAX')}
              </Button>
            </div>
            <StyledSpacer />
            <div>
              <Flex>
                {!(symbol.includes('LP')) && <img src={image} alt={symbol} width={24} height={24} />}
                <StyledTokenSymbol>{symbol}</StyledTokenSymbol>
              </Flex>
            </div>
          </StyledTokenAdornmentWrapper>
        }
        onChange={onChange}
        placeholder="0"
        value={value}
        max={max}
      />
      {mode === 0 && (depositFeeBP > 0 ? (
        <StyledMaxText>
          <Text style={{ textAlign: 'left', width: '30%', color: '#A0B9FB' }}>
            {symbol === 'RBT' ? TranslateString(10000, 'Burn Amount'):TranslateString(10001, 'Deposit Fee')}
          </Text>
          <Text style={{ textAlign: 'right', width: '70%' }}>
            {new BigNumber(value || 0).times(depositFeeBP / 10000).toFixed(8)}{' '} {symbol}
          </Text>
        </StyledMaxText>
      ) : (
        <StyledMaxText>
          <Text style={{ textAlign: 'left', width: '30%', color: '#A0B9FB' }}>
              {TranslateString(10001, 'Deposit Fee')}
            </Text>
          <Text style={{ textAlign: 'right', width: '70%' }}>{new BigNumber(0).toFixed(8)}{' '}{symbol}</Text>
        </StyledMaxText>
      ))}
    </StyledTokenInput>
  )
}

const StyledTokenInput = styled.div`
  max-width: 430px;
`

const StyledSpacer = styled.div`
  width: ${(props) => props.theme.spacing[3]}px;
`

const StyledTokenAdornmentWrapper = styled.div`
  align-items: center;
  display: flex;
`

const StyledMaxText = styled.div`
  align-items: center;
  color: ${(props) => props.theme.colors.primary};
  display: flex;
  font-size: 14px;
  font-weight: 700;
  width: 100%;
  height: 44px;
  justify-content: flex-end;
  margin-bottom:16px;
`

const StyledTokenSymbol = styled.span`
  color: white;
  font-weight: 500;
  font-size: 16px;
  margin-left: 4px;
  margin-top: auto;
  margin-bottom: auto;
`

export default TokenInput
