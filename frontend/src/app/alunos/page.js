"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import CustomButton from "@/components/CustomButton";

export default function AlunosPage() {
  const [alunos, setAlunos] = useState([]);
  const [showList, setShowList] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchAlunos = () => {
    if (showList) {
      setShowList(false);
      return;
    }
    setLoading(true);
    fetch("http://localhost:8000/api/alunos/")
      .then((res) => res.json())
      .then((data) => {
        setAlunos(data.alunos);
        setShowList(true);
      })
      .finally(() => setLoading(false));
  };

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
            <button
              onClick={fetchAlunos}
              className="w-full h-full flex items-center justify-center"
              disabled={loading}
            >
              {loading
                ? "Carregando..."
                : showList
                ? "Ocultar Lista"
                : "Listar Alunos"}
            </button>
          </CustomButton>
          {showList && (
            <ul className="mt-4 space-y-2 w-full">
              {alunos.map((aluno) => (
                <li
                  key={aluno.id}
                  className="p-2 border rounded shadow bg-blue-50 flex flex-col md:flex-row md:items-center md:justify-between"
                >
                  <span>
                    {aluno.nome_aluno} | {aluno.matricula_aluno} | Turma:
                    {aluno.turma}
                  </span>
                  <Link
                    href={`/alunos/${aluno.id}/editar`}
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
