import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, select } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import info from './info.md'

import { Button } from './index';

export default storiesOf('Button', module)
  .addDecorator(withA11y)
  .addDecorator(withKnobs)
  .add('main', () => (
    <Button
      content={text('content', "button")}
      disabled={boolean('disabled', false)}
      type={select('type', ['default', 'primary', 'dashed', 'danger', 'link'])}
      tooltip={text('tooltip', "tooltip")}
    />
  ), { notes: { markdown: info } })