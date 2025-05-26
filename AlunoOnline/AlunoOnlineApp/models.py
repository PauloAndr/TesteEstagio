from django.db import models

# --- Modelo Professor ---
class Professor(models.Model):
    nome_professor = models.CharField(max_length=100)
    matricula_professor = models.CharField(max_length=10, unique=True, blank=False, editable=True, null=True)
    ativo = models.BooleanField(default=True)

    def __str__(self):
        return self.nome_professor


# --- Modelo Turma ---
class Turma(models.Model):

    turno = models.CharField(max_length=20, unique=False, blank=False, editable=True, null=True)
    nome_turma = models.CharField(max_length=100, unique=True)
    professor_principal = models.OneToOneField(
        Professor,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='turma_lecionada'
    )
    turma = models.CharField(max_length=100, unique=False, blank=False, editable=True, null=True)
    representante = models.OneToOneField(
        'Aluno',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='turma_representada'
    )
    ativo = models.BooleanField(default=True)

    def __str__(self):
        return self.nome_turma

# --- Modelo Aluno ---
class Aluno(models.Model):
    nome_aluno = models.CharField(max_length=100)
    turma = models.ForeignKey(Turma, on_delete=models.SET_NULL, null=True, blank=True, related_name='alunos')
    matricula_aluno = models.CharField(max_length=10, unique=True, blank=False, editable=True, null=True)
    ativo = models.BooleanField(default=True)
    def __str__(self):
        return self.nome_aluno