require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
//morgan for logging
const morgan = require("morgan");
const Person = require("./models/person");

// Middleware before routes
app.use(cors());
app.use(express.static("build"));
app.use(express.json());

//logging
morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
); // morgan for logging (tiny configuration)

// own middleware
const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// helper functions
const generateId = () => {
  let min = 5;
  let max = 10000;
  return Math.floor(Math.random() * (max - min) + min);
};

// Routes
app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/info", (request, response) => {
  response.send(`
          <p> Phonebook has info for ${
            persons.length
          } people</p><p>${new Date()}</p>`);
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((notes) => {
    response.json(notes);
  });
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  console.log(persons);
  persons = persons.filter((person) => person.id !== id);
  console.log(persons);
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  // check if name or number is missing
  if (!body.name && !body.number) {
    return response.status(400).json({
      error: "name and/or number missing",
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

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

// middleware after routes
app.use(requestLogger);
app.use(unknownEndpoint);

// server config
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
