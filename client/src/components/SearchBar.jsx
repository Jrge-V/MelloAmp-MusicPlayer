import React from "react";
import { IoSearch } from "react-icons/io5";
import { actionType } from "../context/reducer";
import { useStateValue } from '../context/StateProvider';

const SearchBar = ({ value, onChange }) => {
  const [{ searchTerm }, dispatch] = useStateValue();

  const setSearchTerm = (value) => {
    dispatch({
      type: actionType.SET_SEARCH_TERM,
      searchTerm: value,
    });
  };

  return (
    <div className="w-full my-4 mx-auto flex justify-center">
      <div className="w-full p-4 md:w-2/3 bg-primary shadow-xl mt-12 rounded-md flex items-center border-2 border-gray-800">
        <IoSearch className="text-2xl text-headinColor" />
        <input
          type="text"
          value={value}
          className="w-full h-full bg-transparent text-lg text-headingColor border-none outline-none"
          placeholder="What do you want to listen to today?"
          onChange={onChange}
        />
      </div>
    </div>
  );
  

  
  
};

export default SearchBar;
