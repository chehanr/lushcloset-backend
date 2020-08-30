const BaseController = require('./base');
const models = require('../models');

class RefController extends BaseController {
  /**
   * Get all categorie refs.
   */
  async getCategoryRefs(req, res) {
    let categoryRefObjs;

    try {
      categoryRefObjs = await models.ListingCategoryRef.findAndCountAll({
        order: [['name', 'DESC']],
      });
    } catch (error) {
      return this.fail(res, error);
    }

    const responseObj = {
      count: 0,
      categoryRefs: [],
    };

    if (categoryRefObjs) {
      responseObj.count = categoryRefObjs.count;

      categoryRefObjs.rows.forEach((categoryRefObj) => {
        const categoryRef = {
          id: categoryRefObj.id,
          name: categoryRefObj.name,
          attributes: categoryRefObj.attributes || {},
          createdAt: categoryRefObj.createdAt,
          updatedAt: categoryRefObj.updatedAt,
        };

        responseObj.categoryRefs.push(categoryRef);
      });
    }

    return this.ok(res, responseObj);
  }
}

module.exports = new RefController();
