import React, { useState } from 'react'
import { action } from '@storybook/addon-actions'
import { fileAbsolute } from 'paths.macro'
import { getStoryTitle } from '../../../storybook/get-story-title'
import { StoryFn } from '../../../storybook/utils/storybook-types'
import { TextField, TextFieldProps } from './TextField'

export default {
  title: getStoryTitle(fileAbsolute),
  component: TextField,
}

export const Default: StoryFn<TextFieldProps> = props => {
  const [value, setValue] = useState(props.value)
  const onTextChanged = (newText: string): void => {
    setValue(newText)
    action('Text changed')(newText)
  }

  return <TextField value={value} onChange={onTextChanged} {...props} />
}

Default.args = {
  label: 'Label',
  placeholder: 'Placeholder Text',
  returnKeyType: 'done',
  helpText: 'Help Text meant to help you',
  onFocus: action('Focused'),
  onBlur: action('Blurred'),
  onSubmit: action('Submitted'),
  onKeyPress: action('Key Pressed'),
}

export const Password: React.FC = () => {
  const [value, setValue] = useState('')

  return (
    <TextField
      label="Password"
      type="password"
      placeholder="8+ characters"
      returnKeyType="done"
      value={value}
      onChange={setValue}
    />
  )
}

export const NewPassword: React.FC = () => {
  const [value, setValue] = useState('')

  return (
    <TextField
      label="Password"
      type="new-password"
      placeholder="8+ characters"
      returnKeyType="done"
      value={value}
      onChange={setValue}
    />
  )
}

export const Integer: React.FC = () => {
  const [value, setValue] = useState('')

  return (
    <TextField
      label="Amount"
      type="integer"
      prefix="$"
      placeholder="10"
      returnKeyType="done"
      value={value}
      onChange={setValue}
    />
  )
}

export const Disabled: React.FC = () => {
  const [value, setValue] = useState('')

  return <TextField disabled label="Label" value={value} onChange={setValue} />
}

export const WithErrorMessage: React.FC = () => {
  const [value, setValue] = useState('')

  return (
    <TextField
      error="Your information is invalid."
      label="Label"
      value={value}
      onChange={setValue}
    />
  )
}

export const WithEndActionAndHiddenLabel: React.FC = () => {
  const [value, setValue] = useState('')

  return (
    <TextField
      label="Label"
      value={value}
      onChange={setValue}
      hideLabel
      endAction={{ icon: 'palette', action: action('EndAction Clicked'), color: 'accent' }}
    />
  )
}

export const Uncontrolled: React.FC = () => <TextField label="Uncontrolled" />
