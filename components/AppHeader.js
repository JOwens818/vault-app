import React, { useState } from 'react';
import Link from "next/link";
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
  HeaderSideNavItems,
  Toggle
} from '@carbon/react';

import { 
  Switcher,
  Notification
} from '@carbon/react/icons';

import { useThemePreference } from './ThemePreference'

const AppHeader = () => {

  const { theme, setTheme } = useThemePreference();
  const [themeToggle, setThemeToggle] = useState(true);

  const switchTheme = () => {
    if (theme === 'g100') {
      setTheme('g10');
    }
    if (theme === 'g10') {
      setTheme('g100');
    }
    setThemeToggle(!themeToggle);
  }

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
            <Toggle 
              toggled={themeToggle}
              onToggle={switchTheme}
              labelA="Light"
              labelB="Dark"
              id="themeToggle"
            />
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