import React from 'react'
import { View } from 'react-native'
import { fileAbsolute } from 'paths.macro'
import { useStyles, Theme, useTheme } from '../../theme'
import { Heading } from '../text/Heading/Heading'
import { getStoryTitle } from '../../storybook/get-story-title'
import { Box } from '../structure/Box/Box'

export default {
  title: getStoryTitle(fileAbsolute),
}

export const All: React.FC = () => {
  const theme = useTheme()

  return (
    <Box space="medium">
      <Heading>Disabled ({theme.opacity.disabled})</Heading>
      <Square opacity="disabled" />
    </Box>
  )
}

// ---
interface SquareProps {
  opacity: keyof Theme['opacity']
}

const Square: React.FC<SquareProps> = ({ opacity }) => {
  const styles = useStyles(theme => ({
    container: {
      width: 56,
      height: 56,

      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.5,
      shadowColor: '#000',
      elevation: 2,

      backgroundColor: theme.colors.fill.primary.default,
    },
  }))
  const { opacity: themeOpacity } = useTheme()

  return <View style={[styles.container, { opacity: themeOpacity[opacity] }]} />
}
