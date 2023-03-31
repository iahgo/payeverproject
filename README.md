
# Project Name

Short description of the project.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Tests](#tests)


## Installation

Instructions on how to install the project and its dependencies.

```
git clone https://github.com/iahgo/payeverproject.git
```
change for the directory:
```
cd payever-task
```
dependencies:
```
npm install
```

## Usage



The API provides the following endpoints:

| Endpoint              | Description                    |
| ---------------------| ------------------------------ |
| `POST /users`        | Creates a new user             
| `GET /users/:id`     | Gets a single user by ID       |
| `GET /users/:id/avatar`     | Gets a single avatar by ID    |
| `DELETE /users/:id`  | Deletes a single user by ID    |

### Create a new user

**POST /api/users**
Request body:
```
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "johndoe@example.com",
  "avatar": "https://reqres.in/img/faces/1-image.jpg"
}
```
Response:
```
{
  "message": "User created successfully",
  "user": {
    "id": "60e08896f68f584a8aee68c1",
    "firstName": "John",
    "lastName": "Doe",
    "email": "johndoe@example.com",
    "avatar": "https://reqres.in/img/faces/1-image.jpg",
    "createdAt": "2022-04-03T15:10:46.000Z",
    "updatedAt": "2022-04-03T15:10:46.000Z"
  }
}

```

## Tests

Instructions on how to run the tests and any additional information about them.


` 
npm run test
`

