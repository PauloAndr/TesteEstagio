from django.db import models

# --- Modelo Professor com Geração Automática de ID ---
class Professor(models.Model):
    nome_professor = models.CharField(max_length=100)
    matricula_professor = models.CharField(max_length=10, unique=True, blank=False, editable=True, null=True)

    def __str__(self):
        return self.nome_professor


# --- Modelo Turma ---
class Turma(models.Model):

    turno = models.CharField(max_length=20, unique=True, blank=False, editable=True, null=True)
    nome_turma = models.CharField(max_length=100, unique=True)
    professor_principal = models.OneToOneField(
        Professor,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='turma_lecionada'
    )
    turma = models.CharField(max_length=100, unique=False, blank=False, editable=True, null=True)

    def __str__(self):
        return self.nome_turma


# --- Modelo Aluno com Geração Automática de Matrícula ---
class Aluno(models.Model):
    nome_aluno = models.CharField(max_length=100)
    turma = models.OneToOneField(Turma, on_delete=models.SET_NULL, null=True, blank=True, related_name='aluno')
    matricula_aluno = models.CharField(max_length=10, unique=True, blank=False, editable=True, null=True)
    def __str__(self):
        return self.nome_aluno