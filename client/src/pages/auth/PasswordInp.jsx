import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const PasswordInp = ({ onChange, name, placeholder }) => {
  const [passToggle, setPassToggle] = useState(true);

  return (
    <div className="relative ">
      <input
        className="w-full my-2 p-2 px-3  outline-none rounded-md bg-gray-50 dark:bg-stone-800 dark:text-gray-50 "
        type={passToggle ? "password" : "text"}
        autoComplete="off"
        onChange={onChange}
        name={name}
        id="password"
        placeholder={placeholder}
        required
      />

      {passToggle ? (
        <FaEyeSlash
          onClick={() => setPassToggle(!passToggle)}
          className="absolute text-xl text-stone-800 dark:text-stone-400 right-3 top-4 cursor-pointer"
        />
      ) : (
        <FaEye
          onClick={() => setPassToggle(!passToggle)}
          className="absolute text-xl text-stone-800 dark:text-stone-400 right-3 top-4 cursor-pointer"
        />
      )}
    </div>
  );
};

export default PasswordInp;
