<!-- panels:start -->

<!-- div:title-panel -->

# Me

<!-- div:left-panel -->

The API allows you to retrieve and update the authenticated user.

<!-- div:right-panel -->

## Endpoints

**GET** `/v1_0/me` \
**PUT** `/v1_0/me`

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
