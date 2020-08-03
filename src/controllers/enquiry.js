const BaseController = require('./base');
const models = require('../models');

class EnquiryController extends BaseController {
  /**
   * Retrieve a listing enquiry \
   * with params `enquiryId`.
   */
  async retrieveListingEnquiryItem(req, res) {
    const errorResponseObj = { validation: {} };

    if (req.validated.params?.error) {
      errorResponseObj.validation.params = req.validated.params.error;

      return this.unprocessableEntity(res, errorResponseObj);
    }

    try {
      const enquiryObj = await models.ListingEnquiry.findByPk(
        req.validated.params.value.enquiryId,
        {
          include: [
            {
              model: models.User,
              as: 'user',
            },
            {
              model: models.Listing,
              as: 'listing',
            },
          ],
        }
      );

      if (enquiryObj) {
        if (
          !(
            enquiryObj.userId === req.user.id ||
            enquiryObj.listing.userId === req.user.id
          )
        ) {
          return this.unauthorized(res, null);
        }

        const responseObj = {
          id: enquiryObj.id,
          status: enquiryObj.enquiryStatus,
          user: {
            id: enquiryObj.user.id,
            name: enquiryObj.user.name,
          },
          listing: {
            id: enquiryObj.listing.id,
            title: enquiryObj.listing.title,
          },
          createdAt: enquiryObj.createdAt,
          updatedAt: enquiryObj.updatedAt,
        };

        return this.ok(res, responseObj);
      }
      return this.notFound(res, null);
    } catch (error) {
      return this.fail(res, error);
    }
  }
}

module.exports = new EnquiryController();
