const { ApolloServer, gql, PubSub } = require('apollo-server')
const mongoose = require('mongoose')
const data = require('../data/demoData')
const pubsub = new PubSub()
const PhoneSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true
  },
  address: {
    type: String
  }
})

PhoneSchema.index({
  '$**': 'text'
})

// Create presave trigger for example
PhoneSchema.pre('save', function (next) {
  // this.<fieldname>
  next()
})

const Phone = mongoose.model('Phone', PhoneSchema)
const MONGO_URI = 'mongodb://localhost:27017/PhoneBook'
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log(`🚀   База взлетела ${MONGO_URI}`))
  .catch(err => console.error(err))

// types for graphql
const typeDefs = gql`
  type Query {
    """
    Get all phones
    """
    Phones: [Phone]
    """
    Search phones
    """
    searchPhones(searchTerm: String): [Phone]
    
  }
  type Phone {
    id: ID
    """
    Number of phone
    """
    phone: String
    """
    Name of person
    """
    name: String
    """
    Address of person
    """
    address: String
  }
  "input argument"
  input inputPhone {
    id:ID,
    phone: String!
    name: String
    address: String
  }
  type Mutation {
    "Load demo data"
    loadDemoData: String
    "If id='' then add phone, else update"
    modifyPhone(input: inputPhone): Phone
    deletePhone(id: ID): Phone
  }
  type Subscription {
    addedPhone: Phone,
    deletedPhone: Phone,
    updatedPhone: Phone
  }
`
var insertDemoData = function (model, data) {
  var bulk = model.collection.initializeOrderedBulkOp(),
    counter = 0,
    res = ''

  data.forEach(function (el) {
    const obj = {}
    obj.name = el.FIO
    obj.phone = el.Phone
    obj.address = el.Address
    bulk.insert(obj)
    counter++

    if (counter % 1000 === 0) {
      bulk.execute(function (err, result) {
        res = err
        bulk = model.collection.initializeOrderedBulkOp()
      })
    }
  })

  if (counter % 1000 !== 0) {
    bulk.execute(function (err, result) {
      res = err
    })
  }
  return (res === '' ? `загружено ${counter} записей` : res)
}

// resolvers for graphql
const resolvers = {
  Phone: {
    name: root => {
      if (root.phone === '5555') {
        // find number 5555 and hide name of person, just for example
        return '*censored*'
      } else {
        return root.name
      }
    }
  },
  Query: {
    Phones: async (_, args, { Phone }) => {
      const phones = await Phone.find({})
      // .limit(50)
      return phones
    },
    searchPhones: async (_, { searchTerm }, { Phone }) => {
      var phones = []
      if (searchTerm) {
        phones = await Phone.find({
          $text: {
            $search: searchTerm
          }
        }, {
          score: {
            $meta: 'textScore'
          }
        })
          .sort({
            score: {
              $meta: 'textScore'
            }
          })
        //  .limit(50)
        // .sort({ <field>: "desc" });
      } else phones = await Phone.find()// .limit(50)

      return phones
    }

  },
  Mutation: {
    // eslint-disable-next-line no-empty-pattern
    loadDemoData: async (_, {}, { Phone }) => {
      return await insertDemoData(Phone, data)
    },

    modifyPhone: async (_, { input }, { Phone }) => {
      if (input.id === '') {
        const res = await new Phone({
          phone: input.phone,
          name: input.name,
          address: input.address
        }).save()
          .then(data => pubsub.publish('addedPhone', { addedPhone: data }))
        return res
      } else {
        const res = await Phone.findOneAndUpdate({
          _id: input.id
        }, {
          $set: {
            phone: input.phone,
            name: input.name,
            address: input.address
          }
        }, {
          new: true
        }
        ).then(data => pubsub.publish('updatedPhone', { updatedPhone: data }))
        return res
      }
    },
    deletePhone: async (_, { id }, { Phone }) => {
      const res = await Phone.findByIdAndRemove({
        _id: id
      }).then((data) => pubsub.publish('deletedPhone', { deletedPhone: data }))
      return res
    }

  },
  Subscription: {
    addedPhone: {
      subscribe (_, args, { pubsub }) {
        return pubsub.asyncIterator(['addedPhone'])
      }
    },
    updatedPhone: {
      subscribe (_, args, { pubsub }) {
        return pubsub.asyncIterator(['updatedPhone'])
      }
    },
    deletedPhone: {
      subscribe (_, args, { pubsub }) {
        return pubsub.asyncIterator(['deletedPhone'])
      }
    }
  }
}
// create new Apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    Phone,
    pubsub
  },
  subscriptions: {
    onConnect: (connectionParams, webSocket, context) => {
      console.log('Подключился')
    },
    onDisconnect: (webSocket, context) => {
      console.log('Отключился')
    }
  }
})
// start it
const HOST = process.argv[2]
const PORT = process.argv[3]

server.listen({
  host: HOST,
  port: PORT
}).then(({
  url, subscriptionsUrl
}) => {
  console.log(`🚀   Взлетел Apollo ${url}`)
  console.log(`🚀   Подписка по адресу ${subscriptionsUrl}`)
})
// sudo ss -tulpn | grep :4000
