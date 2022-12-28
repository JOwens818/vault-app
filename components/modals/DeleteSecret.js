import React, { useState, useEffect } from "react";
import ReactPortal from "./ReactPortal";
import { fetcher } from "lib/utils/apiFetcher";
import SessionExpired from "components/SessionExpired";
import { useThemePreference } from "components/ThemePreference";
import { 
  ComposedModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Theme,
  InlineLoading,
  TextInput
} from "@carbon/react";


const DeleteSecretModal = (props) => {

  const { theme } = useThemePreference();
  const [sessionExpired, setSessionExpired] = useState(false);
  const [deleteRequested, setDeleteRequested] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState("active");
  const [deleteDesc, setDeleteDesc] = useState("Deleting Secret...");
  const [invalidPassword, setInvalidPassword] = useState(false);


  const closeModal = () => {
    if (deleteStatus === "finished") {
      props.handleModalClose(true);
    } else {
      props.handleModalClose(false);
    }
  }

  const deleteOnEnterKey = async (e) => {
    const code = e.keyCode || e.which;
    if (code ===13) {
      deleteSecret();
    }
  }


  const deleteSecret = async () => {
    setDeleteRequested(true);
    setInvalidPassword(false);
    const headers = { "Content-type": "application/json" };
    const payload = {
      password: password.value,
      secretLabel: props.secretLabel
    };

    const deleteResp = await fetcher("deleteSecret", "/api/secret/delete", "POST", headers, JSON.stringify(payload));
    if (deleteResp.status === "fail" && deleteResp.message === "Unauthorized") {
      setSessionExpired(true);
      setDeleteRequested(false);
    }

    if (deleteResp.status === "error" && deleteResp.message === "Invalid password") {
      setInvalidPassword(true);
      setDeleteRequested(false);
      return;
    }

    setDeleteStatus(deleteResp.status === "error" ? "error" : "finished");
    setDeleteDesc(deleteResp.status === "error" ? "Error Occurred" : "Secret Deleted");
  }


  return (
    <ReactPortal wrapperId="delete-secret">
      <Theme theme={theme}>
        <ComposedModal
          size="sm"
          open={props.isDeleteModalOpen}
          preventCloseOnClickOutside={true}
          onClose={() => closeModal()}>

          <ModalHeader title="Delete Secret"/>
          <ModalBody>
            { sessionExpired ? (
                <SessionExpired />
              ) : (
                <>
                  <p className="bottomMargin">
                    The secret <em className="boldFont">{props.secretLabel}</em> will be permanantly deleted.  Do you want to proceed?
                  </p>
                  <TextInput.PasswordInput 
                    id="password"
                    name="password"
                    type="password"
                    labelText="Enter Your Login Password To Delete"
                    invalid={invalidPassword}
                    invalidText="Invalid Password"
                    onKeyPress={deleteOnEnterKey}
                  />
                </>
              )
            }
          </ModalBody>
          <ModalFooter>
            <Button kind="secondary" onClick={() => closeModal()}>
              {deleteStatus === "active" ? "Cancel" : "Close"}
            </Button>
            { deleteRequested ? (
                <InlineLoading 
                  className="modalInlineLoading"
                  description={deleteDesc}
                  status={deleteStatus}
                />
              ) : (
                <Button 
                  kind="danger" 
                  onClick={() => deleteSecret()}
                  disabled={sessionExpired}>
                  Delete Secret
                </Button>
              )
            }
            </ModalFooter>
        </ComposedModal>
      </Theme>
    </ReactPortal>
  );
};

export default DeleteSecretModal;