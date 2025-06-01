"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditarAluno() {
  const { id } = useParams();
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [turmaId, setTurmaId] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch(`http://localhost:8000/api/alunos/${id}/`)
      .then((res) => res.json())
      .then((data) => {
        setNome(data.nome_aluno);
        setMatricula(data.matricula_aluno);
        setTurmaId(data.turma_id || "");
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`http://localhost:8000/api/alunos/${id}/update/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome_aluno: nome, matricula_aluno: matricula, turma_id: turmaId }),
    });
    router.push("/alunos");
  };

  return (
      <form onSubmit={handleSubmit}>
        <input placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
        <input placeholder="Matrícula" value={matricula} onChange={e => setMatricula(e.target.value)} />
        <input placeholder="ID da Turma" value={turmaId} onChange={e => setTurmaId(e.target.value)} />
        <button type="submit">Salvar</button>
      </form>
  );
}
