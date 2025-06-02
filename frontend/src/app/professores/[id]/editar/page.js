"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import CustomButton from "@/components/CustomButton";

export default function EditarProfessor() {
  const { id } = useParams();
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch(`http://localhost:8000/api/professores/${id}/`)
      .then((res) => res.json())
      .then((data) => {
        setNome(data.nome_professor);
        setMatricula(data.matricula_professor);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    // Validação de matrícula duplicada
    const profRes = await fetch("http://localhost:8000/api/professores/");
    const profData = await profRes.json();
    const matriculaExiste = profData.professores.some(
      (prof) => prof.matricula_professor === matricula && prof.id !== Number(id)
    );
    if (matriculaExiste) {
      setErro("Já existe um professor com essa matrícula.");
      return;
    }
    // Validação de dois professores na mesma turma e série
    const turmasRes = await fetch("http://localhost:8000/api/turmas/");
    const turmasData = await turmasRes.json();
    const turmaConflito = turmasData.turmas.find(
      (turma) => turma.professor_principal && turma.professor_principal.id !== Number(id) && turma.turma && turma.serie &&
        profData.professores.find(p => p.id === Number(id) && p.turma_lecionado === turma.turma && p.serie_turma_lecionada === turma.serie)
    );
    if (turmaConflito) {
      setErro("Já existe um professor responsável para essa turma e série.");
      return;
    }
    const body = {
      nome_professor: nome,
      matricula_professor: matricula
    };
    const res = await fetch(`http://localhost:8000/api/professores/${id}/update/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setSucesso(true);
    } else {
      const data = await res.json();
      setErro(data.error || "Erro ao atualizar professor");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center-up min-h-[80vh] mt-5">
      <h1 className="text-2xl font-bold mb-4 drop-shadow-[0_1px_0_rgba(0,0,0,0.8)]" >Editar Professor</h1>
      <div className="border-2 border-blue-400 rounded-2xl bg-white/80 shadow-md p-6 w-full max-w-md flex flex-col items-center gap-4">
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <div className="border border-gray-300 rounded-md overflow-hidden bg-white/70">
            <div className="border-b border-gray-300 px-4 py-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Nome
              </label>
              <input
                type="text"
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-gray-700"
              />
            </div>
            <div className="px-4 py-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Matrícula
              </label>
              <input
                type="text"
                placeholder="Matrícula"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-gray-700"
              />
            </div>
          </div>
          {erro && (
            <p className="text-red-500 text-sm">{erro}</p>
          )}
          <div className="flex gap-4 justify-center w-full mt-2">
            <CustomButton type="submit" className="w-32 cursor-pointer">Salvar</CustomButton>
            <CustomButton type="button" className="w-32 bg-gray-500 hover:bg-gray-600 cursor-pointer" onClick={() => router.back()}>
              Voltar
            </CustomButton>
          </div>
        </form>
      </div>
      {erro && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="relative bg-white rounded-xl shadow-lg p-6 max-w-xs w-full flex flex-col items-center">
            <span className="text-red-600 font-bold text-lg mb-2">Erro</span>
            <p className="text-gray-800 text-center mb-4">{erro}</p>
            <button
              onClick={() => setErro("")}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded shadow cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
      {sucesso && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="relative bg-white rounded-xl shadow-lg p-6 max-w-xs w-full flex flex-col items-center">
            <span className="text-green-600 font-bold text-lg mb-2">Sucesso!</span>
            <p className="text-gray-800 text-center mb-4">Professor atualizado com sucesso!</p>
            <button
              onClick={() => setSucesso(false)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded shadow cursor-pointer"
            >
              Confirmar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
