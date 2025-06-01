"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TurmasPage() {
  const [turmas, setTurmas] = useState([]);
  const [showList, setShowList] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:8000/api/turmas/")
      .then((res) => res.json())
      .then((data) => setTurmas(data.turmas));
  }, []);

  const handleListar = () => setShowList((prev) => !prev);

  return (
    <div>
      <h1>Turmas</h1>
      <ul style={{ marginTop: 12, listStyle: "none", padding: 0 }}>
        <li>
          <Link href="/turmas/criar">Criar Turma</Link>
        </li>
        <li>
          <Link href="/turmas/listar">
            <button>Listar Turmas</button>
          </Link>
        </li>
      </ul>
      <div style={{ marginTop: 16 }}>
        <button
          type="button"
          onClick={() => router.back()}
          style={{ marginRight: 8 }}
        >
          Voltar
        </button>
      </div>
    </div>
  );
}
