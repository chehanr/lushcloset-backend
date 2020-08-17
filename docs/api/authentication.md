<!-- panels:start -->

<!-- div:title-panel -->

# Authentication

<!-- div:left-panel -->

As of this moment the LushCloset API accepts HTTP requests from any client. This could change in the future with the
introduction of API keys.

Authentication to the API is performed via [Bearer tokens](https://tools.ietf.org/html/rfc6750)
using `-H Authorization: Bearer <JWT>`. A [JWT](https://jwt.io/) can be obtained by performing a GET request to the
`/user` endpoint passing an email and a password in the request body.

All API requests in production should be made over HTTPS. Some API requests without authentication will fail.

<!-- div:right-panel -->

<!-- tabs:start -->

# **cURL**

```shell
curl http://localhost:3001/api/v1_0/auth/me \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMTc5NWU2OTUtNGRkMS00ODQyLTgyZGEtYmNjYWI4NDI1YjZlIiwiZW1haWwiOiJjaGVoYW4ucmF0QGdtYWlsLmNvbSJ9LCJpYXQiOjE1OTYzNjI3MTQsImV4cCI6MTU5ODk1NDcxNH0.Pu6AB03JkwcEHlOSQvnJkunbWlTCs8wGCW3TlFvUsvs"
```

<!-- tabs:end -->

<!-- panels:end -->
