import React from "react";

const Header = () => (
  <header className="flex justify-between items-center mb-8">
    <div className="text-white text-2xl font-bold">S</div>
    <div className="flex space-x-4">
      <span className="text-white">M</span>
      <span className="text-white">O</span>
      <span className="text-white">n</span>
    </div>
  </header>
);

const ProjectList = () => (
  <div className="">
    <h2 className="text-white text-xl mb-4 block text-[1.5em] my-[0.83em] mx-0 font-bold isolate">
      Projects
    </h2>
    <ul className="space-y-2">
      {[
        "Domposer",
        "Bay.js",
        "Cookiemunch",
        "Screen time converter",
        "inline svg",
      ].map((project) => (
        <li key={project} className="cursor-pointer underline">
          <a href="#" className="text-white ">
            {project}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const Portfolio = () => {
  return (
    <div className="w-[100%] h-[100vh] bg-[#5B5C60] flex justify-center items-center">
      {/* <div className="bg-black text-white p-8 rounded-[50px] max-w-4xl mx-auto my-8"> */}
      <div
  className="bg-black w-full border-2 border-[#7c7d81] rounded-2xl shadow-[var(--sX)_var(--sY)_50px_0px_rgba(18,18,19,0.1)]"
//   style={{
//     background: 'radial-gradient(circle 40vmax at var(--cX) var(--cY), rgb(26, 26, 29) 0%, rgb(10, 10, 10) 100%)',
//   }}
>
        {/* <div className='bg-black text-white '> */}
        <Header />
        <main className="flex gap-[100px]">
          <div className="w-[60%]">
            <h1 className="text-6xl font-light mb-8">Welcome.</h1>
            <p className="mb-4">
              My name is Shyamanand Pandit, I'm a front-end developer based in
              Delhi, India. I have 2+ years of experience, I specialize in
              building dynamic and interactive web applications using React,
              Redux, and associated tools. My skillset also includes proficiency
              in Javascript, HTML, and CSS.
            </p>
            <p>
              I also have hands-on experience in building scalable web
              applications with Node.js, Express, and MongoDB.
            </p>
          </div>

          <ProjectList />
        </main>
        <footer className="mt-16 text-sm text-gray-500">
          © 2024 Shyamanand Pandit
        </footer>
      </div>
    </div>
  );
};

export default Portfolio;
