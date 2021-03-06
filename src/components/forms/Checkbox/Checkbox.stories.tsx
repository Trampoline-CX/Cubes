import React, { useState } from 'react'
import { fileAbsolute } from 'paths.macro'
import { getStoryTitle } from '../../../storybook/get-story-title'
import { StoryFn } from '../../../storybook/utils/storybook-types'
import { Checkbox, CheckboxProps } from './Checkbox'

export default {
  title: getStoryTitle(fileAbsolute),
  component: Checkbox,
}

export const Basic: StoryFn<CheckboxProps> = props => {
  const [checked, setChecked] = useState(props.checked)

  return <Checkbox {...props} checked={checked} onChange={setChecked} />
}

Basic.args = {
  checked: false,
  label: 'A pizza',
  helpText: 'With onions, mushrooms and green peppers 🍕',
}

Basic.argTypes = {
  label: { control: 'text' },
  helpText: { control: 'text' },
}

export const WithoutHelpText: React.FC = () => {
  const [checked, setChecked] = useState(false)

  return <Checkbox label="A pizza" checked={checked} onChange={setChecked} />
}

export const Disabled: React.FC = () => {
  const [checked, setChecked] = useState(false)

  return <Checkbox label="A pizza" checked={checked} onChange={setChecked} disabled />
}

export const Uncontrolled: React.FC = () => <Checkbox label="A pizza" />
