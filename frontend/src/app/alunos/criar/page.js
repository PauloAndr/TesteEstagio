"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CriarAlunoPage() {
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [turmaId, setTurmaId] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:8000/api/alunos/post/", {
      method: "POST",
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
        <button type="submit">Matricular</button>
      </form>
  );
}
