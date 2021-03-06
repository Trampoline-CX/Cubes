import React from 'react'
import { View } from 'react-native'
import { useStyles } from '../../../theme'
import { shameStyles } from '../../../theme/shame-styles'
import { Modal } from '../../base/Modal/Modal'
import { Header } from './Header/Header'
import { FooterProps, Footer } from './Footer/Footer'
import { Section, SectionProps } from './Section/Section'

export type DialogProps = {
  /**
   * Dialog Title.
   */
  title?: string
  /**
   * Determines if the Dialog is shown or not.
   */
  open: boolean
  /**
   * Function called when the dialog is closed.
   */
  onClose: () => void
  /**
   * Dialog content.
   */
  children: React.ReactNode
  /**
   * Provides a default `Dialog.Section` in the Dialog. All content will be wrapped in it.
   */
  sectioned?: boolean
  /**
   * Set to true to hide the close modal button.
   */
  hideClose?: boolean
} & FooterProps

const { backdropColor, defaultWidth, minWidth } = shameStyles.dialog

/**
 * Show interactive content on top of an existing screen.
 * It should be used thoughtfully and sparingly, as it stops the user in its current flow.
 */
export const Dialog: React.FC<DialogProps> & { Section: typeof Section } = ({
  title,
  open,
  onClose,
  children,
  primaryAction,
  secondaryActions = [],
  sectioned = false,
  hideClose = false,
}) => {
  const styles = useStyles(theme => ({
    backdrop: {
      backgroundColor: backdropColor,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modal: {
      backgroundColor: theme.colors.fill.background.lighter,
      width: defaultWidth,
      minWidth,
      borderRadius: theme.radius.large,
      ...theme.elevation.z8,
    },
  }))

  return (
    <Modal
      visible={open}
      onDismiss={onClose}
      onRequestClose={onClose}
      animationType="fade"
      transparent
    >
      <View style={styles.backdrop}>
        <View style={styles.modal}>
          <Header title={title} onClose={onClose} hideClose={hideClose} />
          {sectioned ? <Section>{children}</Section> : children}
          <Footer primaryAction={primaryAction} secondaryActions={secondaryActions} />
        </View>
      </View>
    </Modal>
  )
}

Dialog.Section = Section
export type DialogSectionProps = SectionProps
