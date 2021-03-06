import React from 'react'
import { Switch as RNSwitch, Platform } from 'react-native'
import { useTheme } from '../../../theme'
import { shameStyles } from '../../../theme/shame-styles'
import { useUncontrolledState } from '../../../utils/hooks/use-uncontrolled-state'

export interface SwitchProps {
  /**
   * Set to true if options is enabled.
   */
  checked?: boolean
  /**
   * Called when `checked` property is changed. `checked` property should reflect change.
   *
   * If not set, component will be an uncontrolled component. @see https://reactjs.org/docs/uncontrolled-components.html
   */
  onChecked?: (checked: boolean) => void
}

/**
 * Used to toggle yes/no enabled/disabled options.
 *
 * >**Note:** The look of this component is very different depending if you are on Web, Android or iOS.
 */
export const Switch: React.FC<SwitchProps> = ({
  checked: checkedRaw = false,
  onChecked: onCheckedRaw,
}) => {
  const theme = useTheme()
  const [checked, onChecked] = useUncontrolledState(checkedRaw, onCheckedRaw)

  return (
    <RNSwitch
      trackColor={
        Platform.OS === 'ios'
          ? {
              true: theme.colors.fill.accent.default,
              false: theme.colors.fill.background.darker,
            }
          : {
              true: shameStyles.switch.android.track.on,
              false: shameStyles.switch.android.track.off,
            }
      }
      thumbColor={
        Platform.OS === 'ios'
          ? undefined
          : checked
          ? theme.colors.fill.accent.default
          : shameStyles.switch.android.thumb.off
      }
      onValueChange={onChecked}
      value={checked}
    />
  )
}
