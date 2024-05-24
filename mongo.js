const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URI);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

// let persons = [
//   {
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
// ];

// if (process.argv.length === 3) {
//   Person.insertMany(persons).then((result) => {
//     console.log("added persons to phonebook");
//     mongoose.connection.close();
//   });
// }

if (process.argv.length === 3) {
  console.log("printing phone book...");
  Person.find({}).then((list) => {
    list.forEach((person) => console.log(`${person.name} ${person.number}`));
    mongoose.connection.close();
  });
} else {
  console.log("create new contact...");
  const contactName = process.argv[3];
  const contactNumber = process.argv[4];

  const person = new Person({
    name: contactName,
    number: contactNumber,
  });

  person.save().then((result) => {
    console.log(`added ${result.name} - # ${result.number} to phonebook`);
    mongoose.connection.close();
  });
}
/* initial 
const url = `mongodb+srv://FSO_barton:${password}@cluster0.ymntqea.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name: contactName,
  number: contactNumber,
});

person.save().then((result) => {
  console.log(`added ${result.name} - # ${result.number} to phonebook`);
  mongoose.connection.close();
});
 */
