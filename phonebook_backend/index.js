require('dotenv').config();
const express = require('express');

const app = express();
const cors = require('cors');
// morgan for logging
const morgan = require('morgan');
const Person = require('./models/person');

// logging
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body'),
); // morgan for logging (tiny configuration)

// own middleware
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method);
  console.log('Path:  ', request.path);
  console.log('Body:  ', request.body);
  console.log('---');
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

// Middleware before routes
app.use(express.json());
app.use(requestLogger);
app.use(cors());
app.use(express.static('build'));

// Routes
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/info', (request, response) => {
  Person.count({}, (err, count) => {
    response.send(`
    <p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`);
  });
});

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.post('/api/persons', (request, response, next) => {
  const { body } = request;

  // check if name or number is missing
  if (!body.name && !body.number) {
    return response.status(400).json({
      error: 'name and/or number missing',
    });
  }

  // // check if name already exists
  // if (
  //   persons.filter(
  //     (person) => person.name.toLowerCase() === body.name.toLowerCase()
  //   ).length > 0
  // ) {
  //   return response.status(409).json({
  //     error: "name must be unique",
  //   });
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  const { body } = request;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      console.log(`UPDATED ${updatedPerson.name}`);
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

// middleware after routes
app.use(unknownEndpoint);
app.use(errorHandler);

// server config
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
