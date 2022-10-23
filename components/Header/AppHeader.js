import React from 'react';
import Link from "next/link";
import styles from './AppHeader.module.scss';
import {
  Header,
  HeaderContainer,
  HeaderName,
  HeaderNavigation,
  HeaderMenuButton,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SideNav,
  SideNavItems,
  HeaderSideNavItems
} from '@carbon/react';


import { 
  Search,
  Switcher,
  Notification
 } from '@carbon/react/icons';


const AppHeader = () => {

  return (
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
              aria-label="Search">
              <Search size={20} />  
            </HeaderGlobalAction>
            <HeaderGlobalAction
              aria-label="Notifications">
              <Notification size={20} />  
            </HeaderGlobalAction>
            <HeaderGlobalAction
              aria-label="App Switcher"
              tooltipAlignment="end">
              <Switcher size={20} />
            </HeaderGlobalAction>
          </HeaderGlobalBar>
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
  );
};

export default AppHeader;