import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { Text, OpenNewIcon } from '@robustswap-libs/uikit'
import Popover, { PopoverProps } from '../Popover'

const TooltipContainer = styled.div`
  width: 228px;
  padding: 0.6rem 1rem;
  line-height: 150%;
  font-weight: 300;
  box-shadow: 5px 4px 8px 3px rgba(14, 14, 14, 0.2);
  border: 1px solid #293D71;
  background: #151745;
  border-radius: 8px;
  color: #FFFFFF;
  font-size: 14px;
`

interface TooltipProps extends Omit<PopoverProps, 'content'> {
  text: string
  mode: number
}

export default function Tooltip({ text, mode, ...rest }: TooltipProps) {
  if (mode === 0)
    return <Popover content={<TooltipContainer>{text}</TooltipContainer>} {...rest} />
  else if (mode === 1) {
    return (
      <Popover placement="top" content={
        <TooltipContainer style={{ width: 'auto' }}>
          <DropDownList />
        </TooltipContainer>} {...rest}
      />
    )
  }
}

export function DropDownList() {
  return (
    <>
      <div style={{ display: 'flex' }}>
        <Text style={{ fontSize: 15, marginRight: 6 }}>RBS-BNB</Text>
        <OpenNewIcon style={{ width: 16, height: 16, marginTop: 'auto', marginBottom: 'auto' }} />
      </div>
      <div style={{ display: 'flex' }}>
        <Text style={{ fontSize: 15, marginRight: 6 }}>View Contract</Text>
        <OpenNewIcon style={{ width: 16, height: 16, marginTop: 'auto', marginBottom: 'auto' }} />
      </div>
      <div style={{ display: 'flex' }}>
        <Text style={{ fontSize: 15, marginRight: 6 }}>Pair Info</Text>
        <OpenNewIcon style={{ width: 16, height: 16, marginTop: 'auto', marginBottom: 'auto' }} />
      </div >
    </>
  )
}

export function MouseoverTooltip({ children, mode, ...rest }: Omit<TooltipProps, 'show'>) {
  const [show, setShow] = useState(false)
  const open = useCallback(() => setShow(true), [setShow])
  const close = useCallback(() => setShow(false), [setShow])
  return (
    <Tooltip mode={mode} {...rest} show={show}>
      <div onMouseEnter={open} onMouseLeave={close}>
        {children}
      </div>
    </Tooltip>
  )
}
