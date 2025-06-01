"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ListarTurmasPage() {
  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:8000/api/turmas/")
      .then((res) => res.json())
      .then((data) => setTurmas(data.turmas))
      .finally(() => setLoading(false));
  }, []);

  return (
      <div>
        <h1>Lista de Turmas</h1>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <>
            <ul style={{marginTop: 12}}>
              {turmas.map((turma) => (
                <li key={turma.id}>
                  <b>{turma.serie} - {turma.turma}</b>
                  {" | Professor: "}
                  {turma.professor_principal && turma.professor_principal.nome_professor ? turma.professor_principal.nome_professor : "a definir"}
                  {" | Representante: "}
                  {turma.representante && turma.representante.nome_aluno ? turma.representante.nome_aluno : "a definir"}
                  {" | "}
                  <Link href={`/turmas/${turma.id}/detalhes`}>Detalhes</Link>
                  {" | "}
                  <Link href={`/turmas/${turma.id}/editar`}>Editar</Link>
                  {" | "}
                  <a href={`http://localhost:8000/api/exportar_excel/${turma.id}/`} target="_blank">Exportar XLSX</a>
                  {" | "}
                  <button onClick={async () => {
                    if (confirm('Tem certeza que deseja deletar esta turma?')) {
                      const res = await fetch(`http://localhost:8000/api/turmas/${turma.id}/delete/`, { method: 'DELETE' });
                      if (res.ok) {
                        setTurmas(turmas.filter(t => t.id !== turma.id));
                      } else {
                        alert('Erro ao deletar turma');
                      }
                    }
                  }} style={{ color: 'red', marginLeft: 8 }}>Deletar</button>
                </li>
              ))}
            </ul>
            <div style={{marginTop: 16}}>
              <button type="button" onClick={() => router.back()} style={{marginRight: 8}}>
                Voltar
              </button>
              <button type="button" onClick={() => router.push("/") }>
                Home
              </button>
            </div>
          </>
        )}
      </div>
  );
}
