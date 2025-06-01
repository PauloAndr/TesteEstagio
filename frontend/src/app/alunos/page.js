"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AlunosPage() {
  const [alunos, setAlunos] = useState([]);
  const [showList, setShowList] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchAlunos = () => {
    setLoading(true);
    fetch("http://localhost:8000/api/alunos/")
      .then((res) => res.json())
      .then((data) => {
        setAlunos(data.alunos);
        setShowList(true);
      })
      .finally(() => setLoading(false));
  };

  return (
      <div>
        <h1>Alunos</h1>
        <Link href="/alunos/criar">Matricular Aluno</Link>
        <br />
        <Link href="/alunos/listar">
          <button style={{ marginTop: 12, marginRight: 8 }}>Listar Alunos</button>
        </Link>
        {showList && (
          <ul style={{ marginTop: 16 }}>
            {alunos.map((aluno) => (
              <li key={aluno.id}>
                {aluno.nome_aluno} | {aluno.matricula_aluno} | {aluno.turma}
                {" | "}
                <Link href={`/alunos/${aluno.id}/editar`}>Editar</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
  );
}
