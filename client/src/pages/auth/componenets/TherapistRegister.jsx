import React from "react";
import PasswordInp from "../PasswordInp";
import { Link } from "react-router-dom";
import Loader from "../../../components/common/Loader";

export default function TherapistRegister({
  handleSubmit,
  handleChange,
  loading,
}) {
  return (
    <form className="w-full" onSubmit={(e) => handleSubmit(e)}>
      <input
        className="w-full my-2 p-2 px-3 outline-none rounded-md bg-gray-50"
        type="text"
        onChange={handleChange}
        name="name"
        placeholder="Full Name"
        required
      />
      <br />

      <div className="flex items-center gap-4">
        <input
          className="w-full flex-1 my-2 p-2 px-3 outline-none rounded-md bg-gray-50"
          type="email"
          onChange={handleChange}
          name="email"
          placeholder="Email"
          required
        />

        <div className="flex-1">
          <PasswordInp
            onChange={handleChange}
            placeholder={"Password"}
            name={"password"}
          />
        </div>
      </div>

      <input
        className="w-full my-2 p-2 px-3 outline-none rounded-md bg-gray-50"
        type="tel"
        onChange={handleChange}
        name="phone"
        placeholder="Phone"
        required
      />

      <div className="flex items-center gap-4">
        <select
          className="w-full my-2 p-2 px-3 outline-none rounded-md bg-gray-50"
          onChange={handleChange}
          name="gender"
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {/* Experience */}
        <input
          className="w-full my-2 p-2 px-3 outline-none rounded-md bg-gray-50"
          type="number"
          onChange={handleChange}
          name="experience"
          placeholder="Years of Experience"
          required
        />
      </div>

      <div className="flex items-center gap-4">
        {/* Virtual Consultation Fee */}
        <input
          className="w-full my-2 p-2 px-3 outline-none rounded-md bg-gray-50"
          type="number"
          onChange={handleChange}
          name="virtualFee"
          placeholder="Virtual Consultation Fee ($)"
          required
        />

        {/* Specialization */}
        <input
          className="w-full my-2 p-2 px-3 outline-none rounded-md bg-gray-50"
          type="text"
          onChange={handleChange}
          name="specialization"
          placeholder="Specialization (e.g., Anxiety, Depression)"
          required
        />
      </div>

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
