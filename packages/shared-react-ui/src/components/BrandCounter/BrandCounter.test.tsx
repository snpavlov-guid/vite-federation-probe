import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, it } from 'vitest'
import { BrandCounter } from '.'

describe('BrandCounter component tests:', () => {
  afterEach(cleanup)

  it('should render component', () => {
    render(<BrandCounter />)
  })

  it('should display initial count', () => {
    render(<BrandCounter />)
    screen.getByText('Count: 0')
  })

  it('should increment count', () => {
    render(<BrandCounter />)
    fireEvent.click(screen.getByText('Increment'))
    screen.getByText('Count: 1')
  })

  it('should decrement count', () => {
    render(<BrandCounter />)
    fireEvent.click(screen.getByText('Decrement'))
    screen.getByText('Count: -1')
  })

  it('should reset count', () => {
    render(<BrandCounter />)
    fireEvent.click(screen.getByText('Increment'))
    fireEvent.click(screen.getByText('Reset'))
    screen.getByText('Count: 0')
  })
})
