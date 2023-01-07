const mongoose = require("mongoose");
//getting rid of DeprecationWarning: Mongoose: the `strictQuery` option will be switched back to `false` by default in Mongoose 7.
mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;
console.log("connecting to", url);

// const savePersonToDB = (name, number) => {
//   mongoose
//     .connect(url)
//     .then((result) => {
//       const person = new Person({
//         name: name,
//         number: number,
//       });

//       return person.save();
//     })
//     .then(() => {
//       console.log(`added ${name} number ${number} to phonebook`);
//       return mongoose.connection.close();
//     })
//     .catch((err) => console.log(err));
// };

// const getAllPeopleFromDB = () => {
//   mongoose
//     .connect(url)
//     .then((result) => {
//       console.log("phonebook:");

//       Person.find().then((result) => {
//         result.forEach((person) => {
//           console.log(`${person.name} ${person.number}`);
//         });
//         mongoose.connection.close();
//       });
//     })
//     .catch((err) => console.log(err));
// };

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
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
