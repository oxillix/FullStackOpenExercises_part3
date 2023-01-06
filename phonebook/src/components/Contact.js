import personService from "../services/persons";

const Contact = ({ person }) => {
  return (
    <li>
      <span>
        {person.name} {person.number}{" "}
      </span>
      <button
        type="button"
        onClick={() => {
          if (window.confirm(`Delete ${person.name}?`)) {
            console.log(`Deleted ${person.name}`);
            personService.deleteByID(person.id).then((response) => {
              window.location.reload();
            });
          }
        }}
      >
        delete
      </button>
    </li>
  );
};

export default Contact;
