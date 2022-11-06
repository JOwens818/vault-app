import React, { useState } from 'react';
import { fetcher } from 'lib/apiFetcher';
import InlineNoti from './InlineNoti';
import { 
  Tile,
  FormGroup,
  Stack,
  TextInput,
  Button,
  InlineLoading,
} from '@carbon/react';

const SecretInput = (props) => {

  const [createLoading, setCreateLoading] = useState(false);
  const [createResponse, setCreateResponse] = useState(null);
  const [invalidSecretLabel, setInvalidSecretLabel] = useState(false);
  const [invalidSecret, setInvalidSecret] = useState(false);


  const loginOnEnterKey = async (e) => {
    const code = e.keyCode || e.which;
    if (code ===13) {
      createSecret();
    }
  }

  const validateSecretInputs = (payload) => {
    let areAllInputsValid = true;
    if (payload.secretLabel.length === 0) {
      setInvalidSecretLabel(true);
      areAllInputsValid = false;
    }

    if (payload.secret.length === 0) {
      setInvalidSecret(true);
      areAllInputsValid = false;
    }

    return areAllInputsValid;
  }

  const createSecret = async (e) => {

    setInvalidSecretLabel(false);
    setInvalidSecret(false);
    setCreateLoading(true);
    
    const payload = {
      secretLabel: label.value,
      secret: secret.value
    };

    if (!validateSecretInputs(payload)) {
      setCreateLoading(false);
      return;
    }

    const headers = {
      "Content-type": "application/json"
    };

    const createSecretResp = await fetcher("createSecret", "/api/secret/create", "POST", headers, JSON.stringify(payload));
    setCreateResponse(createSecretResp);
    setCreateLoading(false);
  }


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
            invalid={invalidSecretLabel}
            invalidText="Value cannot be null"
            onKeyPress={loginOnEnterKey}
          />
          <TextInput.PasswordInput 
            id="secret"
            name="secret"
            type="password"
            labelText="Enter Secret Password"
            placeholder="p@ssw0rd"
            invalid={invalidSecret}
            invalidText="Value cannot be null"
            onKeyPress={loginOnEnterKey}
          />
          {
            !createLoading ? (
              <Button 
                id="submit"
                onClick={createSecret}
              >
                Create Secret
              </Button>
            ) : (
              <InlineLoading 
                description="Encrypting secret..."
                status="active"
              />
            )
          }
        </Stack>
      </FormGroup>
      {
        createResponse && <InlineNoti data={createResponse}/>
      }
    </Tile>
  );

};

export default SecretInput;