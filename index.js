require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const Person = require("./models/person");
const app = express();

// app.use(express.static("dist"));
app.use(cors());
app.use(express.json());
morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(morgan("MORGAN :method :url :status :response-time :body"));

app.get("/api/persons", async (request, response) => {
  try {
    const persons = await Person.find({});
    response.json(persons);
  } catch (error) {
    console.log("CAUGHT HERE 🍆", error);
  }
});

app.get("/info", async (request, response) => {
  try {
    const persons = await Person.find({});
    const msg = `<p>Phonebook has info for ${
      persons.length
    } people</p><p>${new Date()}</p>`;
    response.send(msg);
  } catch (e) {
    console.error(e);
    response.status(500).send("An error occurred while fetching the info");
  }
});

app.get("/api/persons/:id", async (request, response) => {
  const id = request.params.id;

  try {
    const person = await Person.findById(id);
    if (person) {
      response.json(person);
      return;
    }
    // response.statusMessage = "Contact was not found";
    response.status(400).end();
  } catch (e) {
    console.error(
      `something went awry while attempting to fetch contact information for id: ${id}\n\nREASON: ${e.reason}`
    );
    response.status(500).end();
  }
});

app.delete("/api/persons/:id", async (request, response) => {
  const id = request.params.id;
  console.log("made it to backend");
  try {
    const deleted = await Person.findByIdAndDelete(id);
    if (deleted) {
      response.status(204).json(deleted);
      return;
    }
    // response.statusMessage = "Contact was not found and therefore not deleted";
    response.status(400).end();
  } catch (err) {
    console.error(
      `Failed to delete contact with id ${id}\n\nREASON: ${err.reason}`
    );
    response.status(500).end();
  }
});
app.post("/api/persons", async (request, response) => {
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
    console.log(
      "successfully saved a new contact in the atlas cluster people collection"
    );
    return response.json(person);
  } catch (error) {
    console.error("Error saving the person:", error);
    return response
      .status(500)
      .json({ error: "An error occurred while saving the contact" });
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
