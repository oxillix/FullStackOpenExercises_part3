import personService from "../services/persons";

const Contact = ({ person }) => {
  return (
    <li>
      <span>
        {person.name} {person.number}{" "}
      </span>
      <button onClick={() => { 
        if (window.confirm(`Delete ${person.name}?`)) {
          personService.deleteByID(person.id);
          window.location.reload();
        }
      }}>delete</button>
    </li>
  );
};

export default Contact;
