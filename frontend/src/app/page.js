"use client";

import Link from "next/link";
import Image from "next/image";
import CustomButton from "@/components/CustomButton";
import Header from "@/components/Header";
import Footer from "@/components/Footer";


export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-6 p-4">
        <h1 className="text-2xl font-bold mb-4 drop-shadow-[0_1px_0_rgba(0,0,0,0.8)]" >Principal</h1>
        <div className="border-2 border-blue-400 rounded-2xl bg-white/80 shadow-md p-6">
          <nav className="flex flex-col gap-4 items-center">
            <CustomButton>
              <Link href="/turmas" className="block w-full h-full flex items-center justify-center">Turmas</Link>
            </CustomButton>
            <CustomButton>
              <Link href="/professores" className="block w-full h-full flex items-center justify-center">Professores</Link>
            </CustomButton>
            <CustomButton>
              <Link href="/alunos" className="block w-full h-full flex items-center justify-center">Alunos</Link>
            </CustomButton>
          </nav>
        </div>
      </div>
    </>
  );
}
