import React, { useCallback, useState } from 'react'
import { InfoIcon } from '@robustswap-libs/uikit'
import styled from 'styled-components'
import Tooltip from '../Tooltip'

const QuestionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem;
  border: none;
  background: none;
  outline: none;
  cursor: default;
  border-radius: 36px;
  // background-color: ${({ theme }) => theme.colors.invertedContrast};
  background-color: transparent;
  //color: ${({ theme }) => theme.colors.text};

  :hover,
  :focus {
    opacity: 0.7;
  }
`

export default function QuestionHelper({ text, mode, wth, hgh }: { text: string, mode: number, wth: number, hgh: number }) {
  const [show, setShow] = useState<boolean>(false)

  const open = useCallback(() => setShow(true), [setShow])
  const close = useCallback(() => setShow(false), [setShow])

  return (
    <span style={{ marginLeft: 4, marginTop: 'auto', marginBottom: 'auto' }}>
      <Tooltip text={text} show={show} mode={mode}>
        <QuestionWrapper onClick={open} onMouseEnter={open} onMouseLeave={close}>
          <InfoIcon style={{ width: wth, height: hgh }} />
        </QuestionWrapper>
      </Tooltip>
    </span>
  )
}
