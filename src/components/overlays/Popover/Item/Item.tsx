import React, { useContext, useCallback } from 'react'
import { BodyText } from '../../../text'
import { Box } from '../../../structure/Box/Box'
import { Touchable } from '../../../base/Touchable/Touchable'
import { IconName, IconProps, Icon } from '../../../images-and-icons/Icon/Icon'
import { PopoverContext } from '../PopoverContext'
import { useStyles } from '../../../../theme'

export interface ItemProps {
  /**
   * Label of the Item.
   */
  label: string
  /**
   * Optional Icon.
   */
  icon?: IconName
  /**
   * Color of the Icon.
   */
  iconColor?: IconProps['color']
  /**
   * Action to execute on click.
   */
  onSelect?: () => void
  /**
   * Set to `true` to disable the option.
   */
  disabled?: boolean
}

/**
 * Action to display in a `Popover`.
 */
export const Item: React.FC<ItemProps> = ({
  label,
  icon,
  iconColor,
  onSelect: onSelectRaw = () => {},
  disabled = false,
}) => {
  const styles = useStyles(theme => ({
    disabled: {
      opacity: theme.opacity.disabled,
    },
  }))

  const { requestClose } = useContext(PopoverContext)

  // Make sure to close the Popover after calling onSelect
  const onSelect = useCallback(() => {
    onSelectRaw()
    requestClose()
  }, [requestClose, onSelectRaw])

  return (
    <Touchable onClick={onSelect} disabled={disabled} viewStyle={disabled && styles.disabled}>
      <Box horizontal space="small" paddingX="medium" paddingY="small" align="center">
        {icon ? <Icon name={icon} color={iconColor} /> : null}
        <BodyText>{label}</BodyText>
      </Box>
    </Touchable>
  )
}
