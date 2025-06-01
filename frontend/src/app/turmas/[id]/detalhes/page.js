"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function DetalhesTurmaPage() {
  const { id } = useParams();
  const [turma, setTurma] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(`http://localhost:8000/api/turmas/${id}/`)
      .then((res) => res.json())
      .then((data) => setTurma(data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <span>Carregando...</span>
      </div>
    );
  if (!turma) return <div>Turma não encontrada.</div>;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', minHeight: '80vh', alignItems: 'flex-start' }}>
      <div style={{ minWidth: 320, maxWidth: 500, padding: 24, border: '1px solid #ccc', borderRadius: 8, boxShadow: '0 2px 8px #0001' }}>
        <h1 style={{ fontSize: 24, textAlign: 'center', marginBottom: 16 }}>Detalhes da Turma</h1>
        <div style={{ marginBottom: 12 }}>
          <strong>Série:</strong> {turma.serie}
        </div>
        <div style={{ marginBottom: 12 }}>
          <strong>Turma:</strong> {turma.turma}
        </div>
        <div style={{ marginBottom: 12 }}>
          <strong>Turno:</strong> {turma.turno}
        </div>
        <div style={{ marginBottom: 12 }}>
          <strong>Professor:</strong> {turma.professor_principal?.nome_professor || '---'}
        </div>
        <div style={{ marginBottom: 12 }}>
          <strong>Representante:</strong> {turma.representante?.nome_aluno || '---'}
        </div>
        <div style={{ marginTop: 24, marginBottom: 8, fontWeight: 'bold' }}>Alunos</div>
        <ul style={{ marginTop: 2, marginBottom: 16 }}>
          {turma.alunos && turma.alunos.length > 0 ? (
            turma.alunos.map((aluno) => (
              <li key={aluno.id}>{aluno.nome_aluno} ({aluno.matricula_aluno})</li>
            ))
          ) : (
            <li>Nenhum aluno cadastrado</li>
          )}
        </ul>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 24 }}>
          <button onClick={() => router.back()}>Voltar</button>
          <button onClick={() => router.push("/")}>Home</button>
        </div>
      </div>
    </div>
  );
}
