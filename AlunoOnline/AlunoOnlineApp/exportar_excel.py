import pandas as pd
from .models import Turma

def exportar_turma_para_excel(turma_id, pasta_destino):
    turma = Turma.objects.get(id=turma_id)
    alunos = turma.alunos.all()
    dados = []
    for aluno in alunos:
        dados.append({
            'serie': turma.serie,
            'turma': turma.turma,
            'professor_principal': turma.professor_principal.nome_professor if turma.professor_principal else '',
            'representante': turma.representante.nome_aluno if turma.representante else '',
            'aluno_nome': aluno.nome_aluno,
            'aluno_matricula': aluno.matricula_aluno,
        })
    df = pd.DataFrame(dados)
    # Monta o nome do arquivo com serie e turma, removendo espaços e caracteres especiais
    serie_nome = str(turma.serie).replace(" ", "_")
    turma_nome = str(turma.turma).replace(" ", "_")
    nome_arquivo = f"{serie_nome}_{turma_nome}.xlsx"
    caminho_arquivo = f"{pasta_destino}\\{nome_arquivo}"
    df.to_excel(caminho_arquivo, index=False)
    print(f"Exportado para {caminho_arquivo}")