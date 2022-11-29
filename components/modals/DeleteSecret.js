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
  const [error, setError] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState("active");


  const closeModal = () => {
    if (deleteStatus === "finished") {
      props.handleModalClose(true);
    } else {
      props.handleModalClose(false);
    }
  }


  const deleteSecret = () => {
    closeModal();
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
                  <p className="bottomMargin">The secret <em className="boldFont">{props.secretLabel}</em> will be permanantly deleted.  Do you want to proceed?</p>
                  <TextInput.PasswordInput 
                    id="password"
                    name="password"
                    type="password"
                    labelText="Enter Your Login Password To Delete"
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
                  description="Deleting Secret..."
                  status={deleteStatus}
                />
              ) : (
                <Button kind="danger" onClick={() => deleteSecret()}>
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