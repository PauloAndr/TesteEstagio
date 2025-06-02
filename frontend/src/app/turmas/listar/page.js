"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CustomButton from "@/components/CustomButton";

export default function ListarTurmasPage() {
  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:8000/api/turmas/")
      .then((res) => res.json())
      .then((data) => setTurmas(data.turmas))
      .catch(() => setErro("Erro ao carregar turmas"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja deletar esta turma?")) return;
    const res = await fetch(`http://localhost:8000/api/turmas/${id}/delete/`, {
      method: "DELETE",
    });
    if (res.ok) {
      setTurmas(turmas.filter((t) => t.id !== id));
    } else {
      alert("Erro ao deletar turma");
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4 drop-shadow-[0_1px_0_rgba(0,0,0,0.8)]">Listar Turmas</h1>
      <div className="flex flex-wrap gap-2 mb-4">
        <CustomButton onClick={() => router.push("/turmas")} className="w-32 h-10 text-base px-2 py-1 bg-gray-500 hover:bg-gray-600 text-white cursor-pointer">Voltar</CustomButton>
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
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Série</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Turma</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Professor</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Representante</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {turmas
                .slice()
                .sort((a, b) => {
                  if (a.serie === b.serie) return a.turma.localeCompare(b.turma);
                  return a.serie.localeCompare(b.serie);
                })
                .map((turma) => (
                  <tr key={turma.id}>
                    <td className="px-4 py-2 whitespace-nowrap text-black">{turma.serie}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-black">{turma.turma}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-black">{turma.professor_principal && turma.professor_principal.nome_professor ? turma.professor_principal.nome_professor : <span className="text-gray-400 italic">a definir</span>}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-black">{turma.representante && turma.representante.nome_aluno ? turma.representante.nome_aluno : <span className="text-gray-400 italic">a definir</span>}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <Link href={`/turmas/${turma.id}/detalhes`} className="text-blue-500 hover:font-bold mr-2">Detalhes</Link>
                      <Link href={`/turmas/${turma.id}/editar`} className="text-blue-500 hover:font-bold mr-2">Editar</Link>
                      <a href={`http://localhost:8000/api/exportar_excel/${turma.id}/`} target="_blank" className="text-green-600 hover:font-bold mr-2">Exportar XLSX</a>
                      <button onClick={() => handleDelete(turma.id)} className="text-red-500 hover:font-bold cursor-pointer">Deletar</button>
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
