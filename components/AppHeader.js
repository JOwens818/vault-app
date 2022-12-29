import React, { useState } from 'react';
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Header,
  HeaderContainer,
  HeaderName,
  HeaderNavigation,
  HeaderMenuButton,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
  HeaderPanel,
  SideNav,
  SideNavItems,
  HeaderSideNavItems,
  Switcher,
  SwitcherDivider,
  SwitcherItem,
  Theme
} from '@carbon/react';

import { 
  UserAvatar
} from '@carbon/react/icons';

import ChangeTheme from './modals/ChangeTheme';
import { useThemePreference } from './ThemePreference'

const AppHeader = () => {

  const router = useRouter();
  const { theme } = useThemePreference();
  const [seeProfileMenu, setSeeProfileMenu] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  const handleModalClose = async (refreshList) => {
    setIsThemeModalOpen(false);
  }

  return (
    <>
      {
        isThemeModalOpen && (
          <ChangeTheme 
          isThemeModalOpen={isThemeModalOpen}
          handleModalClose={handleModalClose}
          />
        )
      }
    
      <Theme theme={theme}>
        <HeaderContainer
          render={({ isSideNavExpanded, onClickSideNavExpand }) => (
            <Header aria-label="Header">
              <HeaderMenuButton
                aria-label="Open menu"
                onClick={onClickSideNavExpand}
                isActive={isSideNavExpanded}
              />
              <HeaderName prefix="">
                <Link href="/">My App Name</Link>
              </HeaderName>
              <HeaderNavigation aria-label="Header Nav">
                <HeaderMenuItem>
                  <Link href="#">Awesome Page</Link>
                </HeaderMenuItem>
              </HeaderNavigation>
              <HeaderGlobalBar>
                <HeaderGlobalAction
                  aria-label="Profile"
                  hideLabel
                  tooltipAlignment="end"
                  onClick={() => setSeeProfileMenu(!seeProfileMenu)}
                  onfocusout={() => setSeeProfileMenu(false)}>
                  <UserAvatar size={32} />
                </HeaderGlobalAction>
              </HeaderGlobalBar>
              <HeaderPanel expanded={seeProfileMenu}>
                <Switcher>
                  <SwitcherItem onClick={() => setIsThemeModalOpen(true)}>Switch Theme</SwitcherItem>
                  {
                    router.pathname != "/login" &&
                    <>
                      <SwitcherDivider />
                      <SwitcherItem>Logout</SwitcherItem>
                    </>  
                  }
                </Switcher>
              </HeaderPanel>
              <SideNav
                aria-label="Side navigation"
                expanded={isSideNavExpanded}
                isPersistent={false}
              >
                <SideNavItems>
                  <HeaderSideNavItems>
                    <HeaderMenuItem>
                      <Link href="#">Awesome Page</Link>
                    </HeaderMenuItem>
                  </HeaderSideNavItems>
                </SideNavItems>
              </SideNav>
            </Header>
          )}
        />
      </Theme>
    </>
  );
};

export default AppHeader;