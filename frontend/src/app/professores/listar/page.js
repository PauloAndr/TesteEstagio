"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CustomButton from "@/components/CustomButton";

export default function ListarProfessoresPage() {
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:8000/api/professores/")
      .then((res) => res.json())
      .then((data) => setProfessores(data.professores))
      .catch(() => setErro("Erro ao carregar professores"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja deletar este professor?")) return;
    const res = await fetch(`http://localhost:8000/api/professores/${id}/delete/`, {
      method: "DELETE",
    });
    if (res.ok) {
      setProfessores(professores.filter((p) => p.id !== id));
    } else {
      alert("Erro ao deletar professor");
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
       <h1 className="text-2xl font-bold mb-4 drop-shadow-[0_1px_0_rgba(0,0,0,0.8)]" >Listar Professores</h1>
      <div className="flex flex-wrap gap-2 mb-4">
        <CustomButton onClick={() => router.push("/professores")} className="w-32 h-10 text-base px-2 py-1 bg-gray-500 hover:bg-gray-600 text-white cursor-pointer">Voltar</CustomButton>
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
                  Turma
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                  Série
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {professores
                .slice() // cria uma cópia para não mutar o estado
                .sort((a, b) => a.nome_professor.localeCompare(b.nome_professor))
                .map((prof) => (
                  <tr key={prof.id}>
                    <td className="px-4 py-2 whitespace-nowrap text-black">{prof.nome_professor}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-black">{prof.matricula_professor}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-black">{prof.turma_lecionado ? prof.turma_lecionado : <span className="text-gray-400 italic">Sem turma</span>}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-black">{prof.serie_turma_lecionada ? prof.serie_turma_lecionada : <span className="text-gray-400 italic">Sem série</span>}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <Link
                        href={`/professores/${prof.id}/editar`}
                        className="text-blue-500 hover:font-bold mr-2"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(prof.id)}
                        className="text-red-500 hover:font-bold cursor-pointer"
                      >
                        Deletar
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
