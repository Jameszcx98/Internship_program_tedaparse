const q = require('../tools/request')
const { QueryBuilder } = require('mage2-webapi');
const uuidv4 = require('uuid/v4');
const bcrypt = require('bcrypt');
const saltRounds = 10;



module.exports = {

  getHomeCategory: async req => {
    return await q.get('/categories').then()
  },

  getItemStock: async req => {
    let sku = req.params.sku
    return await q.get('/stockItems/' + sku)
  },

  hotItems: async req => {
    let r = await q.get('/categories/6/products').then()
    let promises = r.map(x => {
      return q.get('/products/' + x.sku)
    })
    let res = await Promise.all(promises).then()
    return res
  },

  getCategories: async req => {    // Get category list from the server
    return await q.get('/categories').then();
  },

  getProductList: async req => {    // Get products under certain category
    let id = req.params.id;
    return await q.get('/categories/' + id + '/products').then();
  },
  
  getMyCarlist: async req =>{   // Get specific car infos this user uploaded
    let pageSize = 100      //条目数
    let currentPage = 1       //当前页
    let userid = 00001
    let url = `/products?searchCriteria[page_size]=${pageSize}&searchCriteria[current_page]=${currentPage}&`
    let items = await q.get(url)
    console.log("items:",items)
    let carList = items.items

    //console.log("items:",carList)

    let cusAttr = items.items.map(x => {
      return x.custom_attributes
    })

    let resarr = []
    let returnarr = []


    //console.log("cusArr:",cusAttr[0])
    for(let item of cusAttr){
      for(let i of item){
        if(i.attribute_code == 'userid' && i.value == userid){
          resarr.push(item)
        }
      }
    }

    function getValue(arr,label) {
      var filterArray = arr.filter(function(v) {
          return v.attribute_code === label
      })
      if (filterArray.length) {
          return filterArray[0].value
      }
    }

    //const findLabel = (arr, value) => arr.find(obj => obj.value === value).attribute_code

    for(let res of resarr){
      let plate = getValue(res,'plate')
      let city = getValue(res,'city')
      console.log("plate:",plate)
      let parameter = {
        name:plate,
        desc:city
      }
      returnarr.push(parameter)
    }


    console.log("returnarr:",returnarr)

    return returnarr

    //console.log("resarr:",resarr)
    

  },

  getFilteredProducts: async req => {//筛选
      // console.log('8888888'+JSON.stringify(req.params));
    let pageSize;//条目数
    let currentPage;//当前页
    if(!!req.params.pageSize){
      pageSize=req.params.pageSize
    }else{
      pageSize=20
    }
    if(!!req.params.currentPage){
      currentPage=req.params.currentPage
    }else{
      currentPage=1
    }
    let builder = new QueryBuilder();
    if(!!req.params.choose2){
      req.params.choose2.forEach(a=> 
        builder.addFilterGroup(a.options)
     );
    }
    // console.log('dskkdjsk'+currentPage)
    // req.params.pageSize?req.params.pageSize:5
    // req.params.currentPage?req.params.currentPage:1
    // console.log('hhhh'+JSON.stringify(req.params))
    // console.log('gggggg'+console.log(aaa))
    // return;
    // builder.addFilterGroup([//and关系
    //   {
    //     field: "price",
    //     value: 40,
    //     condition:'gt'//大于

    //   }
     
    // ])
    // builder.addFilterGroup([
    //   {
    //     field: "price",
    //     value: 51,
    //     condition:'lt'//小于
    //   }
    // ])
    let url = `/products?searchCriteria[page_size]=${pageSize}&searchCriteria[current_page]=${currentPage}&` + builder.getQuery()
    return await q.get(url)
  },


  getAttbutesLabel: async req => {
    return  await q.get(`/products/attribute-sets/4/attributes`)
  },

  
  getAllAttributeMenu:async req=>{
    
    let url='categories/attributes?searchCriteria[page_size]=5&searchCriteria[current_page]=1'
    return await q.get(url)
  },
  
  products: async req => {    // Get the detail info of products under the category
    let sku = req.params.sku
    return await q.get('/products/' + sku)
  },

  createCustomer: async req => {
    console.log('req' + JSON.stringify(req))

    // 创建一个Magento 账户，unionId 被加盐存起来了
    // let userId = req.user.id
    let unionId = req.params.openId
    let wxProfile = req.params.wxProfile
    // console.log('99999'+JSON.stringify(wxProfile))
    // console.log(unionId)

    let password = uuidv4()

    // let isEmailOk = await q.post('/customers/isEmailAvailable', {
    //   customerEmail: `${unionId}@qq.com`
    // }).then()

    // console.log('isEmailOk' + JSON.stringify(isEmailOk))

    // if (!isEmailOk) {
    //   return
    // }

    if (unionId) {
      let r = await q({
        method: 'post',
        url: '/customers',
        data: {
          customer: {
            "email": `${unionId}@qq.com`,
            "firstname": `${wxProfile.nickName}`,
            "lastname": `${wxProfile.nickName}`,
            "storeId": 1,
            "websiteId": 1
          },
          password: password
        }
      })
      return r
    }

  },


  addOrder: async req => {
    let p = req.params


    let res = await q.post('/carts/mine',{
      param:{
        'customerId':p.customerId
      }
    }).then()
    console.log('r' + JSON.stringify(res))
    return


    

    let r = await q({
      method: 'post',
      url: '/orders/create',
      data: p
    })

    return r
  },

  orders: async req => {

    let builder = new QueryBuilder();
    builder.addFilterGroup([
      {
        field: "customer_email",
        value: "woooms@qq.com"
      }
    ]
    )

    let r = await q({
      method: 'get',
      url: '/orders? ' + builder.getQuery(),
    })

    console.log(typeof r)

    return r
  },


  // Make payment
  pay: async req => {
    let orderId = req.params.orderId;
  },


  
  // getFilteredProducts: async req => {

  //   let builder = new QueryBuilder();
  //   builder.addFilterGroup([//and关系
  //     {
  //       field: "price",
  //       value: 40,
  //       condition:'gt'//大于

  //     }
     
  //   ])
  //   builder.addFilterGroup([
  //     {
  //       field: "price",
  //       value: 51,
  //       condition:'lt'//小于
  //     }
  //   ])

  //   let pageSize = 5//条目数
  //   let currentPage = 1//当前页
  //   let url = `/products?searchCriteria[page_size]=${pageSize}&searchCriteria[current_page]=${currentPage}&` + builder.getQuery()
  //   return await q.get(url)
  // },
  getAttbutesLabel: async req => {
    return await q.get(`/products/attribute-sets/4/attributes`)
  },

  
  getAllAttributeMenu:async req=>{
    
    let url='categories/attributes?searchCriteria[page_size]=5&searchCriteria[current_page]=1'
    return await q.get(url)
  },


}
