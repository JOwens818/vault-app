import React, { useState } from "react";
import ReactPortal from "./ReactPortal";
import { fetcher } from "lib/utils/apiFetcher";
import { useThemePreference } from "components/ThemePreference";
import { 
  ComposedModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Theme,
  InlineLoading
} from "@carbon/react";

const LogoutModal = (props) => {
  const { theme } = useThemePreference();
  const [logoutRequested, setLogoutRequested] = useState(false);
  const [status, setStatus] = useState("active");
  const [description, setDescription] = useState("Logging out...");

  const logout = async () => {
    setLogoutRequested(true);
    const logoutResp = await fetcher("logout", "/api/auth/logout", "GET");
    if (!logoutResp.status || logoutResp.status !== "success") {
      setStatus("error");
      setDescription("Error occurred");
    } else {
      setStatus("finished");
      setDescription("Logout successful");
      await timeout(1500);
      props.handleModalClose("logout");
    }
  }

  const timeout = async (ms) => {
    return new Promise(res => setTimeout(res, ms));
  }

  return (
    <ReactPortal wrapperId="logout">
      <Theme theme={theme}>
        <ComposedModal
          size="sm"
          open={props.isLogoutModalOpen}
          preventCloseOnClickOutside={true}
          onClose={() => props.handleModalClose("cancelLogout")}>

          <ModalHeader title="Confirm"/>
          <ModalBody>
            <p>Are you sure you want to log out?</p>
          </ModalBody>
          <ModalFooter>
            <Button kind="secondary" onClick={() => props.handleModalClose("cancelLogout")}>
              Cancel
            </Button>
            {
              logoutRequested ? (
                <InlineLoading 
                  className="modalInlineLoading"
                  description={description}
                  status={status}
                />
              ) : (
                <Button 
                  kind="danger" 
                  onClick={() => logout()}>
                  Log out
                </Button>
              )
            }
            
            </ModalFooter>
        </ComposedModal>
      </Theme>
    </ReactPortal>
  );
};

export default LogoutModal;