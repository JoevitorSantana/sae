import LogoUnoeste from "../assets/img/logo_unoeste.png"
import Image from "next/image";
import Link from "next/link";
import React from "react";

function Logo() {
  return (
    <Link
      href={"/"}
      className="
        flex items-center
        font-bold
        text-3xl
        bg-gradient-to-r
        from-green-900
        to-green-400
        text-transparent
        bg-clip-text
        hover:cursor-pointer"
    >
      <Image
        src={LogoUnoeste}
        alt="Logo"
        width={40}
        height={40}
      />
      SAE
    </Link>
  );
}

export default Logo;