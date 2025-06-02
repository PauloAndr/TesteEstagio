"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CustomButton from "@/components/CustomButton";

export default function ProfessoresPage() {
  const [professores, setProfessores] = useState([]);
  const [showList, setShowList] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchProfessores = () => {
    if (showList) {
      setShowList(false);
      return;
    }
    setLoading(true);
    fetch("http://localhost:8000/api/professores/")
      .then((res) => res.json())
      .then((data) => {
        setProfessores(data.professores);
        setShowList(true);
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-6 p-4">
        <h1 className="text-2xl font-bold mb-4 drop-shadow-[0_1px_0_rgba(0,0,0,0.8)]" >Professores</h1>
        <div className="border-2 border-blue-400 rounded-2xl bg-white/80 shadow-md p-6 w-full max-w-md flex flex-col items-center gap-4">
          <CustomButton>
            <Link
              href="/professores/criar"
              className="block w-full h-full flex items-center justify-center"
            >
              Cadastrar Professor
            </Link>
          </CustomButton>
          <CustomButton>
            <Link
              href="/professores/listar"
              className="block w-full h-full flex items-center justify-center"
            >
              Listar Professores
            </Link>
          </CustomButton>
          {showList && (
            <ul className="mt-4 space-y-2 w-full">
              {professores.map((prof) => (
                <li
                  key={prof.id}
                  className="p-2 border rounded shadow bg-blue-50 flex flex-col md:flex-row md:items-center md:justify-between"
                >
                  <span>
                    {prof.nome_professor} | {prof.matricula_professor}
                  </span>
                  <Link
                    href={`/professores/${prof.id}/editar`}
                    className="text-blue-600 hover:underline ml-2"
                  >
                    Editar
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
