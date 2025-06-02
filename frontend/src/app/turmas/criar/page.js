"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CustomButton from "@/components/CustomButton";

export default function CriarTurmaPage() {
  const [serie, setSerie] = useState("");
  const [turno, setTurno] = useState("Manhã");
  const [turma, setTurma] = useState("");
  const [professorId, setProfessorId] = useState("");
  const [professores, setProfessores] = useState([]);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:8000/api/professores/")
      .then((res) => res.json())
      .then((data) => {
        // Professores sem turma e sem série
        const livres = data.professores.filter(
          (p) => !p.turma_lecionado && !p.serie_turma_lecionada
        );
        setProfessores(livres);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    // Validação: professor não pode ser responsável por mais de uma turma ou série
    if (professorId) {
      const turmasRes = await fetch("http://localhost:8000/api/turmas/");
      const turmasData = await turmasRes.json();
      const professorJaResponsavel = turmasData.turmas.some(
        (t) => t.professor_principal && String(t.professor_principal.id) === String(professorId)
      );
      if (professorJaResponsavel) {
        setErro("Este professor já é responsável por outra turma ou série.");
        return;
      }
      // Validação: não pode existir turma com mesma série e nome
      const turmaSerieExiste = turmasData.turmas.some(
        (t) => t.serie === serie && t.turma === turma
      );
      if (turmaSerieExiste) {
        setErro("Já existe uma turma com essa série e nome de turma.");
        return;
      }
      // Validação: professor não pode ser responsável por mais de uma série
      const professorJaResponsavelSerie = turmasData.turmas.some(
        (t) => t.professor_principal && String(t.professor_principal.id) === String(professorId) && t.serie === serie
      );
      if (professorJaResponsavelSerie) {
        setErro("Este professor já é responsável por outra turma nesta série.");
        return;
      }
    }
    const res = await fetch("http://localhost:8000/api/turmas/post/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serie, turno, turma, professor_principal_id: professorId }),
    });
    if (res.ok) {
      setSucesso(true);
      setSerie("");
      setTurno("Manhã");
      setTurma("");
      setProfessorId("");
    } else {
      const data = await res.json();
      setErro(data.error || "Erro ao criar turma");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center-up min-h-[80vh] mt-5">
      <h1 className="text-2xl font-bold mb-4 drop-shadow-[0_1px_0_rgba(0,0,0,0.8)]">Cadastrar Turma</h1>
      <div className="border-2 border-blue-400 rounded-2xl bg-white/80 shadow-md p-6 w-full max-w-md flex flex-col items-center gap-4">
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <div className="border border-gray-300 rounded-md overflow-hidden bg-white/70">
            <div className="border-b border-gray-300 px-4 py-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Série</label>
              <input
                placeholder="Série"
                value={serie}
                onChange={e => setSerie(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-gray-700"
              />
            </div>
            <div className="border-b border-gray-300 px-4 py-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Turno</label>
              <select value={turno} onChange={e => setTurno(e.target.value)} className="w-full bg-transparent focus:outline-none text-gray-700">
                <option value="Manhã">Manhã</option>
                <option value="Tarde">Tarde</option>
                <option value="Noite">Noite</option>
              </select>
            </div>
            <div className="border-b border-gray-300 px-4 py-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Turma</label>
              <input
                placeholder="Turma"
                value={turma}
                onChange={e => setTurma(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-gray-700"
              />
            </div>
            <div className="px-4 py-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Professor Responsável</label>
              <select value={professorId} onChange={e => setProfessorId(e.target.value)} className="w-full bg-transparent focus:outline-none text-gray-700">
                <option value="">Selecione o Professor Responsável</option>
                {professores.map((prof) => (
                  <option key={prof.id} value={prof.id}>
                    {prof.nome_professor} ({prof.matricula_professor})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-4 justify-center w-full mt-2">
            <CustomButton type="submit" className="w-32 cursor-pointer">Criar</CustomButton>
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
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded shadow"
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
            <p className="text-gray-800 text-center mb-4">Turma cadastrada com sucesso!</p>
            <button
              onClick={() => setSucesso(false)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded shadow"
            >
              Confirmar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
