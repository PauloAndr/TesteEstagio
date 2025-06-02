"use client";
import CustomButton from "@/components/CustomButton";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CriarAlunoPage() {
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [turmaId, setTurmaId] = useState("");
  const [turmas, setTurmas] = useState([]);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:8000/api/turmas/")
      .then((res) => res.json())
      .then((data) => setTurmas(data.turmas));
  }, []);

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    setFoto(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    // Validação de matrícula duplicada
    const alunosRes = await fetch("http://localhost:8000/api/alunos/");
    const alunosData = await alunosRes.json();
    const matriculaExiste = alunosData.alunos.some(
      (a) => a.matricula_aluno === matricula
    );
    if (matriculaExiste) {
      setErro("Já existe um aluno com essa matrícula.");
      return;
    }
    const formData = new FormData();
    formData.append("nome_aluno", nome);
    formData.append("matricula_aluno", matricula);
    formData.append("turma_id", turmaId);
    if (foto) formData.append("foto_aluno", foto);
    const res = await fetch("http://localhost:8000/api/alunos/post/", {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      setSucesso(true);
      setNome("");
      setMatricula("");
      setTurmaId("");
      setFoto(null);
      setPreview(null);
    } else {
      const data = await res.json();
      setErro(data.error || "Erro ao cadastrar aluno");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center-up min-h-[80vh] mt-5">
      <h1 className="text-2xl font-bold mb-4 drop-shadow-[0_1px_0_rgba(0,0,0,0.8)]">Matricular Aluno</h1>
      <div className="border-2 border-blue-400 rounded-2xl bg-white/80 shadow-md p-6 w-full max-w-md flex flex-col items-center gap-4">
        <form onSubmit={handleSubmit} className="space-y-4 w-full" encType="multipart/form-data">
          <div className="border border-gray-300 rounded-md overflow-hidden bg-white/70">
            <div className="border-b border-gray-300 px-4 py-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Nome</label>
              <input
                placeholder="Nome"
                value={nome}
                onChange={e => setNome(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-gray-700"
              />
            </div>
            <div className="border-b border-gray-300 px-4 py-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Matrícula</label>
              <input
                placeholder="Matrícula"
                value={matricula}
                onChange={e => setMatricula(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-gray-700"
              />
            </div>
            <div className="px-4 py-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Turma</label>
              <select
                value={turmaId}
                onChange={e => setTurmaId(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-gray-700"
              >
                <option value="">Selecione a turma</option>
                {turmas.map((turma) => (
                  <option key={turma.id} value={turma.id}>
                    {turma.serie} - {turma.turma}
                  </option>
                ))}
              </select>
            </div>
            <div className="px-4 py-2">
              <label className="w-full flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-700 rounded cursor-pointer hover:bg-blue-200 transition border border-blue-300">
                <span>Escolher Foto de Perfil</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFotoChange}
                  className="hidden"
                />
              </label>
              {preview && (
                <div className="flex justify-center w-full">
                  <img src={preview} alt="Preview" className="mt-2 max-h-32 rounded shadow" />
                </div>
              )}
            </div>
          </div>
          {erro && (
            <p className="text-red-500 text-sm">{erro}</p>
          )}
          <div className="flex gap-4 justify-center w-full mt-2">
            <CustomButton type="submit" className="w-32 cursor-pointer">Matricular</CustomButton>
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
            <p className="text-gray-800 text-center mb-4">Aluno cadastrado com sucesso!</p>
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
