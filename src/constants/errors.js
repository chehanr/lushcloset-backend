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
  purchaseError: 'purchaseError',
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
  validationFileError: {
    type: errorTypes.invalidRequestError,
    code: 'fileError',
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
    code: 'previousPendingReviewEnquiry',
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
  notRentableError: {
    type: errorTypes.listingError,
    code: 'notRentable',
    message: 'The listing cannot be rented.',
    extra: null,
  },
  notPurchasableError: {
    type: errorTypes.listingError,
    code: 'notPurchasable',
    message: 'The listing cannot be purchased.',
    extra: null,
  },
  lockedPurchaseError: {
    type: errorTypes.purchaseError,
    code: 'lockedPurchase',
    message: 'The listing purchase is locked',
    extra: null,
  },
  invalidRentalVerificationCodeError: {
    type: errorTypes.rentalError,
    code: 'invalidRentalVerificationCode',
    message: 'The listing rental verification code is invalid',
    extra: null,
  },
  invalidPurchaseVerificationCodeError: {
    type: errorTypes.purchaseError,
    code: 'invalidPurchaseVerificationCode',
    message: 'The listing purchase verification code is invalid',
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
