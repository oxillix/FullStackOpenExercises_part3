const mongoose = require('mongoose');

// getting rid of DeprecationWarning: Mongoose: the `strictQuery` option will be switched back to `false` by default in Mongoose 7
mongoose.set('strictQuery', false);

const savePersonToDB = (name, number) => {
  mongoose
    .connect(url)
    .then(() => {
      const person = new Person({
        name,
        number,
      });

      return person.save();
    })
    .then(() => {
      console.log(`added ${name} number ${number} to phonebook`);
      return mongoose.connection.close();
    })
    .catch((err) => console.log(err));
};

const getAllPeopleFromDB = () => {
  mongoose
    .connect(url)
    .then(() => {
      console.log('phonebook:');

      Person.find().then((result) => {
        result.forEach((person) => {
          console.log(`${person.name} ${person.number}`);
        });
        mongoose.connection.close();
      });
    })
    .catch((err) => console.log(err));
};

if (!process.argv[2]) {
  console.log(
    'Please provide the password as an argument: node mongo.js <password> <name> <number>',
  );
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://fullstack:${password}@cluster0.lemk6ue.mongodb.net/phonebook_backend?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});
const Person = mongoose.model('Person', personSchema);

if (process.argv[2] && !process.argv[3] && !process.argv[4]) {
  getAllPeopleFromDB();
} else if (process.argv[2] && process.argv[3] && process.argv[4]) {
  const name = process.argv[3];
  const number = process.argv[4];

  savePersonToDB(name, number);
}
