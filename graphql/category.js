module.exports = {
    Category : `

{
    products(
      search: "test1"
      pageSize: 10
    )
    {
      total_count
      items {
        name
        sku
        
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
    `
}