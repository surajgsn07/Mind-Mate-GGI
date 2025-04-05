import React from "react";
import PasswordInp from "../PasswordInp";
import { Link } from "react-router-dom";
import Loader from "../../../components/common/Loader";

export default function UserRegister({ handleSubmit, handleChange, loading }) {
  return (
    <form className="w-full" onSubmit={(e) => handleSubmit(e)}>
      <input
        className="w-full my-2 p-2 px-3 outline-none rounded-md bg-gray-50 border-teal-900 border "
        type="text"
        onChange={handleChange}
        name="name"
        placeholder="Full Name"
        required
      />
      <br />

      <div className="flex items-center gap-4 ">
        <input
          className="w-full flex-1  my-2 p-2 px-3 outline-none rounded-md bg-gray-50 border-teal-900 border "
          type="email"
          onChange={handleChange}
          name="email"
          placeholder="Email"
          required
        />

        <div className="flex-1 ">
          <PasswordInp
            onChange={handleChange}
            placeholder={"Password"}
            name={"password"}
          />
        </div>
      </div>

      <input
        className="w-full my-2 p-2 px-3 outline-none rounded-md bg-gray-50 border-teal-900 border "
        type="tel"
        onChange={handleChange}
        name="phone"
        placeholder="Phone"
        required
      />
      <div className="flex items-center gap-4">
        <select
          className="w-full my-2 p-2 px-3 outline-none rounded-md bg-gray-50 border-teal-900 border "
          onChange={handleChange}
          name="type"
          required
        >
          <option value="">Select Type</option>
          <option value="student">Student</option>
          <option value="professional">Professional</option>
          <option value="retired">Retired</option>
          <option value="unemployed">UnEmployed</option>
        </select>

        {/* Gender Selection */}
        <select
          className="w-full my-2 p-2 px-3 outline-none rounded-md bg-gray-50 border-teal-900 border "
          onChange={handleChange}
          name="gender"
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
      {/* Date of Birth Field */}
      <label htmlFor="dob">DOB</label>
      <input
        className="w-full my-2 p-2 px-3 outline-none rounded-md bg-gray-50 border-teal-900 border "
        type="date"
        onChange={handleChange}
        name="dob"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-gradient-to-r from-emerald-700 to-stone-900 rounded-full inline-flex justify-center mx-auto w-full mt-3 max-w-[500px] hover:bg-blue-400 text-white p-1 py-2 px-3"
      >
        {loading ? <Loader /> : "Sign Up"}
      </button>

      <div className="text-center my-4 gap-1 flex items-center justify-center text-xs ">
        Already Having an Account?{" "}
        <Link to="/login" className="text-emerald-500 font-semibold">
          Login here
        </Link>
      </div>
    </form>
  );
}
