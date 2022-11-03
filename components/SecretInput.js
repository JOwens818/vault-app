import React, { useState } from 'react';
import { 
  Tile,
  FormGroup,
  Stack,
  TextInput,
  Button,
  Loading,
  InlineLoading,
  InlineNotification
} from '@carbon/react';

const SecretInput = (props) => {

  return (
    <Tile>
      <FormGroup legendText="Create new secret">
        <Stack gap={7}>
          <TextInput 
            id="label"
            name="label"
            type="text"
            labelText="Enter Secret Label"
            placeholder="bank account"
          />
          <TextInput.PasswordInput 
            id="secret"
            name="secret"
            type="password"
            labelText="Enter Secret Password"
            placeholder="p@ssw0rd"
        />
        </Stack>
      </FormGroup>
    </Tile>
  );

};

export default SecretInput;