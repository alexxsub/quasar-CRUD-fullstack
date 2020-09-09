const { ApolloServer, gql } = require('apollo-server')
const mongoose = require('mongoose')
const data = require('../data/demoData')
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

mongoose
  .connect('mongodb://localhost:27017/PhoneBook', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('🚀   База взлетела!'))
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
    """
    Find name of person in phone list
    """
    findName(name: String): Phone
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
  input inputPhone {
    phone: String!
    name: String
    address: String
  }
  type Mutation {
    loadDemoData: String
    addPhone(phone: String!, name: String, address: String): Phone!
    addPhoneByInput(input: inputPhone): Phone! #example with input type
    deletePhoneByID(id: ID): [Phone]    
    updatePhoneByID(input: inputPhone): Phone!
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
      const phones = await Phone.find({}).limit(50)
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
          .limit(50)
        // .sort({ <field>: "desc" });
      } else phones = await Phone.find().limit(50)

      return phones
    },
    findName: async (_, { name }, { Phone }) =>
      await Phone.findOne({ name })
  },
  Mutation: {
    loadDemoData: async (_, { }, { Phone }) => {
      return await insertDemoData(Phone, data)
    },
    addPhone: async (_, { phone, name, address }, { Phone }) => {
      const newPhone = await new Phone({
        phone,
        name,
        address
      }).save()
      return newPhone
    },
    addPhoneByInput: async (_, { input }, { Phone }) => {
      await new Phone({
        phone: input.phone,
        name: input.name,
        address: input.address
      }).save()
      return await Phone.find({})
    },
    deletePhoneByID: async (_, { id }, { Phone }) => {
      const phone = await Phone.findByIdAndRemove({
        _id: id
      })
      return phone
    },
    updatePhoneByID: async (_, { input }, { Phone }) => {
      const updatedPhone = await Phone.findOneAndUpdate({
        _id: input.id
      }, {
        $set: {
          phone: input.phone,
          name: input.name,
          address: input.address
        }
      }, {
        new: true
      },
      (err, res) => {
        if (err) console.error(err)
      }
      )
      return updatedPhone
    }
  }
}
// create new Apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    Phone
  }
})
// start it
const HOST = process.argv[2]
const PORT = process.argv[3]

server.listen({
  host: HOST,
  port: PORT
}).then(({
  url
}) => {
  console.log(`🚀   Взлетел ${url}`)
})
// sudo ss -tulpn | grep :4000
