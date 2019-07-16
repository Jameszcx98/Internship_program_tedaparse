module.exports = {
    createCustomer: `
    
    mutation createCustomer () {
        createCustomer(
          input: {
            firstname: "Bob"
            lastname: "Loblaw"
            email: "bobloblaw@example.com"
            password: "b0bl0bl@w"
            is_subscribed: true
          }
        ) {
          customer {
            id
            firstname
            lastname
            email
            is_subscribed
          }
        }
      }

    `
}