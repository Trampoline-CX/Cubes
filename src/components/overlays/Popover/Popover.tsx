import _ from 'lodash'
import React, { useMemo, useState, useCallback, useRef } from 'react'
import {
  View,
  TouchableWithoutFeedback,
  ViewProps,
  LayoutRectangle,
  Dimensions,
} from 'react-native'
import { TextAction } from '../../actions'
import { useStyles } from '../../../theme'
import { shameStyles } from '../../../theme/shame-styles'
import { useWindowDimensions } from '../../../utils/hooks/use-window-dimensions'
import { Item, ItemProps } from './Item/Item'
import {
  PopoverPlacement,
  isTop,
  isBottom,
  isStart,
  isEnd,
  isLeft,
  isRight,
} from './popover-placement'

export interface PopoverWithActions {
  /**
   * Actions to display in the Popover.
   */
  actions: TextAction[]
  children?: never
}

export interface PopoverWithChildren {
  /**
   * The content to display inside the Popover.
   */
  children: React.ReactNode
  actions?: never
}

export type PopoverProps = {
  /**
   * Determines if Popover is visible or not.
   */
  open: boolean
  /**
   * The content to which the Popover will be anchored.
   */
  anchor: React.ReactNode
  /**
   * Preferred placement of the Popover. The Popover will try to place itself according to this
   * property. However, if there is not enough space left there to show up, it will show itself
   * in opposite direction.
   *
   * For example, if we set `preferredPlacement="top"`, and there is not enough space for the Popover
   * to show itself above the triggering view, it will show at the bottom of it.
   */
  placement?: PopoverPlacement
  /**
   * Called when the Popover needs to be discarded. This should update `open` property accordingly.
   */
  onRequestClose: () => void
  /**
   * If true, backdrop will be hidden.
   */
  hideBackdrop?: boolean
  /**
   * If true, the popover width will match the width of the anchor View.
   *
   * **IMPORTANT:** Must only be used with `top` or `bottom` placements.
   */
  matchWidth?: boolean
} & (PopoverWithActions | PopoverWithChildren)

const { backdrop } = shameStyles.popover

const LAYOUT_ZERO: LayoutRectangle = { x: 0, y: 0, width: 0, height: 0 }

export const Popover: React.FC<PopoverProps> & { Item: typeof Item } = ({
  open,
  anchor,
  actions,
  children,
  placement = 'bottom',
  onRequestClose,
  hideBackdrop = false,
  matchWidth = false,
}) => {
  const styles = useStyles(theme => ({
    backdrop: {
      backgroundColor: backdrop.color,
      position: 'absolute',
      top: -9999999,
      left: -9999999,
      right: -9999999,
      bottom: -9999999,
    },
    backdropHidden: {
      opacity: 0,
    },
  }))

  const content = useContent(actions, children)

  const [layout, setLayout] = useState<LayoutRectangle | null>(null)
  const ref = useRef<View>(null)
  const onLayout = useCallback(() => {
    ref.current?.measure((x, y, width, height, pageX, pageY) => {
      setLayout({ x: pageX, y: pageY, width, height })
    })
  }, [ref.current])

  return (
    <View ref={ref} onLayout={onLayout}>
      {anchor}
      {open ? (
        <>
          <TouchableWithoutFeedback onPress={onRequestClose}>
            <View style={[styles.backdrop, hideBackdrop ? styles.backdropHidden : null]} />
          </TouchableWithoutFeedback>
          <PopoverView
            placement={placement}
            matchWidth={matchWidth}
            anchorLayout={layout ?? LAYOUT_ZERO}
          >
            {content}
          </PopoverView>
        </>
      ) : null}
    </View>
  )
}

export type PopoverItemProps = ItemProps
Popover.Item = Item

const useContent = (
  actions: TextAction[] | undefined,
  children: React.ReactNode | undefined,
): React.ReactNode =>
  useMemo(() => {
    if (actions && children) {
      console.warn(
        'Both actions and children are both supplied to Popover. Only actions will be used.',
      )
    }

    let content: React.ReactNode = children

    if (actions) {
      content = actions.map(({ label, action }, i) => (
        <Item key={i} label={label} onSelect={action} />
      ))
    }

    return content
  }, [actions, children])

interface PopoverViewProps {
  children: React.ReactNode
  placement: PopoverPlacement
  matchWidth: boolean
  anchorLayout: LayoutRectangle
}

const PopoverView: React.FC<PopoverViewProps> = ({
  children,
  placement,
  matchWidth,
  anchorLayout,
}) => {
  const styles = useStyles(theme => ({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      alignItems: 'flex-start',
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
  const { width: windowWidth, height: windowHeight } = useWindowDimensions()

  const [layout, setLayout] = useState<LayoutRectangle | null>(null)
  const onLayout = useCallback<Required<ViewProps>['onLayout']>(
    ({ nativeEvent }) => setLayout(nativeEvent.layout),
    [setLayout],
  )

  // Calculate the offset of the Popover relative to parent according to placement
  const placementOffset: Offset = {
    x: isLeft(placement)
      ? -(layout?.width ?? 0)
      : isRight(placement)
      ? anchorLayout.width
      : isStart(placement)
      ? 0
      : isEnd(placement)
      ? -(layout?.width ?? 0) + anchorLayout.width
      : (anchorLayout.width - (layout?.width ?? 0)) / 2, // Top or bottom centered
    y: isTop(placement)
      ? -(layout?.height ?? 0)
      : isBottom(placement)
      ? anchorLayout?.height ?? 0
      : isStart(placement)
      ? 0
      : isEnd(placement)
      ? -(layout?.height ?? 0) + anchorLayout.height
      : (anchorLayout.height - (layout?.height ?? 0)) / 2, // Left or right centered
  }

  // Corrects the placement to be inside window bounds
  const correctedPlacementOffset = _correctOffsetsToBeInWindow(
    placementOffset,
    layout,
    anchorLayout,
    windowWidth,
    windowHeight,
  )

  return (
    <View
      style={[styles.container, { width: windowWidth, height: windowHeight }]}
      pointerEvents="none"
    >
      <View
        style={[
          styles.popover,
          layout === null
            ? styles.popoverNotYetLayout
            : {
                transform: [
                  { translateY: correctedPlacementOffset.y },
                  { translateX: correctedPlacementOffset.x },
                ],
              },
          { maxWidth: windowWidth, maxHeight: windowHeight },
        ]}
        onLayout={onLayout}
      >
        {children}
      </View>
    </View>
  )
}

const _popoverIntersectsWindow = (
  windowWidth: number,
  windowHeight: number,
  { x, y, width, height }: LayoutRectangle,
): boolean => x < 0 || x + width > windowWidth || y < 0 || y + height > windowHeight

const _correctOffsetsToBeInWindow = (
  offset: Offset,
  popoverLayout: LayoutRectangle | null,
  anchorLayout: LayoutRectangle,
  windowWidth: number,
  windowHeight: number,
): Offset => {
  if (popoverLayout === null) {
    return { x: 0, y: 0 }
  }

  // Compute where the popover will be displayed
  const realPopoverLayout: LayoutRectangle = {
    x: anchorLayout.x + offset.x + (popoverLayout?.x ?? 0),
    y: anchorLayout.y + offset.y + (popoverLayout?.y ?? 0),
    width: popoverLayout?.width ?? 0,
    height: popoverLayout?.height ?? 0,
  }

  // Correct the popover display to be within Window bounds
  const correctedPopoverLayout: LayoutRectangle = {
    x: _.clamp(realPopoverLayout.x, 0, windowWidth - realPopoverLayout.width),
    y: _.clamp(realPopoverLayout.y, 0, windowHeight - realPopoverLayout.height),
    width: realPopoverLayout.width,
    height: realPopoverLayout.height,
  }

  console.log(offset, anchorLayout, popoverLayout, realPopoverLayout, correctedPopoverLayout, {
    x: correctedPopoverLayout.x - realPopoverLayout.x + offset.x,
    y: correctedPopoverLayout.y - realPopoverLayout.y + offset.y,
  })

  return {
    x: correctedPopoverLayout.x - realPopoverLayout.x + offset.x,
    y: correctedPopoverLayout.y - realPopoverLayout.y + offset.y,
  }
}

interface Offset {
  x: number
  y: number
}