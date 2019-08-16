const ShoppingListService = require('../src/shopping-list-service')
const knex = require('knex')

describe(`Shopping List service object`, function() {
    let db
    let testShoppingList = [
        {
            product_id: 1,
            name: 'something',
            price: '10.00',
            category: 'Main',
            checked: true,
            date_added: new Date('2029-01-22T16:28:32.615Z'),
        },
        {
            product_id: 2,
            name: 'something2',
            price: '5.00',
            category: 'Main',
            checked: true,
            date_added: new Date('2029-06-22T16:28:32.615Z'),
        },
        {
            product_id: 3,
            name: 'something3',
            price: '13.00',
            category: 'Main',
            checked: false,
            date_added: new Date('2010-07-22T16:28:32.615Z'),
        }
    ];

    before(() => {
        db = knex({
        client: 'pg',
        connection: process.env.TEST_DB_URL,
        })
    })

    after(() => db.destroy())

    afterEach(() => db('shopping_list').truncate())

    before(() => db('shopping_list').truncate())

    context(`Given 'shopping-list' has data`, () => {
        beforeEach(() => {
            return db
                .into('shopping_list')
                .insert(testShoppingList)
        })

        it(`resolves shopping-list from 'shopping-list' table`, () => {
            return ShoppingListService.getShoppingList(db)
                .then(actual => {
                    expect(actual).to.eql(testShoppingList)
                })
        })

        it(`getById() resolves an item by id from 'shopping-list' table`, () => {
            const thirdId = 3
            const thirdTestItem = testShoppingList[thirdId - 1]
            return ShoppingListService.getById(db, thirdId)
                .then(actual => {
                    expect(actual).to.eql({
                        product_id: thirdId,
                        name: thirdTestItem.name,
                        price: thirdTestItem.price,
                        category: thirdTestItem.category,
                        checked: thirdTestItem.checked,
                        date_added: thirdTestItem.date_added,
                    })
                })
        })

        it(`deleteItem() removes an item by id from 'shopping-list' table`, () => {
          const itemId = 3
          return ShoppingListService.deleteArticle(db, itemId)
            .then(() => ShoppingListService.getShoppingList(db))
            .then(allItems => {
              const expected = testShoppingList.filter(item => item.product_id !== itemId)
              expect(allItems).to.eql(expected)
            })
        })

        it(`updateItem() updates an item from the 'shopping-list' table`, () => {
          const idOfItemToUpdate = 3
          const newItemData =  {
            name: ' updated something3',
            price: '13.00',
            category: 'Main',
            checked: false,
            date_added: new Date('2010-07-22T16:28:32.615Z')
        }
          return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
            .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
            .then(item => {
              expect(item).to.eql({
                product_id: idOfItemToUpdate,
                ...newItemData,
              })
            })
        })
            
    })

    context(`Given 'shopping-list' has no data`, () => {
        it(`getShoppingList() resolves an empty array`, () => {
            return ShoppingListService.getShoppingList(db)
            .then(actual => {
                expect(actual).to.eql([])
          })
        })

        it(`insertArticle() inserts an article and resolves the article with an 'id'`, () => {
            const newItem =  {
                name: 'something3',
                price: '13.08',
                category: 'Main',
                checked: false,
                date_added: new Date('2016-07-22T16:28:32.615Z'),
            }

            return ShoppingListService.insertItem(db, newItem)
                .then(actual => {
                    expect(actual).to.eql({
                        product_id: 1,
                        name: 'something3',
                        price: '13.08',
                        category: 'Main',
                        checked: false,
                        date_added: new Date('2016-07-22T16:28:32.615Z')
                    })
                })
        })
    })
        
})