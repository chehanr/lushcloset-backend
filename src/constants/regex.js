module.exports = {
  LISTING_TITLE_BODY: /^[\w ]*[^\W_][\w ]*$/,
  // Matches `+90.0|-127.554334` => group(1)|group(4)
  ORDER_BY_LAT_LNG_QUERY: /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)\|\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/,
};
