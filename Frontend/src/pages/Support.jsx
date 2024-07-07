import React from "react";
import { icons } from "../assets/icons";
import { GuestComponent } from "../components";

function Support() {
  return (
    <>
      <section className="w-full flex justify-center pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
        <div className="flex relative top-20 justify-center p-4">
          <div className="w-full max-w-fit text-center">
            <p className="mb-3 w-full">
              <span className="inline-flex w-36 h-36 rounded-full bg-[#c7f2ce] p-2 text-[#51AF30]">
                {icons.support}
              </span>
            </p>
            <h5 className="mt-6 mb-7 text-2xl font-semibold">
                Connect with me here effortlessly
            </h5>
            <ul className="text-center flex flex-col items-center space-y-2">
            <li className="flex items-center">
                <span className="w-9 h-9 rounded-full mr-4">{icons.link}</span>
                <div className="h-full">
                  <h2 className="text-lg font-bold my-0">LikedIn</h2>
                  <a
                    href="http://www.linkedin.com/in/akshita-agrawal-847411232"
                    target="_blank"
                    className="text-blue-500 text-sm hover:text-blue-400 "
                  >
                    akshita
                  </a>
                </div>
              </li>
              <li className="flex items-center">
                <span className="w-9 h-9 rounded-full mr-4">{icons.link}</span>
                <div className="h-full">
                  <h2 className="text-lg font-bold my-0">GitHub</h2>
                  <a
                    href="https://github.com/Akshi44"
                    target="_blank"
                    className="text-blue-500 text-sm hover:text-blue-400 "
                  >
                    Akshi44
                  </a>
                </div>
              </li>
              <li className="flex items-center">
                <span className="w-9 h-9 rounded-full mr-4">{icons.link}</span>
                <div className="h-full">
                  <h2 className="text-lg font-bold my-0">Twitter</h2>
                  <a
                    href="https://x.com/Akshita_44"
                    target="_blank"
                    className="text-blue-500 text-sm hover:text-blue-400 "
                  >
                    Akshita_44
                  </a>
                </div>
              </li>

            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

export default Support;
