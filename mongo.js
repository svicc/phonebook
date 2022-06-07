const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://bp:${password}@cluster0.ahtcp.mongodb.net/phonebookApp?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model('Person', personSchema)
if (process.argv.length == 3) {
  mongoose
    .connect(url)
    .then((result) => {
      console.log('phonebook')

      Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person.name, person.number)
        })
        return mongoose.connection.close()
      })

    })
    .catch((err) => console.log(err))
}

if (process.argv.length == 5) {
  const p_name = process.argv[3]
  const p_number = process.argv[4]
  mongoose
    .connect(url)
    .then((result) => {
      console.log('connected')

      const person = new Person({
        name: p_name,
        number: p_number,
      })

      return person.save()
    })
    .then(() => {
      console.log(`added ${p_name} number ${p_number} to phonebook`)
      return mongoose.connection.close()
    })
    .catch((err) => console.log(err))
}
