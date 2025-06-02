"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CustomButton from "@/components/CustomButton";

export default function TurmasPage() {
  const [turmas, setTurmas] = useState([]);
  const [showList, setShowList] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:8000/api/turmas/")
      .then((res) => res.json())
      .then((data) => setTurmas(data.turmas));
  }, []);

  const handleListar = () => setShowList((prev) => !prev);

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-4">
        <h1 className="text-2xl font-bold mb-4 drop-shadow-[0_1px_0_rgba(0,0,0,0.8)]" >Turmas</h1>
      <div className="border-2 border-blue-400 rounded-2xl bg-white/80 shadow-md p-6 w-full max-w-md flex flex-col items-center gap-4">
        <CustomButton>
          <Link
            href="/turmas/criar"
            className="block w-full h-full flex items-center justify-center"
          >
            Cadastrar Turma
          </Link>
        </CustomButton>
        <CustomButton>
          <Link
            href="/turmas/listar"
            className="block w-full h-full flex items-center justify-center"
          >
            Listar Turmas
          </Link>
        </CustomButton>
      </div>
    </div>
  );
}
