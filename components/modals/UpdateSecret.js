import React, { useState, useEffect } from "react";
import ReactPortal from "./ReactPortal";
import { fetcher } from "lib/utils/apiFetcher";
import InlineNoti from "components/InlineNoti";
import SessionExpired from "components/SessionExpired";
import { useThemePreference } from "components/ThemePreference";
import { validateSecretInputs } from "lib/utils/validation";
import { 
  ComposedModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  TextInput,
  TextInputSkeleton,
  TextArea,
  TextAreaSkeleton,
  Button,
  Theme,
  InlineLoading
} from "@carbon/react";

const UpdateSecretModal = (props) => {

  const { theme } = useThemePreference();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [decrypted, setDecrypted] = useState(null);
  const [loadingError, setLoadingError] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [updateResp, setUpdateResp] = useState(null);
  const [updated, setUpdated] = useState(false);
  const [showUpdatedResult, setShowUpdatedResult] = useState(false);
  const [invalidSecretLabel, setInvalidSecretLabel] = useState(false);
  const [invalidSecret, setInvalidSecret] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);

  useEffect(() => {
    const getSecret = async () => {
      await decryptSecret();
    };
    getSecret();
  }, []);


  const decryptSecret = async () => {
    const headers = { "Content-type": "application/json" };
    const payload = { label: props.secretLabel };
    const decryptResp = await fetcher("decryptSecret", "/api/secret/decrypt", "POST", headers, JSON.stringify(payload));
    if (decryptResp.status !== "success") {
      if (decryptResp.status === "fail" && decryptResp.message === "Unauthorized") {
        setSessionExpired(true);
      } else {
        setLoadingError(true);
      }
    }
    setDecrypted(decryptResp);
    setLoading(false);
  }


  const updateSecret = async () => {
    setUpdating(true);
    setShowUpdatedResult(false);
    setInvalidSecretLabel(false);
    setInvalidSecret(false);
    setInvalidPassword(false);
    const headers = { "Content-type": "application/json" };
    const payload = {
      password: password.value,
      id: decrypted.data.id,
      secretLabel: secretLabel.value,
      secret: secret.value,
      notes: notes.value.length > 0 ? notes.value : "null"
    };

    const validateInputs = validateSecretInputs(payload);
    if (!validateInputs.areAllInputsValid) {
      setInvalidSecretLabel(validateInputs.invalidSecretLabel);
      setInvalidSecret(validateInputs.invalidSecret);
      setUpdating(false);
      return;
    }

    const updateResponse = await fetcher("updateSecret", "/api/secret/update", "POST", headers, JSON.stringify(payload));
    if (updateResponse.status === "fail" && updateResponse.message === "Unauthorized") {
      setSessionExpired(true);
    }

    if (updateResponse.status === "error" && updateResponse.message === "Invalid password") {
      setInvalidPassword(true);
      setUpdating(false);
      return;
    }

    setUpdateResp(updateResponse);
    setUpdating(false);
    setShowUpdatedResult(true);
    setUpdated(true);
  }


  const closeModal = () => {
    if (updated) {
      props.handleModalClose(true);
    } else {
      props.handleModalClose(false);
    }
  }


  const updateOnEnterKey = async (e) => {
    const code = e.keyCode || e.which;
    if (code ===13) {
      updateSecret();
    }
  }


  return (
    <ReactPortal wrapperId="update-secret">
      <Theme theme={theme}>
        <ComposedModal
          size="sm"
          open={props.isUpdateModalOpen}
          preventCloseOnClickOutside={true}
          onClose={() => closeModal()}>

          <ModalHeader title="Update Secret"/>
          <ModalBody>
            { sessionExpired ? (
                <SessionExpired />
              ) : (
                <>
                  { loading && (
                    <>
                      <TextInputSkeleton /> 
                      <TextAreaSkeleton className="topMargin"/>
                      <TextAreaSkeleton className="topMargin"/>
                    </>
                  )}
                      
                  { !loading && decrypted && loadingError && <InlineNoti data={decrypted} /> }
                      
                  { !loading && decrypted && !loadingError && (
                    <>
                      <TextInput 
                        className="bottomMarginPx"
                        id="secretLabel"
                        name="secretLabel"
                        type="text"
                        labelText="Secret Label"
                        invalid={invalidSecretLabel}
                        invalidText="Value cannot be null"
                        defaultValue={decrypted.data.label}
                        onKeyPress={updateOnEnterKey}
                      />
                      <TextInput.PasswordInput
                        id="secret"
                        name="secret"
                        type="password"
                        labelText="Secret Password"
                        invalid={invalidSecret}
                        invalidText="Value cannot be null"
                        defaultValue={decrypted.data.secret}
                        onKeyPress={updateOnEnterKey}
                      />
                      <TextArea 
                        className="topMargin bottomMargin"
                        id="notes"
                        name="notes"
                        labelText="Additional Notes (Optional)"
                        maxCount={100}
                        enableCounter={true}
                        defaultValue={decrypted.data.notes}
                        onKeyPress={updateOnEnterKey}
                      />
                      <TextInput.PasswordInput 
                        id="password"
                        name="password"
                        type="password"
                        labelText="Enter Your Login Password To Update"
                        invalid={invalidPassword}
                        invalidText="Invalid Password"
                        onKeyPress={updateOnEnterKey}
                      />
                      { showUpdatedResult && <InlineNoti data={updateResp} /> }
                    </>
                  )}
                </>
              )
            }

          </ModalBody>
          <ModalFooter>
            <Button kind="secondary" onClick={() => closeModal()}>Close</Button>
            { updating ? (
                <InlineLoading 
                  className="modalInlineLoading"
                  description="Updating Secret..."
                  status="active"
                />
              ) : (
                <Button kind="primary" disabled={loading} onClick={() => updateSecret()}>
                  Update Secret
                </Button>
              )
            }
            </ModalFooter>
        </ComposedModal>
      </Theme>
    </ReactPortal>
  );
};

export default UpdateSecretModal;