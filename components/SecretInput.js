import React, { useState } from 'react';
import { fetcher } from 'lib/utils/apiFetcher';
import InlineNoti from './InlineNoti';
import { validateSecretInputs } from 'lib/utils/validation';
import SessionExpired from './SessionExpired';
import { 
  Tile,
  FormGroup,
  Stack,
  TextInput,
  TextArea,
  Button,
  InlineLoading
} from '@carbon/react';

const SecretInput = (props) => {

  const [createLoading, setCreateLoading] = useState(false);
  const [createResponse, setCreateResponse] = useState(null);
  const [invalidSecretLabel, setInvalidSecretLabel] = useState(false);
  const [invalidSecret, setInvalidSecret] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [showCreateResult, setShowCreateResult] = useState(false);


  const loginOnEnterKey = async (e) => {
    const code = e.keyCode || e.which;
    if (code ===13) {
      createSecret();
    }
  }


  const createSecret = async (e) => {
    setInvalidSecretLabel(false);
    setInvalidSecret(false);
    setCreateLoading(true);
    setShowCreateResult(false);
    
    const payload = {
      secretLabel: label.value,
      secret: secret.value,
      notes: notes.value.length > 0 ? notes.value : "null"
    };

    const validateInputs = validateSecretInputs(payload);
    if (!validateInputs.areAllInputsValid) {
      setInvalidSecretLabel(validateInputs.invalidSecretLabel);
      setInvalidSecret(validateInputs.invalidSecret);
      setCreateLoading(false);
      return;
    }

    const headers = { "Content-type": "application/json" };
    const createSecretResp = await fetcher("createSecret", "/api/secret/create", "POST", headers, JSON.stringify(payload));
    if (createSecretResp.status === "fail" && createSecretResp.message === "Unauthorized") {
      setSessionExpired(true);
    }

    if (createSecretResp.status === "success") {
      label.value = "";
      secret.value = "";
      notes.value = "";
    }

    setCreateLoading(false);
    setCreateResponse(createSecretResp);
    setShowCreateResult(true);
  }


  return (
    <>
      { sessionExpired ? ( 
          <SessionExpired /> 
        ) : (
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
                <TextArea 
                  id="notes"
                  name="notes"
                  placeholder="Login at myBank.com"
                  labelText="Additional Notes (Optional)"
                  maxCount={100}
                  enableCounter={true}
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
            { showCreateResult && <InlineNoti data={createResponse} /> }
          </Tile>
        )
      }
    </> 
  );

};

export default SecretInput;