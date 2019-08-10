require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
})


function getItemsWithText(text){
    knexInstance
        .select('*')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${text}%`)
        .then(result => {
            console.log(result)
        })
}

function paginateList(page) {
    const productsPerPage = 6
    const offset = productsPerPage * (page - 1)
    knexInstance
      .select('*')
      .from('shopping_list')
      .limit(productsPerPage)
      .offset(offset)
      .then(result => {
        console.log(result)
      })
  }

//getItemsWithText('pre')
//paginateList(2);

function getItemsAddedAfterDate(daysAgo){
    knexInstance 
        .select('*')
        .from('shopping_list')
        .where(
            'date_added',
            '>',
            knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
        )
        .then(result => {
            console.log(result)
        })
}

//getItemsAddedAfterDate(1);

function sumItemCategories(){
    knexInstance
        .from('shopping_list')
        .select('category')
        .count('name AS items')
        .sum('price AS total')
        .groupBy('category')
        .then(result => {
            console.log(result)
        })
  }

sumItemCategories();