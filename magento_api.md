
    ###搜索教程
    // https://devdocs.magento.com/guides/v2.3/rest/performing-searches.html

    // To perform a logical OR, specify multiple filters within a filter_groups.
    // To perform a logical AND, specify multiple filter_groups.

    // 如果是一个or ,就只需要一个搜索组 +  多个搜索条件
    // 如果是一个and 就需要多个搜索组

    // https://domain.com/index.php/rest/V1/orders
    // ?searchCriteria[f‌​ilter_groups][0][fil‌​ters][0][field]=cust‌​omer_email
    // &searchCri‌​teria[filter_groups]‌​[0][filters][0][valu‌​e]=aaa@google.com
    // &se‌​archCriteria[filter_‌​groups][0][filters][‌​0][condition_type]=e‌​q

    // &searchCriteria[fil‌​ter_groups][1][filte‌​rs][0][field]=status‌​
    // &searchCriteria[filt‌​er_groups][1][filter‌​s][0][value]=pending‌​
    // &searchCriteria[filt‌​er_groups][1][filter‌​s][0][condition_type‌​]=eq