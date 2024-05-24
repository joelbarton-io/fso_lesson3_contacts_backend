const mongoose = require("mongoose");
const uri = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);
console.log("initiating connection with atlas cluster...");

mongoose
  .connect(uri)
  .then((result) => {
    console.log("successfully connected to mongo db");
  })
  .catch((reason) => {
    console.log(reason);
    console.log(`failed to connect to mongo db REASON: ${reason.errmsg}`);
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
