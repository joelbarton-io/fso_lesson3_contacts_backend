require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const Person = require("./models/person");
const app = express();

app.use(express.static("dist"));
app.use(express.json());
app.use(cors());
morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(morgan("MORGAN :method :url :status :response-time :body"));

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler);

app.get("/api/persons", async (request, response, next) => {
  try {
    const persons = await Person.find({});
    response.json(persons);
  } catch (e) {
    next(e);
  }
});

app.get("/info", async (request, response, next) => {
  try {
    const persons = await Person.find({});
    const msg = `<p>Phonebook has info for ${
      persons.length
    } people</p><p>${new Date()}</p>`;
    response.send(msg);
  } catch (e) {
    next(e);
  }
});

app.get("/api/persons/:id", async (request, response, next) => {
  const id = request.params.id;
  try {
    const person = await Person.findById(id);
    if (person) {
      return response.json(person);
    }
    response.status(404).end();
  } catch (e) {
    next(e);
  }
});

app.delete("/api/persons/:id", async (request, response, next) => {
  const id = request.params.id;
  try {
    const deleted = await Person.findByIdAndDelete(id);
    if (deleted) {
      return response.status(204).json(deleted);
    }
    response.status(400).end();
  } catch (e) {
    next(e);
  }
});

app.post("/api/persons", async (request, response, next) => {
  const candidate = request.body;

  try {
    const isValidInput = (person) => {
      return Boolean(
        person &&
          "name" in person &&
          "number" in person &&
          person.name.length &&
          person.number.length
      );
    };

    const hasUniqueName = async (name) => {
      const matchedPeople = await Person.find({ name: name });
      return matchedPeople.length === 0;
    };

    if (!isValidInput(candidate)) {
      return response.status(400).json({ error: "Invalid input" });
    }

    if (!(await hasUniqueName(candidate.name))) {
      return response.status(409).json({ error: "Name must be unique" });
    }

    const validatedCandidate = new Person(candidate);
    const person = await validatedCandidate.save();
    return response.json(person);
  } catch (e) {
    next(e);
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

/* 

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

Person.insertMany(persons)
  .then((result) => {
    console.log(result);
  })
  .catch((reason) => console.log(reason));


const requestLogger = (request, response, next) => {
  console.log("method:", request.method);
  console.log("path:", request.path);
  console.log("body:", request.body);
  console.log("---");
  next();
};
app.use(requestLogger); 
*/
