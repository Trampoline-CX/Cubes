import React, { useState, useEffect, useCallback, useRef } from 'react'
import { View, TouchableWithoutFeedback, StyleSheet, Animated } from 'react-native'
import { useStyles, useTheme } from '../../../theme'
import { Modal } from '../../base/Modal/Modal'
import { shameStyles } from '../../../theme/shame-styles'
import { SwipeableSheet, SwipeableSheetFromProp } from './SwipeableSheet/SwipeableSheet'

export interface SheetProps {
  /**
   * Whether or not the Sheet is opened.
   */
  open: boolean
  /**
   * Callback called when the sheet should close.
   */
  onClose: () => void
  /**
   * Direction from which the Sheet arrives from.
   */
  from?: SwipeableSheetFromProp
  /**
   * Children elements to render in the Sheet.
   */
  children: React.ReactNode
  /**
   * Show backdrop (which by default is invisible).
   */
  showBackdrop?: boolean
}

const { backdropColor } = shameStyles.sheet

/**
 * Large container entering from the edge of the screen. Can provide
 * contextual actions, information or filters. Does not interrupt the
 * flow as a Dialog would do.
 */
export const Sheet: React.FC<SheetProps> = ({
  open,
  onClose,
  from = 'bottom',
  children,
  showBackdrop = false,
}) => {
  const [isAnimating, setAnimating] = useState(false)
  const anim = useRef(new Animated.Value(open ? 1 : 0)).current
  const { animation } = useTheme()

  const styles = useStyles(() => ({
    container: {
      flex: 1,
    },
    containerFromLeft: {
      flexDirection: 'row-reverse',
    },
    containerFromRight: {
      flexDirection: 'row',
    },
    backdrop: {
      flex: 1,
      justifyContent: 'flex-end',
      ...StyleSheet.absoluteFillObject,
    },
    backdropVisible: {
      backgroundColor: backdropColor,
    },
  }))

  useEffect(() => {
    if (open) {
      setAnimating(true)
    }

    Animated.timing(anim, {
      toValue: open ? 1 : 0,
      easing: animation.easing.move,
      duration: animation.duration.default,
      useNativeDriver: true,
    }).start()
  }, [open])

  const hide = useCallback(() => {
    setAnimating(true)
    onClose()
  }, [onClose])

  const onHidden = useCallback(() => {
    setAnimating(false)

    if (open) {
      onClose()
    }
  }, [open])

  return (
    <Modal visible={open || isAnimating} onRequestClose={hide} animationType="none" transparent>
      <View
        style={[
          styles.container,
          from === 'left' && styles.containerFromLeft,
          from === 'right' && styles.containerFromRight,
        ]}
      >
        <TouchableWithoutFeedback onPress={hide}>
          <Animated.View
            style={[styles.backdrop, showBackdrop && styles.backdropVisible, { opacity: anim }]}
          />
        </TouchableWithoutFeedback>

        <SwipeableSheet from={from} open={open} onHidden={onHidden}>
          {children}
        </SwipeableSheet>
      </View>
    </Modal>
  )
}
