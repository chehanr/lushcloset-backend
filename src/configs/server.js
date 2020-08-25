module.exports = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'secret',
  jwtExpirationTime: process.env.JWT_EXPIRATION_TIME || '1d',
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10),
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
  storageProvider: process.env.STORAGE_PROVIDER || 'B2',
  b2KeyId: process.env.B2_KEY_ID,
  b2AppKey: process.env.B2_APP_KEY,
  b2BucketName: process.env.B2_BUCKET_NAME || 'lushcloset',
  b2BucketEndpoint: process.env.B2_BUCKET_ENDPOINT,
};
