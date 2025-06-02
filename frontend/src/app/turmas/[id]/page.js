"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function TurmaDetalhe() {
  const { id } = useParams();
  const [turma, setTurma] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/turmas/${id}/`)
      .then((res) => res.json())
      .then((data) => setTurma(data));
  }, [id]);

  if (!turma) return <div>Carregando...</div>;

  return (
    <div>
      <h1>{turma.serie} - {turma.turma}</h1>
      <p>Professor responsável: {turma.professor_principal?.nome_professor}</p>
      <p>Representante: {turma.representante?.nome_aluno}</p>
      <h2>Alunos</h2>
      <ul>
        {turma.alunos.map((aluno) => (
          <li key={aluno.id}>{aluno.nome_aluno}</li>
        ))}
      </ul>
    </div>
  );
}
