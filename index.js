require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
morgan.token('person_data', function(req, res) {return JSON.stringify(req.body) })
app.use(express.json())
app.use(morgan('tiny'))
app.use(morgan(':person_data', {
  skip: function (req, res) { return req.method !== 'POST'}
}))

const cors = require('cors')
app.use(cors())

app.use(express.static('build'))

const Person = require('./models/person')


app.get('/', (request, response) => {
  response.send('<h1> hello </h1>')
})

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(p=> {
    response.json(p)
  })
  .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})


app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number,
  }
  Person.findByIdAndUpdate(request.params.id, person, {new:true})
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
  .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number is missing'
    })
  }
  
  const person = new Person({
    name : body.name,
    number : body.number,
  })
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/info', (request, response) => {
  
  Person.find({}).then(persons=> {
    response.send(`
      <p> Phonebook has info for ${persons.length} people</p>
      <p> ${ new Date() }</p>
      `)
  })
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({error: 'malformatted id'})
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

