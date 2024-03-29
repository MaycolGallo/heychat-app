import { Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <main className="h-screen bg-landing flex items-center justify-center">
        <section className="flex items-center justify-center flex-wrap-reverse md:flex-row">
          <div className="relative">
            <div
              className="absolute animate-pulse duration-[10s] -inset-3 blur-[72px]"
              style={{
                backgroundImage:
                  "radial-gradient(at 61% 4%, hsla(247,84%,68%,1) 0px, transparent 50%),radial-gradient(at 33% 95%, hsla(284,67%,62%,1) 0px, transparent 50%)",
              }}
            ></div>
            <Image
              className="relative"
              src={"/hey.png"}
              width={320}
              height={320}
              alt="logo"
            />
          </div>
          <div className="flex mx-3 flex-col gap-4">
            <h1 className="font-bold tracking-tight text-7xl space-x-1.5">
              <span className="bg-clip-text text-transparent bg-gradient-to-l from-pink-500 to-purple-700">
                Hey
              </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-l from-blue-500 to-teal-700">
                Chat!
              </span>
            </h1>
            <p className="text-white text-center">Conecta con amigos.</p>
            <Link
              className="rounded-lg w-full duration-150 ease-in inline-flex items-center justify-center bg-gradient-to-l hover:from-purple-700 hover:to-blue-500 from-blue-500 hover:scale-105 transition-all to-purple-700 px-5 py-3 text-white"
              href="/chats"
            >
              Comenzar a chatear
            </Link>
          </div>
        </section>

        <p
          className="absolute bottom-0 mb-20 text-center sm:text-left"
          style={{ textWrap: "balance" } as any}
        >
          Copyright © {new Date().getFullYear()}{" "}
        </p>
        {/* <p className="absolute flex gap-2 items-center bottom-0 pb-4">
        <span className="flex flex-col py-2">Fernando Hugo <span>Granados Prudencio</span></span> &bull;
          <a
            className="flex items-center text-sky-500 hover:underline "
            href="https://api.whatsapp.com/send/?phone=51920874994"
            target="_blank"
          >
            <Phone className="w-4 h-4 mr-1" />
            Contacto
          </a>
        </p> */}
      </main>
    </>
  );
}
