"use client";
import Link from "next/link";
import CustomButton from "@/components/CustomButton";

export default function AlunosPage() {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-6 p-4">
        <h1 className="text-2xl font-bold mb-4 drop-shadow-[0_1px_0_rgba(0,0,0,0.8)]">
          Alunos
        </h1>
        <div className="border-2 border-blue-400 rounded-2xl bg-white/80 shadow-md p-6 w-full max-w-md flex flex-col items-center gap-4">
          <CustomButton>
            <Link
              href="/alunos/criar"
              className="block w-full h-full flex items-center justify-center"
            >
              Matricular Aluno
            </Link>
          </CustomButton>
          <CustomButton>
            <Link
              href="/alunos/listar"
              className="block w-full h-full flex items-center justify-center"
            >
              Listar Alunos
            </Link>
          </CustomButton>
        </div>
      </div>
    </>
  );
}
