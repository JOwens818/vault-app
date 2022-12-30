import React, { useState } from 'react';
import { useRouter } from "next/router";
import { useThemePreference } from 'components/ThemePreference';
import { userAuth } from 'components/Auth'; 
import { fetcher } from "lib/utils/apiFetcher";
import InlineNoti from 'components/InlineNoti';
import { validateNewUserInputs } from 'lib/utils/validation';
import { 
  Tile,
  FlexGrid,
  Row,
  Column,
  Theme,
  FormGroup,
  Stack,
  TextInput,
  Checkbox,
  Button,
  Loading,
  InlineLoading
} from '@carbon/react';


const LoginPage = () => {

  const router = useRouter();
  const { theme } = useThemePreference();
  const { authLoading } = userAuth();
  const [newUser, setNewUser] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [invalidUsername, setInvalidUsername] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [loginResponse, setLoginResponse] = useState(null);
  const [shotNoti, setShowNoti] = useState(false);


  const loginOnEnterKey = async (e) => {
    const code = e.keyCode || e.which;
    if (code ===13) {
      login();
    }
  }


  const login = async () => {
    setShowNoti(false);
    setInvalidUsername(false);
    setInvalidPassword(false);
    setInvalidEmail(false);
    setLoginLoading(true);

    const payload = {
      username: username.value,
      password: password.value,
    }

    if (newUser) { 
      payload.email = email.value 
    }

    const inputValidation = validateNewUserInputs(payload);
    if (newUser && !inputValidation.areAllInputsValid) { 
      setInvalidUsername(inputValidation.invalidUsername);
      setInvalidPassword(inputValidation.invalidPassword);
      setInvalidEmail(inputValidation.invalidEmail);
      setLoginLoading(false);
      return; 
    }

    await sendLoginRequest(payload);
  }


  const sendLoginRequest = async (payload) => {
    const apiRoute = newUser ? "/api/auth/signup" : "/api/auth/login";
    const headers = {
      "Content-type": "application/json"
    };

    const loginResp = await fetcher("login", apiRoute, "POST", headers, JSON.stringify(payload));
    setLoginResponse(loginResp);
    if (loginResp.status !== "success") {
      setShowNoti(true);
      if (loginResp.status === "fail" && loginResp.message === "Invalid email address format") {
        setInvalidEmail(true);
      } 
      setLoginLoading(false);
    } else {
      const redirect = payload.username === "admin" ? "/admin" : "/";
      router.push(redirect);
    }
  }

  
  const newUserToggle = () => {
    setInvalidUsername(false);
    setInvalidPassword(false);
    setInvalidEmail(false);
    username.value = "";
    password.value = "";
    setNewUser(!newUser);
    setShowNoti(false);
  }


  if (authLoading) return <Loading />;

  return (
    <Theme theme={theme} className="windowHeight">
      <FlexGrid fullWidth={true}>
        <Row>
          <Column 
            xlg={{ span: 8, offset: 4 }}
            lg={{ span: 10, offset: 3 }}
            md={{ span: 6, offset: 1 }}
            sm={4}
          >
            <Tile>
              <FormGroup legendText="Login or Sign up">
                <Stack gap={7}>
                  <Checkbox 
                    id="newuser"
                    labelText="I'm a new user"
                    checked={newUser}
                    onChange={newUserToggle}
                  />
                  <TextInput 
                    id="username"
                    name="username"
                    type="text"
                    labelText="Enter Username"
                    placeholder="user123"
                    invalid={invalidUsername}
                    invalidText="Username must be at least 6 characters"
                    onKeyPress={loginOnEnterKey}
                  />
                  { newUser && 
                    <TextInput 
                      id="email"
                      name="email"
                      type="text"
                      labelText="Enter Email Address"
                      placeholder="user123@gmail.com"
                      invalid={invalidEmail}
                      invalidText="Enter a valid email address"
                      onKeyPress={loginOnEnterKey}
                    />
                  }
                  
                  <TextInput.PasswordInput 
                    id="password"
                    name="password"
                    type="password"
                    labelText="Enter Password"
                    placeholder="p@ssw0rd"
                    invalid={invalidPassword}
                    invalidText="Password must be at least 10 characters"
                    onKeyPress={loginOnEnterKey}
                  />
                  {
                    !loginLoading ? (
                      <Button 
                        id="submit"
                        onClick={login}
                      >
                        { newUser ? "Sign Up" : "Login" }
                      </Button>
                    ) : (
                      <InlineLoading 
                        description="Logging in..."
                        status="active"
                      />
                    )
                  }
                  
                </Stack>
              </FormGroup>
              { shotNoti && loginResponse && <InlineNoti data={loginResponse}/> }
            </Tile>
          </Column>
        </Row>
      </FlexGrid>
    </Theme>
  );
 };

 export default LoginPage;