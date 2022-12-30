import React, { useState, useEffect } from "react";
import ReactPortal from "./ReactPortal";
import { useThemePreference } from "components/ThemePreference";
import { 
  ComposedModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Theme,
  TileGroup,
  RadioTile
} from "@carbon/react";

import { 
  Asleep,
  Light
} from '@carbon/react/icons';


const ChangeTheme = (props) => {

  const { theme, setTheme } = useThemePreference();

  const optionSelected = (option) => {
    if (option === "light") {
      setTheme('g10');
      localStorage.setItem("theme", "g10");
    } else {
      setTheme('g100');
      localStorage.setItem("theme", "g100");
    }
  }

  return (
    <ReactPortal wrapperId="change-theme">
      <Theme theme={theme}>
        <ComposedModal
          size="sm"
          open={props.isThemeModalOpen}
          preventCloseOnClickOutside={true}
          onClose={() => props.handleModalClose("theme")}>

          <ModalHeader title="Change Theme"/>
          <ModalBody>
            <TileGroup
              defaultSelected={theme === "g10" ? "light" : "dark"}
              legend="Themes"
              name="themeGroup"
              onChange={optionSelected}>
              <RadioTile
                id="light"
                value="light">
                  <Light clasName="selectableTileIcons" size={16} />
                  Light
              </RadioTile>
              <RadioTile
                id="dark"
                value="dark">
                  <Asleep clasName="selectableTileIcons" size={16} />
                  Dark
              </RadioTile>
            </TileGroup>

          </ModalBody>
          <ModalFooter>
            <Button 
            kind="primary"
            onClick={() => props.handleModalClose("theme")}>
              OK
            </Button>
          </ModalFooter>
        </ComposedModal>
      </Theme>
    </ReactPortal>
  );
};

export default ChangeTheme;