## Password Vault

### Overview

Password manager application for people who don't want to use third party applications to store
their passwords.  Hashicorp Vault is great, but maintaining your own instance may not be desirable.  All passwords are stored in a postgres database and encypted at rest using AES256

### Prerequisites

* Postgres instance - Cloud service, local or remote VM, etc
    * Create database(s) if not already created
    * VM and local instances - configure pg_hba.conf & postgresql.conf as necessary
* Hosting environment
    * It is your responsibility to setup and enforce HTTPS.  I'm using a reverse proxy but there are many ways to accomplish this.  **You have been warned!**

### ES256 Key Pair Generation

JWTs are signed using the ES256 algorithm.  To generate your own with openssl:

```sh
openssl ecparam -genkey -name prime256v1 -noout -out ec_private.pem
openssl ec -in ec_private.pem -pubout -out ec_public.pem
``` 

### Setting Up Secrets

* Reference .env.example for full list
* Secrets prefixed with PG - Postgres connection credentials
* JWT keys - Store as one continuous string, replacing new lines with \n
* SECRET_KEY - Needed for encryption/decryption
* ADMINPW - Password for the 'admin' user
* SECRET_TBL_NAME - Desired table name where encrypted secrets will be stored (For obscurity)
* SECRET_TBL_COL_* - Desired column names in SECRET_TBL_NAME (For obscurity)


### Running The Application

Local development server

```sh
npm install
npm run dev
```

Docker Container

```sh
docker image build -t vault-app .
docker run -p 3030:3030 vault-app
```
*If docker and postgres are running on the same host add `--network="host"` to the docker run command*

### Table Initialization

The first time you launch the application you will need to create the tables in your Postgres database.  This can only be done if a valid ADMINPW is provided.  Example curl request:

```sh
curl -X POST "$HOSTNAME/api/admin/db-setup" \
--header 'content-type: application/json' \
--data-raw '{"adminPw": $ADMINPW}'
```