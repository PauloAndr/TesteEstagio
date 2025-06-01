"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfessoresPage() {
  const [professores, setProfessores] = useState([]);
  const [showList, setShowList] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchProfessores = () => {
    if (showList) {
      setShowList(false);
      return;
    }
    setLoading(true);
    fetch("http://localhost:8000/api/professores/")
      .then((res) => res.json())
      .then((data) => {
        setProfessores(data.professores);
        setShowList(true);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <h1>Professores</h1>
      <Link href="/professores/criar">Cadastrar Professor</Link>
      <br />
      <button
        onClick={() => router.push("/professores/listar")}
        style={{ marginTop: 12 }}
      >
        Listar Professores
      </button>
      <br />
      <Link href="/">
        <button
          type="button"
          onClick={() => router.back()}
          style={{ marginTop: 12, marginRight: 8 }}
        >
          Voltar
        </button>
      </Link>
      {showList && (
        <ul style={{ marginTop: 16 }}>
          {professores.map((prof) => (
            <li key={prof.id}>
              {prof.nome_professor} | {prof.matricula_professor}
              {" | "}
              <Link href={`/professores/${prof.id}/editar`}>Editar</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
