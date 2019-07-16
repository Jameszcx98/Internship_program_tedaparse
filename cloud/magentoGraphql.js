let { GraphQLClient } = require('graphql-request')
const endpoint = 'https://cause.wudizu.com/graphql'
const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    authorization: 'Bearer i6idbw5xbpiw8dk14cdvi77auygug9ce',
  },
})

//  https://devdocs.magento.com/guides/v2.3/graphql/reference/products.html 官方

// https://github.com/mobelop/gatsby-source-magento2  一个gatsby 的插件

let { DetailPageItem } = require('../graphql/product')
let { getOrders } = require('../graphql/order')

module.exports = {


  getCategoryItems: async req => {
    let q = req.params
    let r = await graphQLClient.request(DetailPageItem)
  },


  Gproducts: async req => {
    let sku = '00000003'
    let r = await graphQLClient.request(`
    query ProductDetail($sku: String!)
    {
        products(
          search:$sku
          pageSize: 10
        )
        {
          total_count
          items {
            name
            sku
            image{
              label
              url
            }
            media_gallery_entries{
              file
              label
            }
            
            ... on CustomizableProductInterface {
              
              options {
                title
                option_id
                required
                sort_order
                ... opt
              }
            }
            
            price {
              regularPrice {
                amount {
                  value
                  currency
                }
              }
            }
          }
          page_info {
            page_size
            current_page
          }
        }
      }
      
      fragment opt on CustomizableRadioOption {
        value {
          option_type_id
          price
          price_type
          sku
          sort_order
          title
        }
      }
        `, {
      sku: sku
    }).then()
    return r
  },




}