import React from "react";
import { Link } from "react-router-dom";
function Logo({ width = "w-12 sm:w-16", className = "" }) {
  return (
    <Link to={"/"}>
      <div className={`mr-4 ${width} shrink-0 ${className}`}>
      <svg
  style={{ width: "100%" }}
  viewBox="0 0 64 64"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M46.0136986,31.1054993L25.1973,20.6973c-0.3096008-0.1532993-0.6777992-0.1387005-0.9727001,0.0438995 C23.9297009,20.9237995,23.75,21.2451,23.75,21.5918007v20.8163986c0,0.3467026,0.1797009,0.6679993,0.4745998,0.8506012 C24.3848,43.3583984,24.5674,43.4081993,24.75,43.4081993c0.1532993,0,0.3057003-0.035099,0.4473-0.1054001l20.8163986-10.4081993 c0.3388023-0.1699982,0.5527-0.5157013,0.5527-0.8945999C46.5663986,31.6210995,46.3525009,31.2754002,46.0136986,31.1054993z M25.75,40.7901001v-17.580101L43.330101,32L25.75,40.7901001z"
    stroke="#ffffff"
    strokeWidth="1.38962"
    strokeMiterlimit="10"
  ></path>
  <circle
    cx="32"
    cy="32"
    r="30"
    stroke="#ffffff"
    strokeWidth="2"
  ></circle>
  <defs>
    <linearGradient
      id="paint0_linear_53_10115"
      x1="2.23416"
      y1="20.3361"
      x2="26.860"
      y2="44.9649"
      gradientUnits="userSpaceOnUse"
    >
      <stop stopColor="#ffffff"></stop>
      <stop offset="1" stopColor="#FF4A9A"></stop>
    </linearGradient>
  </defs>
</svg>
      </div>
    </Link>
  );
}

export default Logo;
