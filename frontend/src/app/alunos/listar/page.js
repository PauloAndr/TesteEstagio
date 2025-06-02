"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CustomButton from "@/components/CustomButton";

export default function ListarAlunosPage() {
  const [alunos, setAlunos] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alunosRes, turmasRes] = await Promise.all([
          fetch("http://localhost:8000/api/alunos/"),
          fetch("http://localhost:8000/api/turmas/")
        ]);

        const alunosData = await alunosRes.json();
        const turmasData = await turmasRes.json();

        setAlunos(alunosData.alunos);
        setTurmas(turmasData.turmas);
      } catch (err) {
        setErro("Erro ao carregar alunos ou turmas");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja deletar este aluno?")) return;
    const res = await fetch(`http://localhost:8000/api/alunos/${id}/delete/`, {
      method: "DELETE",
    });
    if (res.ok) {
      setAlunos(alunos.filter((a) => a.id !== id));
    } else {
      alert("Erro ao deletar aluno");
    }
  };

  const getTurmaInfo = (turmaId) => {
    // turmaId pode ser null, undefined ou um número
    if (!turmaId) {
      return { nome: <span className="text-gray-400 italic">Sem turma</span>, serie: <span className="text-gray-400 italic">Sem série</span> };
    }
    const turma = turmas.find((t) => t.id === turmaId || t.id === turmaId?.id);
    if (!turma) {
      return { nome: <span className="text-gray-400 italic">Sem turma</span>, serie: <span className="text-gray-400 italic">Sem série</span> };
    }
    return {
      nome: turma.turma || <span className="text-gray-400 italic">Sem turma</span>,
      serie: turma.serie || <span className="text-gray-400 italic">Sem série</span>
    };
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4 drop-shadow-[0_1px_0_rgba(0,0,0,0.8)]">
        Lista de Alunos
      </h1>
      <div className="flex flex-wrap gap-2 mb-4">
        <CustomButton
          onClick={() => router.push("/alunos")}
          className="w-32 h-10 text-base px-2 py-1 bg-gray-500 hover:bg-gray-600 text-white cursor-pointer"
        >
          Voltar
        </CustomButton>
      </div>
      {loading ? (
        <p>Carregando...</p>
      ) : erro ? (
        <p className="text-red-500">{erro}</p>
      ) : (
        <div className="overflow-x-auto w-full flex justify-center">
          <table className="min-w-[600px] max-w-2xl mx-auto divide-y divide-gray-200 border rounded-2xl shadow overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                  Nome
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                  Matrícula
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                  Série
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                  Turma
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {alunos
                .slice()
                .sort((a, b) => a.nome_aluno.localeCompare(b.nome_aluno))
                .map((aluno) => {
                  const turmaInfo = getTurmaInfo(aluno.turma);
                  return (
                    <tr key={aluno.id}>
                      <td className="px-4 py-2 whitespace-nowrap text-black flex items-center gap-2">
                        {aluno.foto_aluno ? (
                          <img
                            src={String(aluno.foto_aluno).startsWith('http') ? aluno.foto_aluno : `http://localhost:8000${aluno.foto_aluno}`}
                            alt="Foto"
                            className="w-8 h-8 rounded-full object-cover border border-gray-300"
                            onError={e => { e.target.onerror = null; e.target.src = '/file.svg'; }}
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs border border-gray-300">
                            <span>?</span>
                          </div>
                        )}
                        {aluno.nome_aluno}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-black">
                        {aluno.matricula_aluno}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-black">
                        {turmaInfo.serie}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-black">
                        {turmaInfo.nome}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <Link
                          href={`/alunos/${aluno.id}/editar`}
                          className="text-blue-500 hover:font-bold mr-2"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => handleDelete(aluno.id)}
                          className="text-red-500 hover:font-bold cursor-pointer"
                        >
                          Deletar
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
