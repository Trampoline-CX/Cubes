import React, { useMemo, useContext } from 'react'

import { Theme, ThemeContext } from '../../../theme'
import { IconName, iconsMap } from './icons-map'

// Re-export for convenience
export { IconName }

export type IconSize = Extract<keyof Theme['size']['icon'], string>

export interface IconProps {
  /**
   * Icon name.
   */
  name: IconName
  /**
   * Icon size.
   */
  size?: IconSize
  /**
   * Icon color.
   */
  color?: 'primary' | 'accent' | 'inverse' | 'positive' | 'negative' | 'subdued' | 'success'
}

/**
 * Displays an icon of the Design System.
 */
export const Icon: React.FC<IconProps> = ({ name, size = 'default', color = 'primary' }) => {
  const theme = useContext(ThemeContext)
  const IconComponent = useMemo(() => iconsMap[name], [name])
  const iconColor = useMemo(() => {
    switch (color) {
      case 'primary':
        return theme.colors.text.primary
      case 'accent':
        return theme.colors.text.accent
      case 'inverse':
        return theme.colors.text.inverse
      case 'positive':
        return theme.colors.positive
      case 'negative':
        return theme.colors.negative
      case 'subdued':
        return theme.colors.text.subdued
      case 'success':
        return theme.colors.status.success.default
    }
  }, [color, theme])

  return (
    <IconComponent height={theme.size.icon[size]} width={theme.size.icon[size]} color={iconColor} />
  )
}
