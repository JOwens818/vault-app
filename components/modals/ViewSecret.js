import React, { useState, useEffect } from "react";
import ReactPortal from "./ReactPortal";
import { fetcher } from "lib/utils/apiFetcher";
import InlineNoti from "components/InlineNoti";
import SessionExpired from "components/SessionExpired";
import { 
  ComposedModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  TextInput,
  TextInputSkeleton,
  TextArea,
  TextAreaSkeleton,
  Button
} from "@carbon/react";

const ViewSecretModal = (props) => {

  const [loading, setLoading] = useState(true);
  const [decrypted, setDecrypted] = useState("");
  const [error, setError] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

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


  return (
    <ReactPortal wrapperId="view-secret">
      <ComposedModal
        size="sm"
        open={props.isViewModalOpen}
        preventCloseOnClickOutside={true}
        onClose={() => props.handleModalClose()}>

        <ModalHeader title="View Secret"/>
        <ModalBody>
          <p className="secretHeading">
            {props.secretLabel}
          </p>
          { sessionExpired ? (
              <SessionExpired />
            ) : (
              <>
                { loading && (
                  <>
                    <TextInputSkeleton /> 
                    <TextAreaSkeleton className="topMargin"/>
                  </>
                )}
                    
                { !loading && decrypted && error && <InlineNoti data={decrypted} /> }
                    
                { !loading && decrypted && !error && (
                  <>
                    <TextInput.PasswordInput
                      id="viewSecret"
                      name="viewSecret"
                      type="password"
                      labelText="Secret"
                      hideLabel
                      value={decrypted.data.secret}
                    />
                    <TextArea 
                      className="topMargin"
                      id="viewNotes"
                      name="viewNotes"
                      labelText="Additional Notes"
                      value={decrypted.data.notes}
                    />
                  </>
                )}
              </>
            )
          }

        </ModalBody>
        <ModalFooter>
          <Button kind="primary" disabled={loading} onClick={() => props.handleModalClose()}>
            OK
          </Button>
          </ModalFooter>
      </ComposedModal>
    </ReactPortal>
  );
};

export default ViewSecretModal;