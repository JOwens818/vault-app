import React, { useState, useEffect } from "react";
import ReactPortal from "./ReactPortal";
import { fetcher } from "lib/utils/apiFetcher";
import InlineNoti from "components/InlineNoti";
import SessionExpired from "components/SessionExpired";
import { useThemePreference } from "components/ThemePreference";
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
  Theme
} from "@carbon/react";

const UpdateSecretModal = (props) => {

  const { theme } = useThemePreference();
  const [loading, setLoading] = useState(true);
  const [decrypted, setDecrypted] = useState(null);
  const [error, setError] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [update, setUpdate] = useState(null);

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
        setError(true);
      }
    }
    setDecrypted(decryptResp);
    setLoading(false);
  }


  const updateSecret = async () => {

    const headers = { "Content-type": "application/json" };
    const payload = {
      password: password.value,
      id: decrypted.data.id,
      secretLabel: secretLabel.value,
      secret: secret.value,
      notes: notes.value.length > 0 ? notes.value : "null"
    };
    const updateResp = await fetcher("updateSecret", "/api/secret/update", "POST", headers, JSON.stringify(payload));
    if (decryptResp.status !== "success") {
      if (decryptResp.status === "fail" && decryptResp.message === "Unauthorized") {
        setSessionExpired(true);
      } else {
        setError(true);
      }
    }
  }

  return (
    <ReactPortal wrapperId="update-secret">
      <Theme theme={theme}>
        <ComposedModal
          size="sm"
          open={props.isUpdateModalOpen}
          preventCloseOnClickOutside={true}
          onClose={() => props.handleModalClose()}>

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
                      
                  { !loading && decrypted && error && <InlineNoti data={decrypted} /> }
                      
                  { !loading && decrypted && !error && (
                    <>
                      <TextInput 
                        className="bottomMarginPx"
                        id="secretLabel"
                        name="secretLabel"
                        type="text"
                        labelText="Secret Label"
                        defaultValue={decrypted.data.label}
                      />
                      <TextInput.PasswordInput
                        id="secret"
                        name="secret"
                        type="password"
                        labelText="Secret Password"
                        defaultValue={decrypted.data.secret}
                      />
                      <TextArea 
                        className="topMargin bottomMargin"
                        id="notes"
                        name="notes"
                        labelText="Additional Notes"
                        defaultValue={decrypted.data.notes}
                      />
                      <TextInput.PasswordInput 
                        id="password"
                        name="password"
                        type="password"
                        labelText="Enter Your Password"
                      />
                    </>
                  )}
                </>
              )
            }

          </ModalBody>
          <ModalFooter>
            <Button kind="secondary" onClick={() => props.handleModalClose()}>Cancel</Button>
            <Button kind="primary" disabled={loading} onClick={() => props.handleModalClose()}>
              Update Secret
            </Button>
            </ModalFooter>
        </ComposedModal>
      </Theme>
    </ReactPortal>
  );
};

export default UpdateSecretModal;