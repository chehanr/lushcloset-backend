<!-- panels:start -->

<!-- div:title-panel -->

# Me

<!-- div:left-panel -->

The API allows you to retrieve and update the authenticated user.

<!-- div:right-panel -->

## Endpoints

**GET** `/v1_0/me` \
**PUT** `/v1_0/me` \
**POST** `/v1_0/me/avatar`

<!-- panels:end -->

<!-- panels:start -->

<!-- div:title-panel -->

## Retrieve authenticated user

<!-- div:left-panel -->

Retrieves the details of the authenticated user. \
This requires authentication.

### Parameters

<!-- div:right-panel -->

<!-- tabs:start -->

# **cURL**

```shell
curl -L -X GET 'http://localhost:3001/api/v1_0/me' \
-H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNzZmZTM2YWMtMThkYS00YzgzLTgyOWItMzhjMjNkNjhlYjgwIiwiZW1haWwiOiJqb2huZG9lQGdtYWlsLmNvbSJ9LCJpYXQiOjE1OTkxOTkzMjUsImV4cCI6MTU5OTI4NTcyNX0.3aunA2J0ZqXrCuC_4GA578ZORbSfQigXxMfwrJXzgT8'
```

<!-- tabs:end -->

## Response

```json
{
  "success": true,
  "error": null,
  "data": {
    "id": "76fe36ac-18da-4c83-829b-38c23d68eb80",
    "email": "johndoe@gmail.com",
    "name": "John Doe",
    "avatar": {
      "id": "173371c0-9b1d-4d40-8933-5a985f8fecaf",
      "file": {
        "id": "9eabce8a-9b7c-4c83-9f60-3da6204087ba",
        "links": [
          {
            "id": "026ec0a7-88d2-4d43-9bc4-4b11318e92fb",
            "fileSize": 163162,
            "fileContentType": "image/jpeg",
            "url": "https://lushcloset.s3.us-west-002.backblazeb2.com/static/uploads/user-avatar_9eabce8a-9b7c-4c83-9f60-3da6204087ba_76fe36ac-18da-4c83-829b-38c23d68eb80_b43370aa-368b-4416-b41a-bdf49cb5f0c8.jpg",
            "metadata": {
              "original": "true"
            }
          }
        ]
      }
    },
    "emailVerifiedAt": "2020-08-31T12:52:40.537Z",
    "createdAt": "2020-08-31T12:47:54.537Z",
    "updatedAt": "2020-09-02T08:45:33.412Z"
  }
}
```

<!-- panels:end -->

---

<!-- panels:start -->

<!-- div:title-panel -->

## Update authenticated user

<!-- div:left-panel -->

Updates the authenticated user by setting the values of the parameters passed. \
Any parameters not provided will be left unchanged.

### Parameters

**name** _optional_

The user's name.

<!-- div:right-panel -->

<!-- tabs:start -->

# **cURL**

```shell
curl -L -X PUT 'http://localhost:3001/api/v1_0/me' \
-H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNzZmZTM2YWMtMThkYS00YzgzLTgyOWItMzhjMjNkNjhlYjgwIiwiZW1haWwiOiJqb2huZG9lQGdtYWlsLmNvbSJ9LCJpYXQiOjE1OTkxOTkzMjUsImV4cCI6MTU5OTI4NTcyNX0.3aunA2J0ZqXrCuC_4GA578ZORbSfQigXxMfwrJXzgT8' \
-F 'name=Joe Dirt'
```

<!-- tabs:end -->

## Response

```json
{
  "success": true,
  "error": null,
  "data": {
    "id": "76fe36ac-18da-4c83-829b-38c23d68eb80",
    "email": "johndoe@gmail.com",
    "name": "Joe Dirt",
    "avatar": {
      "id": "173371c0-9b1d-4d40-8933-5a985f8fecaf",
      "file": {
        "id": "9eabce8a-9b7c-4c83-9f60-3da6204087ba",
        "links": [
          {
            "id": "026ec0a7-88d2-4d43-9bc4-4b11318e92fb",
            "fileSize": 163162,
            "fileContentType": "image/jpeg",
            "url": "https://lushcloset.s3.us-west-002.backblazeb2.com/static/uploads/user-avatar_9eabce8a-9b7c-4c83-9f60-3da6204087ba_76fe36ac-18da-4c83-829b-38c23d68eb80_b43370aa-368b-4416-b41a-bdf49cb5f0c8.jpg",
            "metadata": {
              "original": "true"
            }
          }
        ]
      }
    },
    "emailVerifiedAt": "2020-08-31T12:52:40.537Z",
    "createdAt": "2020-08-31T12:47:54.537Z",
    "updatedAt": "2020-09-04T06:56:14.615Z"
  }
}
```

<!-- panels:end -->

---

<!-- panels:start -->

<!-- div:title-panel -->

## Set an avatar

<!-- div:left-panel -->

Set the avatar of the authenticated user with an uploaded file. \
This requires authentication.

### Parameters

**fileId** _required_

A file id of an uploaded user avatar.

<!-- div:right-panel -->

<!-- tabs:start -->

# **cURL**

```shell
curl -L -X POST 'http://localhost:3001/api/v1_0/me/avatar' \
-H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNzZmZTM2YWMtMThkYS00YzgzLTgyOWItMzhjMjNkNjhlYjgwIiwiZW1haWwiOiJqb2huZG9lQGdtYWlsLmNvbSJ9LCJpYXQiOjE1OTkxOTkzMjUsImV4cCI6MTU5OTI4NTcyNX0.3aunA2J0ZqXrCuC_4GA578ZORbSfQigXxMfwrJXzgT8' \
-F 'fileId=d8621497-197c-4e8b-a4cc-2a11d91b3824'
```

<!-- tabs:end -->

## Response

```json
{
  "success": true,
  "error": null,
  "data": {
    "id": "76b08018-25b9-4f55-bfee-c9323da0cadc",
    "file": {
      "id": "d8621497-197c-4e8b-a4cc-2a11d91b3824",
      "purpose": "user_avatar",
      "links": [
        {
          "id": "bac36f13-a4f1-41fd-8b10-e22519cd4a1e",
          "fileName": "static/uploads/user-avatar_d8621497-197c-4e8b-a4cc-2a11d91b3824_ecdf3485-70e7-4ebf-b69e-c43e00171ccd_1f8415c7-6688-4e78-a745-3797fb94c8d3.jpg",
          "fileSize": 43364,
          "fileContentType": "image/jpeg",
          "url": "https://lushcloset.s3.us-west-002.backblazeb2.com/static/uploads/user-avatar_d8621497-197c-4e8b-a4cc-2a11d91b3824_ecdf3485-70e7-4ebf-b69e-c43e00171ccd_1f8415c7-6688-4e78-a745-3797fb94c8d3.jpg",
          "metadata": {
            "original": "true"
          },
          "uploadedAt": "2020-09-05T07:39:18.000Z",
          "expiresAt": null,
          "createdAt": "2020-09-05T07:39:18.853Z",
          "updatedAt": "2020-09-05T07:39:18.853Z"
        }
      ]
    },
    "createdAt": "2020-09-05T07:39:40.563Z",
    "updatedAt": "2020-09-05T07:39:40.563Z"
  }
}
```

<!-- panels:end -->
