const errorTypes = {
  apiConnectionError: 'apiConnectionError',
  apiError: 'apiError',
  authenticationError: 'authenticationError',
  idempotencyError: 'idempotencyError',
  invalidRequestError: 'invalidRequestError',
  rateLimitError: 'rateLimitError',
  validationError: 'validationError',
  enquiryError: 'enquiryError',
  listingError: 'listingError',
  rentalError: 'rentalError',
};

const errorResponses = {
  validationParamError: {
    type: errorTypes.invalidRequestError,
    code: 'paramError',
    message: 'Invalid parameter provided in the request path',
    extra: null,
  },
  validationQueryError: {
    type: errorTypes.invalidRequestError,
    code: 'queryError',
    message: 'Invalid parameter provided in the request queries',
    extra: null,
  },
  validationBodyError: {
    type: errorTypes.invalidRequestError,
    code: 'bodyError',
    message: 'Invalid parameter provided in the request body',
    extra: null,
  },
  userAlreadyExistsError: {
    type: errorTypes.validationError,
    code: 'userAlreadyExists',
    message: 'A user with the provided credentials already exists',
    extra: null,
  },
  userNotFoundError: {
    type: errorTypes.validationError,
    code: 'userNotFound',
    message: 'A user with the provided credentials does not exist',
    extra: null,
  },
  userNotAuthenticatedError: {
    type: errorTypes.authenticationError,
    code: 'userNotAuthenticated',
    message: 'Request is not authenticated with a valid user',
    extra: null,
  },
  invalidChatParticipantError: {
    type: errorTypes.validationError,
    code: 'invalidChatParticipant',
    message: 'Invalid chat participant ID',
    extra: null,
  },
  lockedEnquiryError: {
    type: errorTypes.enquiryError,
    code: 'lockedEnquiry',
    message: 'The listing enquiry is locked',
    extra: null,
  },
  previousPendingReviewEnquiryError: {
    type: errorTypes.enquiryError,
    code: 'lockedListing',
    message: 'Previous listing enquiry is pending review',
    extra: null,
  },
  unprocessableLocationAddress: {
    type: errorTypes.listingError,
    code: 'unprocessableLocationAddress',
    message: 'The location address cannot be processed',
    extra: null,
  },
  lockedListingError: {
    type: errorTypes.listingError,
    code: 'lockedListing',
    message: 'The listing is locked',
    extra: null,
  },
  lockedRentalError: {
    type: errorTypes.rentalError,
    code: 'lockedRental',
    message: 'The listing rental is locked',
    extra: null,
  },
  invalidRentalVerificationCodeError: {
    type: errorTypes.rentalError,
    code: 'lockedRental',
    message: 'The listing rental verification code is invalid',
    extra: null,
  },
};

module.exports = {
  errorTypes: {
    ...errorTypes,
  },
  errorResponses: {
    ...errorResponses,
  },
};
