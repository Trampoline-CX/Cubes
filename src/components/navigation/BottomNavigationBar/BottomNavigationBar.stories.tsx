import React from 'react'
import { fileAbsolute } from 'paths.macro'
import { action } from '@storybook/addon-actions'
import { getStoryTitle } from '../../../storybook/get-story-title'
import { Screen } from '../../structure/Screen/Screen'
import { NavigationProvider } from '../NavigationProvider/NavigationProvider'
import { PhoneScreen } from '../../../storybook/decorators/PhoneScreen'
import { TextContainer, DisplayText, BodyText } from '../../text'
import { LOREM_IPSUM } from '../../../storybook/utils/constants'
import { TopBar } from '../TopBar/TopBar'
import { BottomNavigationBar } from './BottomNavigationBar'

export default {
  title: getStoryTitle(fileAbsolute),
  component: BottomNavigationBar,
  subcomponents: { 'BottomNavigationBar.Tab': BottomNavigationBar.Tab },
  decorators: [PhoneScreen],
}

export const Basic: React.FC = () => (
  <NavigationProvider goBack={action('Back pressed')}>
    <Screen>
      <TopBar title="Bar Title" />
      <Screen.Content padding="medium">
        <TextContainer>
          <DisplayText>Screen Title</DisplayText>
          <BodyText>{LOREM_IPSUM}</BodyText>
        </TextContainer>
      </Screen.Content>
      <BottomNavigationBar>
        <BottomNavigationBar.Tab icon="money" selected onClick={action('Money Tab Click')} />
        <BottomNavigationBar.Tab icon="accounts" onClick={action('Accounts Tab Click')} />
        <BottomNavigationBar.Tab icon="profile" onClick={action('Profile Tab Click')} />
      </BottomNavigationBar>
    </Screen>
  </NavigationProvider>
)