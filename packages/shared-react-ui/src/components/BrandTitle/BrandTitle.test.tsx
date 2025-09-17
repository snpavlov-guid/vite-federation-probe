import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, it } from 'vitest'
import { BrandTitle } from '.'

describe('BrandTitle test:', () => {
  afterEach(cleanup)

  it('should render component', () => {
    render(<BrandTitle title='Testing' />)
  })

  it('should render title', () => {
    render(<BrandTitle title='Testing' />)
    screen.getByText('Testing')
  })
})
