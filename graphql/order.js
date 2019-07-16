module.exports = {
    getOrders: `
    query getorders {
            customerOrders () {
              items {
                increment_id
                id
                created_at
                grand_total
                status
              }
            }
    }
    `
}