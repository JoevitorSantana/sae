import Link from "next/link";
import React from "react";

function Logo() {
  return (
    <Link
      href={"/"}
      className="font-bold text-3xl bg-gradient-to-r from-green-400 to-green-400 text-transparent bg-clip-text hover:cursor-pointer"
    >
      SAE
    </Link>
  );
}

export default Logo;