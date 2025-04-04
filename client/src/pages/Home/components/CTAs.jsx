import React from 'react';

const CTAs = () => {
  return (
    <section className="">
      <div className="gap-8 items-center py-8 px-4 mx-auto max-w-screen-xl xl:gap-16 md:grid md:grid-cols-2 sm:py-16 lg:px-6">
        <img
          className="w-full bg-cover h-82"
          src="https://leadschool.in/wp-content/uploads/2023/11/AI-in-education-vector-1.png"
          alt="education dashboard"
          
        />
        <div className="mt-4 md:mt-0">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold">
            Say goodbye to outdated learning methods and disconnected classrooms!
          </h2>
          <p className="mb-6 font-light text-gray-600 md:text-lg">
            Our AI-powered education platform transforms the way students learn, offering personalized progress tracking, interactive lessons, and real-time collaboration tools. Elevate learning experiences with smart technology!
          </p>
          <a
            href="#"
            className="inline-flex items-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900"
          >
            Get started
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTAs;
