"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ListarAlunosPage() {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:8000/api/alunos/")
      .then((res) => res.json())
      .then((data) => setAlunos(data.alunos))
      .catch(() => setErro("Erro ao carregar alunos"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1>Lista de Alunos</h1>
      <button onClick={() => router.push("/alunos") } style={{marginLeft: 8}}>Voltar</button>
      <button onClick={() => router.push("/") } style={{marginLeft: 8}}>Home</button>
      {loading ? (
        <p>Carregando...</p>
      ) : erro ? (
        <p style={{color: 'red'}}>{erro}</p>
      ) : (
        <ul style={{ marginTop: 16 }}>
          {alunos.map((aluno) => (
            <li key={aluno.id}>
              {aluno.nome_aluno} | {aluno.matricula_aluno} | {aluno.turma}
              {" | "}
              <Link href={`/alunos/${aluno.id}/editar`}>Editar</Link>
              {" | "}
              <button onClick={async () => {
                if (confirm('Tem certeza que deseja deletar este aluno?')) {
                  const res = await fetch(`http://localhost:8000/api/alunos/${aluno.id}/delete/`, { method: 'DELETE' });
                  if (res.ok) {
                    setAlunos(alunos.filter(a => a.id !== aluno.id));
                  } else {
                    alert('Erro ao deletar aluno');
                  }
                }
              }} style={{ color: 'red', marginLeft: 8 }}>Deletar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
