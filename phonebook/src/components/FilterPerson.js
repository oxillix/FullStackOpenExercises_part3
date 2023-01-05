const FilterPerson = ({ searchInput, handlesearchInput }) => {
  return (
    <div>
      filter shown with{" "}
      <input value={searchInput} onChange={handlesearchInput} />
    </div>
  );
};

export default FilterPerson;
