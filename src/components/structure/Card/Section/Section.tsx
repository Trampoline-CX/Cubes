import React from 'react'
import { Box } from '../../Box/Box'

export interface SectionProps {
  /**
   * Children components.
   */
  children: React.ReactNode
  /**
   * Set to true to prevent having horizontal padding in the Section.
   */
  noPaddingX?: boolean
}

/**
 * Used to display a section in a `Card` component using consitent spacing.
 */
export const Section: React.FC<SectionProps> = ({ children, noPaddingX = false }) => (
  <Box padding="medium" paddingX={noPaddingX ? 'none' : undefined}>
    {children}
  </Box>
)
