import React from 'react'
import styled from 'styled-components'
import { Text } from '@robustswap-libs/uikit'

export interface InputProps {
  endAdornment?: React.ReactNode
  onChange: (e: React.FormEvent<HTMLInputElement>) => void
  placeholder?: string
  startAdornment?: React.ReactNode
  value: string
  max?: number | string
}

const Input: React.FC<InputProps> = ({ endAdornment, onChange, placeholder, startAdornment, value, max }) => {
  return (
    <>
      <StyledInputWrapper style={{ alignItems: 'center' }}>
        <Text style={{ fontWeight: 400, fontSize: 12, lineHeight: '14px', textAlign: 'right' }}>
          Balance: {max.toLocaleString()}
        </Text>
        <div style={{ display: "flex", width: '100%' }}>
          {!!startAdornment && startAdornment}
          <StyledInput placeholder={placeholder} value={value} onChange={onChange} />
          {!!endAdornment && endAdornment}
        </div>
      </StyledInputWrapper>
    </>
  )
}

const StyledInputWrapper = styled.div`
  align-items: center;
  background-color: #151745;
  border-radius: ${(props) => props.theme.radii.default};
  width: auto;
  height: 86px;
  padding: 16px 24px;
`

const StyledInput = styled.input`
  width:100%;
  background: none;
  border: 0;
  color: white;
  font-size: 24px;
  font-weight: 600;
  flex: 1;
  height: 56px;
  margin: 0;
  padding: 0;
  outline: none;
`

export default Input
