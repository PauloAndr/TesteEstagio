"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";

export default function DetalhesTurmaPage() {
  const { id } = useParams();
  const [turma, setTurma] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const tableRef = useRef(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/turmas/${id}/`)
      .then((res) => res.json())
      .then((data) => setTurma(data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span>Carregando...</span>
      </div>
    );
  if (!turma) return <div>Turma não encontrada.</div>;

  return (
    <div className="container mx-auto p-4 flex flex-col items-center min-h-[80vh]">
      <div className="w-full max-w-xl bg-white bg-opacity-90 rounded-2xl shadow p-6">
        <h1 className="text-2xl text-center mb-6 drop-shadow-[0_1px_0_rgba(0,0,0,0.8)] text-black">Detalhes da Turma</h1>
        <div ref={tableRef}>
          <table className="min-w-full divide-y divide-gray-200 border rounded-2xl shadow overflow-hidden mb-6">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Série</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Turma</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Turno</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Professor</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Representante</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr>
                <td className="px-4 py-2 whitespace-nowrap text-black">{turma.serie}</td>
                <td className="px-4 py-2 whitespace-nowrap text-black">{turma.turma}</td>
                <td className="px-4 py-2 whitespace-nowrap text-black">{turma.turno}</td>
                <td className="px-4 py-2 whitespace-nowrap text-black">{turma.professor_principal?.nome_professor || <span className="text-gray-400 italic">---</span>}</td>
                <td className="px-4 py-2 whitespace-nowrap text-black">{turma.representante?.nome_aluno || <span className="text-gray-400 italic">---</span>}</td>
              </tr>
            </tbody>
          </table>
          <table className="min-w-full divide-y divide-gray-200 border rounded-2xl shadow overflow-hidden mb-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Aluno</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Matrícula</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {turma.alunos && turma.alunos.length > 0 ? (
                turma.alunos.map((aluno) => (
                  <tr key={aluno.id}>
                    <td className="px-4 py-2 whitespace-nowrap text-black">{aluno.nome_aluno}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-black">{aluno.matricula_aluno}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-2 text-gray-400 italic" colSpan={2}>Nenhum aluno cadastrado</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center gap-4 mt-6">
          <button onClick={() => router.back()} className="w-32 h-10 text-base px-2 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded-lg cursor-pointer">Voltar</button>
        </div>
      </div>
    </div>
  );
}
