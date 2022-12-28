## Password Vault

### Overview
Password manager application for people who don't want to use third party applications to store
their passwords.  All passwords are stored in a postgres database and encypted at rest using AES256


### Run locally

```sh
npm install
npm run dev
```

### Run locally (Docker)

```sh
docker image build -t vault-app .
docker run -p 3030:3030 vault-app
```
