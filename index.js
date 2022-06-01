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

let persons = [
    {
      "id": 1,
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": 2,
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": 3,
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": 4,
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    },
    {
      "id": 5,
      "name": "test",
      "number": "12345"
    }

]

app.get('/', (request, response) => {
  response.send('<h1> hello </h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

const generateId = () => {
  var id = 1
  while (persons.find(p => p.id === id) != undefined) {
    id = Math.floor(Math.random() * 100000)
  }
  return id
}
app.post('/api/persons', (request, response) => {
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number is missing'
    })
  }

  if (persons.find(person => person.name === body.name) != undefined) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }
    
  const person = {
    name : body.name,
    number : body.number,
    id : generateId()
  }
  persons = persons.concat(person)
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)
  response.status(204).end()
})

app.get('/info', (request, response) => {
  response.send(`
    <p> Phonebook has info for ${persons.length} people</p>
    <p> ${ new Date() }</p>
    `)
        
})
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

