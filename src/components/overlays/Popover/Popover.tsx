import React, { useMemo, useRef } from 'react'
import { View, LayoutRectangle } from 'react-native'
import { TextWithOptionalIconAction } from '../../actions/actions'
import { usePositionInAppProvider } from '../../dev'
import { Item, ItemProps } from './Item/Item'
import { PopoverPlacement } from './popover-placement'
import { PopoverView } from './PopoverView'
import { PopoverContext } from './PopoverContext'
import { PopoverBackdrop } from './PopoverBackdrop'
import { PopoverPortal } from './PopoverPortalProvider/PopoverPortalProvider'

export interface PopoverWithActions {
  /**
   * Actions to display in the Popover.
   */
  actions: TextWithOptionalIconAction[]
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
   * The content which will trigger the Popover. The Popover will be anchored to this component.
   */
  activator: React.ReactNode
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
   * If true, backdrop will be hidden.
   */
  hideBackdrop?: boolean
  /**
   * If true, the popover width will match the width of the activator View.
   *
   * **IMPORTANT:** Must only be used with `top` or `bottom` placements.
   */
  matchWidth?: boolean
  /**
   * If true, the popover will appear above the activator view instead of next to it.
   */
  aboveActivator?: boolean
  /**
   * Called when the Popover needs to be discarded. This should update `open` property accordingly.
   */
  onRequestClose: () => void
} & (PopoverWithActions | PopoverWithChildren)

const LAYOUT_ZERO: LayoutRectangle = { x: 0, y: 0, width: 0, height: 0 }
/**
 * Popover Implementation Details (for developers usage)
 * ---
 * The Popover is actually rendered near the AppProvider using `PopoverPortal`.
 *
 * Popover view tree can be summarized like this:
 * - AppProvider
 *   - PopoverPortal
 *     - Popover Backdrop View, which shows the backdrop + provides dismissal of Popover on touch.
 *     - PopoverView
 *       - Absolutely positioned container, where height = AppProvider.height and width = AppProvider.width.
 *         Position origin is equal to position of Activator View.
 *         - Actual Popover View displayed to the user. Positioned relatively to its parent.
 *           - Popover children
 *   - ...Views, that can be nested X times
 *     - Popover
 *       - Activator
 */

/**
 * Popovers are small overlays that open on demand. They are meant to access additional content without cluttering the screen.
 */
export const Popover: React.FC<PopoverProps> & { Item: typeof Item } = ({
  open,
  activator,
  actions,
  children,
  placement = 'bottom',
  onRequestClose,
  hideBackdrop = false,
  matchWidth = false,
  aboveActivator = false,
}) => {
  const content = useContent(actions, children)

  const ref = useRef<View>(null)
  const activatorLayout = usePositionInAppProvider(ref.current) // Get position relative to AppProvider

  return (
    <View ref={ref}>
      {activator}
      <PopoverPortal popoverRef={ref}>
        <PopoverContext.Provider value={{ requestClose: onRequestClose }}>
          <PopoverBackdrop open={open} invisible={hideBackdrop} />
          <PopoverView
            open={open}
            placement={placement}
            matchWidth={matchWidth}
            activatorLayout={activatorLayout ?? LAYOUT_ZERO}
            aboveActivator={aboveActivator}
          >
            {content}
          </PopoverView>
        </PopoverContext.Provider>
      </PopoverPortal>
    </View>
  )
}

export type PopoverItemProps = ItemProps
Popover.Item = Item

/**
 * Get the Popover content (either through `children` or `actions`).
 */
const useContent = (
  actions: TextWithOptionalIconAction[] | undefined,
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
      content = actions.map(({ label, icon, color, action }, i) => (
        <Item key={i} label={label} icon={icon} iconColor={color} onSelect={action} />
      ))
    }

    return content
  }, [actions, children])
