const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
app.use(express.static("dist"));
app.use(cors());
app.use(express.json());
morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(morgan(":method :url :status :response-time :body"));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => response.json(persons));

app.get("/info", (request, response) => {
  try {
    if (!Array.isArray(persons)) {
      throw new Error("Persons data is not available or not an array");
    }

    const msg = `<p>Phonebook has info for ${
      persons.length
    } people</p><p>${new Date()}</p>`;
    response.send(msg);
  } catch (e) {
    console.error(e);
    response.status(500).send("An error occurred while fetching the info");
  }
});

app.get("/api/persons/:id", (request, response) => {
  const person = persons.find((person) => person.id === +request.params.id);

  if (person) {
    response.json(person);
  } else {
    response.statusMessage = `contact with id: ${request.params.id} not found`;
    response.status(400).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const deletee = persons.find(({ id }) => id === +request.params.id);
  if (deletee) {
    persons = persons.filter(({ id }) => id !== deletee.id);
    response.status(204).end();
  } else {
    response.statusMessage = "Contact does not exist";
    response.status(404).end();
  }
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  const validNote = () => {
    return (
      body &&
      body.name &&
      body.name.length &&
      !persons.find(({ name }) => name === body.name) &&
      body.number
    );
  };

  if (validNote()) {
    const newEntry = {
      id: Math.floor(Math.random() * 100000),
      name: body.name,
      number: body.number,
    };

    persons = persons.concat(newEntry);
    response.json(newEntry);
  } else {
    response.statusMessage = "Invalid Note, Failed to create";
    response.status(409);
    response.json({ error: "name must be unique" });
  }
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

/* 
const requestLogger = (request, response, next) => {
  console.log("method:", request.method);
  console.log("path:", request.path);
  console.log("body:", request.body);
  console.log("---");
  next();
};
app.use(requestLogger); 
*/
