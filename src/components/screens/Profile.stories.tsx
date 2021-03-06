import React from 'react'
import { action } from '@storybook/addon-actions'
import { fileAbsolute } from 'paths.macro'
import { DisplayText } from '../text/DisplayText/DisplayText'
import { Box } from '../structure/Box/Box'
import { Divider } from '../structure/Divider/Divider'
import { Touchable } from '../base/Touchable/Touchable'
import { IconName, Icon } from '../images-and-icons/Icon/Icon'
import { BodyText } from '../text/BodyText/BodyText'
import { getStoryTitle } from '../../storybook/get-story-title'
import { PhoneScreen } from '../../storybook/decorators/PhoneScreen'
import { Screen } from '../structure/Screen/Screen'
import { BottomNavigationBar } from '../navigation/BottomNavigationBar/BottomNavigationBar'

export default {
  title: getStoryTitle(fileAbsolute),
  decorators: [PhoneScreen],
}

export const Profile: React.FC = () => (
  <Screen>
    <Screen.Content>
      <Box padding="medium">
        <DisplayText>Profile</DisplayText>
      </Box>

      <Divider />

      <Box paddingY="medium">
        <Slate icon="person" label="My account" />
        <Slate icon="account-balance" label="Linked bank connections" />
        <Slate icon="security" label="Security" />
        <Slate icon="exit-to-app" label="Sign out" onClick={action('Sign out Clicked')} />
      </Box>
    </Screen.Content>
    <BottomNavigationBar>
      <BottomNavigationBar.Tab icon="dashboard" onClick={action('Money Tab Clicked')} />
      <BottomNavigationBar.Tab icon="search" onClick={action('Explore Tab Clicked')} />
      <BottomNavigationBar.Tab
        icon="account-circle"
        selected
        onClick={action('Profile Tab Clicked')}
      />
    </BottomNavigationBar>
  </Screen>
)

const Slate: React.FC<{ icon: IconName; label: string; onClick?: () => void }> = ({
  icon,
  label,
  onClick,
}) => (
  <Touchable onClick={onClick}>
    <Box horizontal align="center" padding="medium" space="medium">
      <Icon name={icon} />
      <BodyText>{label}</BodyText>
    </Box>
  </Touchable>
)
