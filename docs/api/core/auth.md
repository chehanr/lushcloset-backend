<!-- panels:start -->

<!-- div:title-panel -->

# Auth

<!-- div:left-panel -->

The API allows you to retrieve and update the authenticated user.

<!-- div:right-panel -->

## Endpoints

**POST** `/v1_0/auth/local/register` \
**POST** `/v1_0/auth/local/login` \
**POST** `/v1_0/auth/verify/email/resend` \
**GET** `/v1_0/auth/verify/email`

<!-- panels:end -->

<!-- panels:start -->

<!-- div:title-panel -->

## Create a new user

<!-- div:left-panel -->

Register a new user.

### Parameters

**name** _required_

The user's name.

**email** _required_

The user's email address.

**password** _required_

The user's password.

<!-- div:right-panel -->

<!-- tabs:start -->

# **cURL**

```shell
curl -L -X POST 'http://localhost:3001/api/v1_0/auth/local/register' \
-F 'name=John Doe' \
-F 'email=johndoe@gmail.com' \
-F 'password=password'
```

<!-- tabs:end -->

## Response

```json
{
  "success": true,
  "error": null,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMDZlZDRlZTgtNGNiZC00MDdlLTlkYWYtZjI4ZjYyNGRkOTMzIiwiZW1haWwiOiJqb2huZG9lMkBnbWFpbC5jb20ifSwiaWF0IjoxNTk5MjA0ODQ3LCJleHAiOjE2MDE3OTY4NDd9.2L_rnkpWZo8FcDxHg-y5RYG-8YVoy2e2rwJL5eFzh8s"
  }
}
```

<!-- panels:end -->

---

<!-- panels:start -->

<!-- div:title-panel -->

## Login a user

<!-- div:left-panel -->

Login an existing user.

### Parameters

**email** _required_

The user's email address.

**password** _required_

The user's password.

<!-- div:right-panel -->

<!-- tabs:start -->

# **cURL**

```shell
curl -L -X POST 'http://localhost:3001/api/v1_0/auth/local/login' \
-F 'email=johndoe@gmail.com' \
-F 'password=password'
```

<!-- tabs:end -->

## Response

```json
{
  "success": true,
  "error": null,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMDZlZDRlZTgtNGNiZC00MDdlLTlkYWYtZjI4ZjYyNGRkOTMzIiwiZW1haWwiOiJqb2huZG9lMkBnbWFpbC5jb20ifSwiaWF0IjoxNTk5MjA0ODQ3LCJleHAiOjE2MDE3OTY4NDd9.2L_rnkpWZo8FcDxHg-y5RYG-8YVoy2e2rwJL5eFzh8s"
  }
}
```

<!-- panels:end -->

---

<!-- panels:start -->

<!-- div:title-panel -->

## Resend verification email

<!-- div:left-panel -->

Resend an email with an email verification link.

### Parameters

<!-- div:right-panel -->

<!-- tabs:start -->

# **cURL**

```shell
curl -L -X POST 'http://localhost:3001/api/v1_0/auth/verify/email/resend' \
-H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNzZmZTM2YWMtMThkYS00YzgzLTgyOWItMzhjMjNkNjhlYjgwIiwiZW1haWwiOiJqb2huZG9lQGdtYWlsLmNvbSJ9LCJpYXQiOjE1OTkxOTkzMjUsImV4cCI6MTU5OTI4NTcyNX0.3aunA2J0ZqXrCuC_4GA578ZORbSfQigXxMfwrJXzgT8'
```

<!-- tabs:end -->

## Response

```json
{
  "success": true,
  "error": null,
  "data": "OK"
}
```

<!-- panels:end -->

---

<!-- panels:start -->

<!-- div:title-panel -->

## Verify email

<!-- div:left-panel -->

Verify an email. \
This endpoint is supposed to be accessed via a user verification email.

### Parameters

**userId** _required_

The user's UUID.

**token** _required_

Verification token generated by the server.

<!-- div:right-panel -->

<!-- tabs:start -->

# **cURL**

```shell
curl -L -X GET 'http://localhost:3001/api/v1_0/auth/verify/email?userId=870a0d49-a041-4daf-b650-2da1e04cda73&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg3MGEwZDQ5LWEwNDEtNGRhZi1iNjUwLTJkYTFlMDRjZGE3MyIsImVtYWlsIjoiY2hlaGFuLnJhdEBnbWFpbC5jb20iLCJpYXQiOjE1OTg5NDA2NjEsImV4cCI6MTU5OTAyNzA2MX0.f57L3hHBB2dnBjPnqQ7rwqnQye2T5AF1ZxlLLB9uLVc'
```

<!-- tabs:end -->

## Response

```json
{
  "success": true,
  "error": null,
  "data": "OK"
}
```

<!-- panels:end -->
