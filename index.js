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

app.get("/", async (request, response, next) => {
  response.send("<p>Hello world</p>");
});

app.get("/info", async (request, response, next) => {
  try {
    const persons = await Person.find({});
    const msg = `<p>Phonebook has info for ${
      persons.length
    } people</p><p>${new Date()}</p>`;
    console.log(msg);
    console.log("/INFO");
    response.send(msg).end();
  } catch (e) {
    console.log("something broke");
    next(e);
  }
});

app.get("/api/persons", async (request, response, next) => {
  try {
    const persons = await Person.find({});
    response.json(persons);
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
  try {
    const { name, number } = request.body;
    const validatedCandidate = new Person({ name, number });
    const person = await validatedCandidate.save();
    return response.json(person);
  } catch (e) {
    next(e);
  }
});

app.put("/api/persons/:id", async (request, response, next) => {
  try {
    const { name, number } = request.body;
    const updatedContact = await Person.findByIdAndUpdate(
      request.params.id,
      { name, number },
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );
    response.json(updatedContact);
  } catch (e) {
    next(e);
  }
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(409).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

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
