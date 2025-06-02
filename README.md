# Como rodar e gerenciar o projeto AlunoOnline

## Rodar o backend (Django)

```powershell
.\AlunoOnlineVenv\Scripts\Activate.ps1
cd .\AlunoOnline\
python manage.py runserver
```

## Rodar o frontend (Next.js)

```powershell
cd .\frontend
npm run dev
```

## Atualizar models (migrations)

```powershell
python manage.py makemigrations
python manage.py migrate
```

## Consultar dados no banco (via SQL)

```sql
select * from "AlunoOnlineApp_aluno" aoaa;
select * from "AlunoOnlineApp_turma";
select * from "AlunoOnlineApp_professor";
```

## Testar o banco de dados

```powershell
python manage.py test AlunoOnlineApp
```

## Exportar Excel de uma turma

```powershell
python manage.py shell
from AlunoOnlineApp.exportar_excel import exportar_turma_para_excel
exportar_turma_para_excel(13, r"C:\Users\paulo\Desktop")
```

## Popular o banco de dados com dados de exemplo

```powershell
python manage.py shell
from AlunoOnlineApp.seed import run
run()
```
