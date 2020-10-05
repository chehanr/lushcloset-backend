<!-- panels:start -->

<!-- div:title-panel -->

# Listings

<!-- div:left-panel -->

The API allows you to retrieve product listings.

<!-- div:right-panel -->

## Endpoints

**POST** `/v1_0/listings` \
**GET** `/v1_0/listings` \
**GET** `/v1_0/listings/:id` \
**PUT** `/v1_0/listings/:id` \
**DELETE** `/v1_0/listings/:id`

<!-- panels:end -->

<!-- panels:start -->

<!-- div:title-panel -->

## Create a listing

<!-- div:left-panel -->

Create a new listing.

### Parameters

**title** _required_

The listing's title.

**description** _required_

The listing's description.

**listingType** _required_

The listing's type (`rent`, `sell`).

**priceValue** _required_

The price of the listing in cents (\$1.00 &#8594; `100`).

**currencyTypeIso** _required_

Three-letter [ISO currency](https://www.iso.org/iso-4217-currency-codes.html) code.

**address** _required_

The listing's location address.

**addressNote** _optional_

An address note.

**address** _required_

The listing's location address.

**categoryRefId** _required_

Listing category id.

**size** _optional_

The listing's size.

**brandName** _optional_

The listing's brand name.

**condition** _optional_

The listing's condition (`new`, `used_like_new`, `used_good`, `used_fair`).

**imageFileId[]** _required_

At least one `File` id.

<!-- div:right-panel -->

<!-- tabs:start -->

# **cURL**

```shell
curl -L -X POST 'http://localhost:3001/api/v1_0/listings/' \
-H 'Authorization: Bearer <token>' \
-F 'title=Product' \
-F 'description=Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent tempor libero non urna tempus ornare. Proin vitae dolor ut quam mollis euismod. Nullam ornare eros nec nulla congue rhoncus. Ut lacus ipsum, blandit eget gravida non, placerat vel ligula. Donec ut blandit lacus. In vel dui in lorem tincidunt suscipit ut a augue. Nulla interdum sodales lacus. Morbi maximus congue eleifend. In in pretium ligula. In pharetra lacus quis eleifend pulvinar. Morbi iaculis sem et ligula lobortis, sed egestas enim sodales. Pellentesque eget pellentesque risus. Phasellus fringilla mi eget arcu viverra, non consectetur justo aliquet. Morbi vel justo viverra, dignissim neque quis, consectetur dui.' \
-F 'listingType=rent' \
-F 'priceValue=5000' \
-F 'currencyTypeIso=AUD' \
-F 'address=Swinburne Hawthorne' \
-F 'addressNote=EN building' \
-F 'categoryRefId=a32f7b0d-c5bb-4b8a-8067-81717d304a8f' \
-F 'size=Large' \
-F 'brandName=Gucci' \
-F 'condition=new' \
-F 'imageFileId[]=7364aa0e-6802-458d-8398-1b7dfc2451b1' \
-F 'imageFileId[]=43da7627-2f6c-4620-9596-b543abd3b215'
```

<!-- tabs:end -->

## Response

```json
{
  "success": true,
  "error": null,
  "data": {
    "id": "2580e357-36aa-4283-b654-1aadb1c986be",
    "title": "Product",
    "shortDescription": "Lorem ipsum dolor sit amet consectetur adipiscing elit Praesent tempor libero non urna tempus ornare Proin vitae dolor ut quam mollis euismod Nullam ornare eros nec nulla congue rhoncus Ut lacus ipsum blandit eget gravida non placerat vel ligula Donec u...",
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent tempor libero non urna tempus ornare. Proin vitae dolor ut quam mollis euismod. Nullam ornare eros nec nulla congue rhoncus. Ut lacus ipsum, blandit eget gravida non, placerat vel ligula. Donec ut blandit lacus. In vel dui in lorem tincidunt suscipit ut a augue. Nulla interdum sodales lacus. Morbi maximus congue eleifend. In in pretium ligula. In pharetra lacus quis eleifend pulvinar. Morbi iaculis sem et ligula lobortis, sed egestas enim sodales. Pellentesque eget pellentesque risus. Phasellus fringilla mi eget arcu viverra, non consectetur justo aliquet. Morbi vel justo viverra, dignissim neque quis, consectetur dui.",
    "listingType": "rent",
    "status": "available",
    "price": {
      "value": 5000,
      "currencyTypeIso": "AUD"
    },
    "createdBy": {
      "id": "76fe36ac-18da-4c83-829b-38c23d68eb80",
      "name": "John Doe"
    },
    "approximateLocation": {
      "formattedAddress": "Hawthorn VIC 3122, Australia",
      "addressComponents": {
        "city": {
          "long": "Hawthorn",
          "short": "Hawthorn"
        },
        "state": {
          "long": "Victoria",
          "short": "VIC"
        },
        "country": {
          "long": "Australia",
          "short": "AU"
        },
        "postalCode": {
          "long": "3122",
          "short": "3122"
        }
      }
    },
    "preciseLocation": {
      "submittedAddress": "Swinburne Hawthorne",
      "formattedAddress": "John St, Hawthorn VIC 3122, Australia",
      "addressComponents": {
        "route": {
          "long": "John Street",
          "short": "John St"
        },
        "city": {
          "long": "Hawthorn",
          "short": "Hawthorn"
        },
        "state": {
          "long": "Victoria",
          "short": "VIC"
        },
        "country": {
          "long": "Australia",
          "short": "AU"
        },
        "postalCode": {
          "long": "3122",
          "short": "3122"
        }
      },
      "geographic": {
        "lat": -37.8221504,
        "lng": 145.0389546
      },
      "googlePlaceId": "ChIJr1quazJC1moRafeISb1r6XU",
      "note": "EN building"
    },
    "category": {
      "ref": {
        "id": "a32f7b0d-c5bb-4b8a-8067-81717d304a8f",
        "name": "Men's Clothing & Shoes"
      }
    },
    "metaData": {
      "size": "Large",
      "brandName": "Gucci",
      "condition": "new"
    },
    "images": [
      {
        "id": "4291f579-9295-4aed-9357-c04c9b0d3cca",
        "orderIndex": 0,
        "file": {
          "id": "7364aa0e-6802-458d-8398-1b7dfc2451b1",
          "links": [
            {
              "id": "fd90e4da-1761-4c07-b016-71b8a8529c29",
              "fileSize": 43364,
              "fileContentType": "image/jpeg",
              "url": "https://lushcloset.s3.us-west-002.backblazeb2.com/static/uploads/listing-image_7364aa0e-6802-458d-8398-1b7dfc2451b1_6acc096a-50f6-467c-85c6-47b342fe9bbb_917ca1e4-5ac9-45d7-9c05-83d80e63616e.jpg",
              "metadata": {
                "original": "true"
              }
            }
          ]
        }
      },
      {
        "id": "a758f20b-e338-43da-818c-13ef052836fe",
        "orderIndex": 1,
        "file": {
          "id": "43da7627-2f6c-4620-9596-b543abd3b215",
          "links": [
            {
              "id": "a6da4bc3-0210-4bce-877b-55c97cdb1489",
              "fileSize": 32218,
              "fileContentType": "image/jpeg",
              "url": "https://lushcloset.s3.us-west-002.backblazeb2.com/static/uploads/listing-image_43da7627-2f6c-4620-9596-b543abd3b215_6acc096a-50f6-467c-85c6-47b342fe9bbb_337ee174-ee67-424f-8322-200ea5fc52c9.jpg",
              "metadata": {
                "original": "true"
              }
            }
          ]
        }
      }
    ],
    "createdAt": "2020-10-05T05:59:40.349Z",
    "updatedAt": "2020-10-05T05:59:40.349Z"
  }
}
```

<!-- panels:end -->

---

<!-- panels:start -->

## Retrieve all listings

<!-- div:left-panel -->

Returns a list of listings. \
This doesn't require authentication.

### Parameters

**orderBy[]** _optional_

A list of parameters to order the results by (`createdAt`, `-createdAt`, `updatedAt`,
`-updatedAt`, `priceValue`, `-priceValue`).

**orderBy[]** _optional_

A list of parameters to filter the results by (`isRentable`, `isPurchasable`, `isAvailable`,
`-isAvailable`).

**orderByLatLng** _optional_

Order by location cords (`latitude|longitude`).

**limit** _optional_

The number of results.

**offset** _optional_

The number of results to skip.

**titleiLike** _optional_

Search by title.

**priceGte** _optional_

Price greater than.

**priceLte** _optional_

Price less than.

**currencyTypeIso** _optional_

Three-letter [ISO currency](https://www.iso.org/iso-4217-currency-codes.html) code.

**categoryRefId[]** _optional_

A list of listing category ids.

**userId[]** _optional_

A list of user ids.

<!-- div:right-panel -->

<!-- tabs:start -->

# **cURL**

```shell
curl -L -X GET 'http://localhost:3001/api/v1_0/listings/'
```

<!-- tabs:end -->

## Response

```json
{
  "success": true,
  "error": null,
  "data": {
    "count": 3,
    "limit": 30,
    "offset": 0,
    "listings": [
      {
        "id": "58a3302f-ca2a-4477-aedf-6d7f9672b664",
        "title": "Product",
        "shortDescription": "Lorem ipsum dolor sit amet consectetur adipiscing elit Praesent tempor libero non urna tempus ornare Proin vitae dolor ut quam mollis euismod Nullam ornare eros nec nulla congue rhoncus Ut lacus ipsum blandit eget gravida non placerat vel ligula Donec u...",
        "description": null,
        "listingType": "rent",
        "status": "available",
        "price": {
          "value": 5000,
          "currencyTypeIso": "AUD"
        },
        "createdBy": {
          "id": "76fe36ac-18da-4c83-829b-38c23d68eb80",
          "name": "John Doe"
        },
        "approximateLocation": {
          "formattedAddress": "Hawthorn VIC 3122, Australia",
          "addressComponents": {
            "city": {
              "long": "Hawthorn",
              "short": "Hawthorn"
            },
            "state": {
              "long": "Victoria",
              "short": "VIC"
            },
            "country": {
              "long": "Australia",
              "short": "AU"
            },
            "postalCode": {
              "long": "3122",
              "short": "3122"
            }
          }
        },
        "preciseLocation": {
          "submittedAddress": "Swinburne Hawthorne",
          "formattedAddress": "John St, Hawthorn VIC 3122, Australia",
          "addressComponents": {
            "route": {
              "long": "John Street",
              "short": "John St"
            },
            "city": {
              "long": "Hawthorn",
              "short": "Hawthorn"
            },
            "state": {
              "long": "Victoria",
              "short": "VIC"
            },
            "country": {
              "long": "Australia",
              "short": "AU"
            },
            "postalCode": {
              "long": "3122",
              "short": "3122"
            }
          },
          "geographic": {
            "lat": -37.8221504,
            "lng": 145.0389546
          },
          "googlePlaceId": "ChIJr1quazJC1moRafeISb1r6XU",
          "note": "EN building"
        },
        "category": {
          "ref": {
            "id": "a32f7b0d-c5bb-4b8a-8067-81717d304a8f",
            "name": "Men's Clothing & Shoes"
          }
        },
        "metaData": {
          "size": "Large",
          "brandName": "Gucci",
          "condition": "new"
        },
        "images": [
          {
            "id": "6d9e5100-cb5c-462a-9fd7-5306afdf27cd",
            "orderIndex": 1,
            "file": {
              "id": "43da7627-2f6c-4620-9596-b543abd3b215",
              "links": [
                {
                  "id": "a6da4bc3-0210-4bce-877b-55c97cdb1489",
                  "fileSize": 32218,
                  "fileContentType": "image/jpeg",
                  "url": "https://lushcloset.s3.us-west-002.backblazeb2.com/static/uploads/listing-image_43da7627-2f6c-4620-9596-b543abd3b215_6acc096a-50f6-467c-85c6-47b342fe9bbb_337ee174-ee67-424f-8322-200ea5fc52c9.jpg",
                  "metadata": {
                    "original": "true"
                  }
                }
              ]
            }
          },
          {
            "id": "eeffbb2f-a6ee-49be-9457-1e3fe1530af7",
            "orderIndex": 0,
            "file": {
              "id": "7364aa0e-6802-458d-8398-1b7dfc2451b1",
              "links": [
                {
                  "id": "fd90e4da-1761-4c07-b016-71b8a8529c29",
                  "fileSize": 43364,
                  "fileContentType": "image/jpeg",
                  "url": "https://lushcloset.s3.us-west-002.backblazeb2.com/static/uploads/listing-image_7364aa0e-6802-458d-8398-1b7dfc2451b1_6acc096a-50f6-467c-85c6-47b342fe9bbb_917ca1e4-5ac9-45d7-9c05-83d80e63616e.jpg",
                  "metadata": {
                    "original": "true"
                  }
                }
              ]
            }
          }
        ],
        "createdAt": "2020-10-05T07:26:32.364Z",
        "updatedAt": "2020-10-05T07:26:32.364Z"
      },
      {...},
      {...}
    ]
  }
}
```

<!-- panels:end -->

---

<!-- panels:start -->

<!-- div:title-panel -->

## Retrieve a listing

<!-- div:left-panel -->

Retrieves the details of an existing listing. \
This doesn't require authentication.

### Parameters

<!-- div:right-panel -->

<!-- tabs:start -->

# **cURL**

```shell
curl -L -X GET 'http://localhost:3001/api/v1_0/listings/2580e357-36aa-4283-b654-1aadb1c986be'
```

<!-- tabs:end -->

## Response

```json
{
  "success": true,
  "error": null,
  "data": {
    "id": "58a3302f-ca2a-4477-aedf-6d7f9672b664",
    "title": "Product",
    "shortDescription": "Lorem ipsum dolor sit amet consectetur adipiscing elit Praesent tempor libero non urna tempus ornare Proin vitae dolor ut quam mollis euismod Nullam ornare eros nec nulla congue rhoncus Ut lacus ipsum blandit eget gravida non placerat vel ligula Donec u...",
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent tempor libero non urna tempus ornare. Proin vitae dolor ut quam mollis euismod. Nullam ornare eros nec nulla congue rhoncus. Ut lacus ipsum, blandit eget gravida non, placerat vel ligula. Donec ut blandit lacus. In vel dui in lorem tincidunt suscipit ut a augue. Nulla interdum sodales lacus. Morbi maximus congue eleifend. In in pretium ligula. In pharetra lacus quis eleifend pulvinar. Morbi iaculis sem et ligula lobortis, sed egestas enim sodales. Pellentesque eget pellentesque risus. Phasellus fringilla mi eget arcu viverra, non consectetur justo aliquet. Morbi vel justo viverra, dignissim neque quis, consectetur dui.",
    "listingType": "rent",
    "status": "available",
    "price": {
      "value": 5000,
      "currencyTypeIso": "AUD"
    },
    "createdBy": {
      "id": "76fe36ac-18da-4c83-829b-38c23d68eb80",
      "name": "John Doe"
    },
    "approximateLocation": {
      "formattedAddress": "Hawthorn VIC 3122, Australia",
      "addressComponents": {
        "city": {
          "long": "Hawthorn",
          "short": "Hawthorn"
        },
        "state": {
          "long": "Victoria",
          "short": "VIC"
        },
        "country": {
          "long": "Australia",
          "short": "AU"
        },
        "postalCode": {
          "long": "3122",
          "short": "3122"
        }
      }
    },
    "preciseLocation": {
      "submittedAddress": "Swinburne Hawthorne",
      "formattedAddress": "John St, Hawthorn VIC 3122, Australia",
      "addressComponents": {
        "route": {
          "long": "John Street",
          "short": "John St"
        },
        "city": {
          "long": "Hawthorn",
          "short": "Hawthorn"
        },
        "state": {
          "long": "Victoria",
          "short": "VIC"
        },
        "country": {
          "long": "Australia",
          "short": "AU"
        },
        "postalCode": {
          "long": "3122",
          "short": "3122"
        }
      },
      "geographic": {
        "lat": -37.8221504,
        "lng": 145.0389546
      },
      "googlePlaceId": "ChIJr1quazJC1moRafeISb1r6XU",
      "note": "EN building"
    },
    "metaData": {
      "size": "Large",
      "brandName": "Gucci",
      "condition": "new"
    },
    "images": [
      {
        "id": "eeffbb2f-a6ee-49be-9457-1e3fe1530af7",
        "orderIndex": 0,
        "file": {
          "id": "7364aa0e-6802-458d-8398-1b7dfc2451b1",
          "links": [
            {
              "id": "fd90e4da-1761-4c07-b016-71b8a8529c29",
              "fileSize": 43364,
              "fileContentType": "image/jpeg",
              "url": "https://lushcloset.s3.us-west-002.backblazeb2.com/static/uploads/listing-image_7364aa0e-6802-458d-8398-1b7dfc2451b1_6acc096a-50f6-467c-85c6-47b342fe9bbb_917ca1e4-5ac9-45d7-9c05-83d80e63616e.jpg",
              "metadata": {
                "original": "true"
              }
            }
          ]
        }
      },
      {
        "id": "6d9e5100-cb5c-462a-9fd7-5306afdf27cd",
        "orderIndex": 1,
        "file": {
          "id": "43da7627-2f6c-4620-9596-b543abd3b215",
          "links": [
            {
              "id": "a6da4bc3-0210-4bce-877b-55c97cdb1489",
              "fileSize": 32218,
              "fileContentType": "image/jpeg",
              "url": "https://lushcloset.s3.us-west-002.backblazeb2.com/static/uploads/listing-image_43da7627-2f6c-4620-9596-b543abd3b215_6acc096a-50f6-467c-85c6-47b342fe9bbb_337ee174-ee67-424f-8322-200ea5fc52c9.jpg",
              "metadata": {
                "original": "true"
              }
            }
          ]
        }
      }
    ],
    "createdAt": "2020-10-05T07:26:32.364Z",
    "updatedAt": "2020-10-05T07:26:32.364Z"
  }
}
```

<!-- panels:end -->

---

<!-- panels:start -->

<!-- div:title-panel -->

## Update a listing

<!-- div:left-panel -->

Update the details of one of your listings.

### Parameters

**description** _optional_

The listing's description.

**priceValue** _optional_

The price of the listing in cents (\$1.00 &#8594; `100`).

**addressNote** _optional_

An address note.

<!-- div:right-panel -->

<!-- tabs:start -->

# **cURL**

```shell
curl -L -X PUT 'http://localhost:3001/api/v1_0/listings/2580e357-36aa-4283-b654-1aadb1c986be' \
-F 'description=New description ...' \
-F 'priceValue=3000' \
-F 'addressNote=Updated note'
```

<!-- tabs:end -->

## Response

```json
{
  "success": true,
  "error": null,
  "data": {
    "id": "58a3302f-ca2a-4477-aedf-6d7f9672b664",
    "title": "Product",
    "shortDescription": "New description ...",
    "description": "New description ...",
    "listingType": "rent",
    "status": "available",
    "price": {
      "value": 3000,
      "currencyTypeIso": "AUD"
    },
    "createdBy": {
      "id": "76fe36ac-18da-4c83-829b-38c23d68eb80",
      "name": "John Doe"
    },
    "approximateLocation": {
      "formattedAddress": "Hawthorn VIC 3122, Australia",
      "addressComponents": {
        "city": {
          "long": "Hawthorn",
          "short": "Hawthorn"
        },
        "state": {
          "long": "Victoria",
          "short": "VIC"
        },
        "country": {
          "long": "Australia",
          "short": "AU"
        },
        "postalCode": {
          "long": "3122",
          "short": "3122"
        }
      }
    },
    "preciseLocation": {
      "submittedAddress": "Swinburne Hawthorne",
      "formattedAddress": "John St, Hawthorn VIC 3122, Australia",
      "addressComponents": {
        "route": {
          "long": "John Street",
          "short": "John St"
        },
        "city": {
          "long": "Hawthorn",
          "short": "Hawthorn"
        },
        "state": {
          "long": "Victoria",
          "short": "VIC"
        },
        "country": {
          "long": "Australia",
          "short": "AU"
        },
        "postalCode": {
          "long": "3122",
          "short": "3122"
        }
      },
      "geographic": {
        "lat": -37.8221504,
        "lng": 145.0389546
      },
      "googlePlaceId": "ChIJr1quazJC1moRafeISb1r6XU",
      "note": "Updated note"
    },
    "metaData": {
      "size": "Large",
      "brandName": "Gucci",
      "condition": "new"
    },
    "images": [
      {
        "id": "eeffbb2f-a6ee-49be-9457-1e3fe1530af7",
        "orderIndex": 0,
        "file": {
          "id": "7364aa0e-6802-458d-8398-1b7dfc2451b1",
          "links": [
            {
              "id": "fd90e4da-1761-4c07-b016-71b8a8529c29",
              "fileSize": 43364,
              "fileContentType": "image/jpeg",
              "url": "https://lushcloset.s3.us-west-002.backblazeb2.com/static/uploads/listing-image_7364aa0e-6802-458d-8398-1b7dfc2451b1_6acc096a-50f6-467c-85c6-47b342fe9bbb_917ca1e4-5ac9-45d7-9c05-83d80e63616e.jpg",
              "metadata": {
                "original": "true"
              }
            }
          ]
        }
      },
      {
        "id": "6d9e5100-cb5c-462a-9fd7-5306afdf27cd",
        "orderIndex": 1,
        "file": {
          "id": "43da7627-2f6c-4620-9596-b543abd3b215",
          "links": [
            {
              "id": "a6da4bc3-0210-4bce-877b-55c97cdb1489",
              "fileSize": 32218,
              "fileContentType": "image/jpeg",
              "url": "https://lushcloset.s3.us-west-002.backblazeb2.com/static/uploads/listing-image_43da7627-2f6c-4620-9596-b543abd3b215_6acc096a-50f6-467c-85c6-47b342fe9bbb_337ee174-ee67-424f-8322-200ea5fc52c9.jpg",
              "metadata": {
                "original": "true"
              }
            }
          ]
        }
      }
    ],
    "createdAt": "2020-10-05T07:26:32.364Z",
    "updatedAt": "2020-10-05T07:35:03.321Z"
  }
}
```

<!-- panels:end -->

---

<!-- panels:start -->

<!-- div:title-panel -->

## Delete a listing

<!-- div:left-panel -->

Delete one of your listings.

### Parameters

<!-- div:right-panel -->

<!-- tabs:start -->

# **cURL**

```shell
curl -L -X DELETE 'http://localhost:3001/api/v1_0/listings/2580e357-36aa-4283-b654-1aadb1c986be' \
-H 'Authorization: Bearer <token>'
```

<!-- tabs:end -->

## Response

```json

```

<!-- panels:end -->
