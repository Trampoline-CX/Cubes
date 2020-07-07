import _ from 'lodash'
import React, { useCallback, useState, useMemo, useEffect } from 'react'
import { LayoutRectangle, ViewProps, View, Animated } from 'react-native'
import { useSafeArea } from 'react-native-safe-area-context'
import { useStyles, useTheme } from '../../../theme'
import { useAppProviderDimensions } from '../../dev'
import { shameStyles } from '../../../theme/shame-styles'
import {
  PopoverPlacement,
  isLeft,
  isRight,
  isStart,
  isEnd,
  isTop,
  isBottom,
} from './popover-placement'

const { zIndex } = shameStyles.popover

export interface PopoverViewProps {
  open: boolean
  children: React.ReactNode
  placement: PopoverPlacement
  anchorLayout: LayoutRectangle
  matchWidth: boolean
  aboveAnchor: boolean
}

/**
 * Actual Popover View which is displayed.
 */
export const PopoverView: React.FC<PopoverViewProps> = ({
  open,
  children,
  placement,
  anchorLayout,
  matchWidth,
  aboveAnchor,
}) => {
  const styles = useStyles(theme => ({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      alignItems: 'flex-start',
      zIndex,
    },
    popover: {
      backgroundColor: theme.colors.fill.background.lighter,
      ...theme.elevation.z8,
    },
    popoverNotYetLayout: {
      opacity: 0,
    },
    popoverMatchWidth: {
      left: 0,
      right: 0,
    },
  }))
  const [anim] = useState(new Animated.Value(0))
  const { animation } = useTheme()
  const { width: windowWidth, height: windowHeight } = useAppProviderDimensions()

  const [layout, setLayout] = useState<LayoutRectangle | null>(null)
  const onLayout = useCallback<Required<ViewProps>['onLayout']>(
    ({ nativeEvent }) => setLayout(nativeEvent.layout),
    [setLayout],
  )

  // Calculate the offset of the Popover relative to parent according to placement
  const placementOffset = usePlacementOffset(placement, aboveAnchor, layout, anchorLayout)

  // Corrects the placement to be inside window bounds
  const correctedPlacementOffset = useOffsetsCorrectionToBeInWindow(
    placementOffset,
    layout,
    windowWidth,
    windowHeight,
  )

  useEffect(() => {
    Animated.timing(anim, {
      easing: animation.easing.move,
      toValue: open ? 1 : 0,
      duration: animation.duration.shorter,
      useNativeDriver: true,
    }).start()
  }, [open])

  return (
    <Animated.View
      style={[styles.container, { width: windowWidth, height: windowHeight }, { opacity: anim }]}
      pointerEvents="box-none" // Children views can receive touches but not this View
    >
      <View
        style={[
          styles.popover,
          layout === null
            ? styles.popoverNotYetLayout // Hide Popover as long as we don't have its correct layout
            : {
                // Offset Popover to display correctly according to anchor position and window bounds
                transform: [
                  { translateY: correctedPlacementOffset.y },
                  { translateX: correctedPlacementOffset.x },
                ],
              },
          { maxWidth: windowWidth, maxHeight: windowHeight }, // Set max dimensions to prevent going out of Window
          matchWidth ? { width: anchorLayout.width } : null,
        ]}
        onLayout={onLayout}
        pointerEvents={open ? 'auto' : 'none'} // Make sure we can't click items if popover is closed
      >
        {children}
      </View>
    </Animated.View>
  )
}

/**
 * Get the offset of the Popover View according to its placement.
 *
 * Ignores Window bounds, this is the ideal position calculation.
 */
const usePlacementOffset = (
  placement: PopoverPlacement,
  aboveAnchor: boolean,
  popoverLayout: LayoutRectangle | null,
  anchorLayout: LayoutRectangle,
): Offset =>
  useMemo(() => {
    const offset = {
      x:
        anchorLayout.x +
        (isLeft(placement)
          ? -(popoverLayout?.width ?? 0)
          : isRight(placement)
          ? anchorLayout.width
          : isStart(placement)
          ? 0
          : isEnd(placement)
          ? -(popoverLayout?.width ?? 0) + anchorLayout.width
          : (anchorLayout.width - (popoverLayout?.width ?? 0)) / 2), // Top or bottom centered
      y:
        anchorLayout.y +
        (isTop(placement)
          ? -(popoverLayout?.height ?? 0)
          : isBottom(placement)
          ? anchorLayout?.height ?? 0
          : isStart(placement)
          ? 0
          : isEnd(placement)
          ? -(popoverLayout?.height ?? 0) + anchorLayout.height
          : (anchorLayout.height - (popoverLayout?.height ?? 0)) / 2), // Left or right centered
    }

    if (aboveAnchor) {
      // Offset to be above anchor
      if (isTop(placement)) {
        offset.y += anchorLayout.height
      } else if (isBottom(placement)) {
        offset.y -= anchorLayout.height
      } else if (isLeft(placement)) {
        offset.x += anchorLayout.width
      } else {
        offset.x -= anchorLayout.width
      }
    }

    return offset
  }, [placement, aboveAnchor, popoverLayout, anchorLayout])

/**
 * Corrects the ideal Popover offset to prevent crossing View bounds.
 */
const useOffsetsCorrectionToBeInWindow = (
  offset: Offset,
  popoverLayout: LayoutRectangle | null,
  windowWidth: number,
  windowHeight: number,
): Offset => {
  const insets = useSafeArea()

  return useMemo(() => {
    if (popoverLayout === null) {
      return offset
    }

    return {
      x: _.clamp(
        offset.x,
        insets.left,
        windowWidth - popoverLayout.width - insets.left - insets.right,
      ),
      y: _.clamp(
        offset.y,
        insets.top,
        windowHeight - popoverLayout.height - insets.top - insets.bottom,
      ),
    }
  }, [popoverLayout, offset, windowWidth, windowHeight, insets])
}

interface Offset {
  x: number
  y: number
}