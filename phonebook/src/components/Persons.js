import Contact from "./Contact";

const Persons = ({ persons, searchInput }) => {
  return (
    <div>
      <h2>Numbers</h2>
      <ul>
        {persons
          .filter((person) => person.name.toLowerCase().includes(searchInput))
          .map((person) => (
            <Contact key={person.id} person={person} />
          ))}
      </ul>
    </div>
  );
};

export default Persons;
