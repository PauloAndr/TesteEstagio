"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import CustomButton from "@/components/CustomButton";

export default function EditarTurma() {
  const { id } = useParams();
  const [serie, setSerie] = useState("");
  const [turno, setTurno] = useState("");
  const [turma, setTurma] = useState("");
  const [professorId, setProfessorId] = useState("");
  const [representanteId, setRepresentanteId] = useState("");
  const [professores, setProfessores] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch(`http://localhost:8000/api/turmas/${id}/`)
      .then((res) => res.json())
      .then((data) => {
        setSerie(data.serie);
        setTurno(data.turno);
        setTurma(data.turma);
        setProfessorId(data.professor_principal?.id || "");
        setRepresentanteId(data.representante?.id || "");
      });
    fetch("http://localhost:8000/api/professores/")
      .then((res) => res.json())
      .then((data) => setProfessores(data.professores || data));
    fetch(`http://localhost:8000/api/alunos/?turma_id=${id}`)
      .then((res) => res.json())
      .then((data) => setAlunos(data.alunos || data));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    // Validação: professor não pode ser responsável por mais de uma turma
    if (professorId) {
      const turmasRes = await fetch("http://localhost:8000/api/turmas/");
      const turmasData = await turmasRes.json();
      const conflito = turmasData.turmas.find(
        (t) => t.professor_principal && t.professor_principal.id == professorId && t.id != id
      );
      if (conflito) {
        setErro("Este professor já é responsável por outra turma.");
        return;
      }
    }
    // Validação: aluno só pode ser representante da turma em que está matriculado
    if (representanteId) {
      const aluno = alunos.find((a) => String(a.id) === String(representanteId));
      // O campo aluno.turma pode ser um objeto, id ou string. Aceita se for igual ao id da turma OU se for null (caso o backend não retorne o id corretamente)
      if (aluno && aluno.turma && String(aluno.turma.id || aluno.turma) !== String(id)) {
        setErro("O aluno só pode ser representante da turma em que está matriculado.");
        return;
      }
    }
    try {
      const res = await fetch(`http://localhost:8000/api/turmas/${id}/update/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serie,
          turno,
          turma,
          professor_principal_id: professorId || null,
          representante_id: representanteId || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setErro(data.error || "Erro ao atualizar turma.");
        return;
      }
      setSucesso(true);
    } catch (err) {
      setErro("Erro ao atualizar turma.");
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center min-h-[80vh]">
      <h1 className="text-2xl font-bold mb-4 drop-shadow-[0_1px_0_rgba(0,0,0,0.8)]">Editar Turma</h1>
      <div className="border-2 border-blue-400 rounded-2xl bg-white/80 shadow-md p-6 w-full max-w-md flex flex-col items-center gap-4">
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <div className="border border-gray-300 rounded-md overflow-hidden bg-white/70">
            <div className="border-b border-gray-300 px-4 py-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Série</label>
              <input
                type="text"
                placeholder="Série"
                value={serie}
                onChange={e => setSerie(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-gray-700"
              />
            </div>
            <div className="border-b border-gray-300 px-4 py-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Turno</label>
              <input
                type="text"
                placeholder="Turno"
                value={turno}
                onChange={e => setTurno(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-gray-700"
              />
            </div>
            <div className="border-b border-gray-300 px-4 py-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Turma</label>
              <input
                type="text"
                placeholder="Turma"
                value={turma}
                onChange={e => setTurma(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-gray-700"
              />
            </div>
            <div className="border-b border-gray-300 px-4 py-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Professor Responsável</label>
              <select
                value={professorId}
                onChange={e => setProfessorId(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-gray-700"
              >
                <option value="">Sem Professor</option>
                {professores.map((prof) => (
                  <option key={prof.id} value={prof.id}>{prof.nome_professor} ({prof.matricula_professor || prof.matricula})</option>
                ))}
              </select>
            </div>
            <div className="px-4 py-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Representante</label>
              <select
                value={representanteId}
                onChange={e => setRepresentanteId(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-gray-700"
              >
                <option value="">Sem Representante</option>
                {Array.isArray(alunos) && alunos
                  .filter(aluno => {
                    // Garante que o aluno está na turma atual
                    const turmaId = aluno.turma?.id || aluno.turma;
                    // Garante que a série do aluno bate com a série da turma
                    // Considera aluno.serie OU aluno.turma.serie OU igual ao campo serie do formulário
                    const serieAluno = aluno.serie || aluno.turma?.serie;
                    return String(turmaId) === String(id) && (!serieAluno || String(serieAluno) === String(serie));
                  })
                  .map((aluno) => (
                    <option key={aluno.id} value={aluno.id}>{aluno.nome_aluno} ({aluno.matricula_aluno})</option>
                  ))}
              </select>
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
            <p className="text-gray-800 text-center mb-4">Turma atualizada com sucesso!</p>
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
