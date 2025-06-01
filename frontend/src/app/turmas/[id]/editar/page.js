"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditarTurma() {
  const { id } = useParams();
  const [serie, setSerie] = useState("");
  const [turno, setTurno] = useState("");
  const [turma, setTurma] = useState("");
  const [professorId, setProfessorId] = useState("");
  const [representanteId, setRepresentanteId] = useState("");
  const [professores, setProfessores] = useState([]);
  const [alunos, setAlunos] = useState([]);
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
    await fetch(`http://localhost:8000/api/turmas/${id}/update/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serie, turno, turma, professor_principal_id: professorId, representante_id: representanteId }),
    });
    router.push("/turmas");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Série" value={serie} onChange={e => setSerie(e.target.value)} />
      <input placeholder="Turno" value={turno} onChange={e => setTurno(e.target.value)} />
      <input placeholder="Turma" value={turma} onChange={e => setTurma(e.target.value)} />
      <select value={professorId} onChange={e => setProfessorId(e.target.value)}>
        <option value="">Sem Professor</option>
        {professores.map((prof) => (
          <option key={prof.id} value={prof.id}>{prof.nome_professor} ({prof.matricula})</option>
        ))}
      </select>
      <select value={representanteId} onChange={e => setRepresentanteId(e.target.value)} style={{marginTop: 8}}>
        <option value="">Sem Representante</option>
        {Array.isArray(alunos) && alunos.map((aluno) => (
          <option key={aluno.id} value={aluno.id}>{aluno.nome_aluno} ({aluno.matricula_aluno})</option>
        ))}
      </select>
      <button type="submit">Salvar</button>
    </form>
  );
}
