import React from 'react'
import styled from 'styled-components'

const Container = styled.button`
  outline: none;
  background-color: none;

`

const Text = styled.p`

`

export default function Button(props) {
  return (
    <Container>
      <Text>{props.text}</Text>
    </Container>
  )
}
