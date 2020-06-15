import { useStyles } from '../../theme'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useTextStyles = () => {
  const styles = useStyles(theme => ({
    display: {
      color: theme.colors.text.primary,
      fontFamily: theme.font.family,
      fontWeight: theme.font.weights.strong,
      fontSize: theme.font.size.large.size,
      lineHeight: theme.font.size.large.height,
    },
    heading: {
      color: theme.colors.text.primary,
      fontFamily: theme.font.family,
      fontWeight: theme.font.weights.strong,
      fontSize: theme.font.size.regular.size,
      lineHeight: theme.font.size.regular.height,
    },
    body: {
      color: theme.colors.text.primary,
      fontFamily: theme.font.family,
      fontWeight: theme.font.weights.regular,
      fontSize: theme.font.size.regular.size,
      lineHeight: theme.font.size.regular.height,
    },
    caption: {
      color: theme.colors.text.primary,
      fontFamily: theme.font.family,
      fontWeight: theme.font.weights.regular,
      fontSize: theme.font.size.small.size,
      lineHeight: theme.font.size.small.height,
    },
  }))

  return { textStyles: styles }
}
