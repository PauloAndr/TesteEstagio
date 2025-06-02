from rest_framework import serializers
from .models import Turma, Professor, Aluno

class ProfessorSerializer(serializers.ModelSerializer):
    turma_lecionado = serializers.SerializerMethodField()
    serie_turma_lecionada = serializers.SerializerMethodField()

    class Meta:
        model = Professor
        fields = ['id', 'nome_professor', 'matricula_professor', 'turma_lecionado', 'serie_turma_lecionada']

    def get_turma_lecionado(self, obj):
        turma = Turma.objects.filter(professor_principal=obj).first()
        if turma:
            return turma.turma
        return None

    def get_serie_turma_lecionada(self, obj):
        turma = Turma.objects.filter(professor_principal=obj).first()
        if turma:
            return turma.serie
        return None

class AlunoSerializer(serializers.ModelSerializer):
    turma = serializers.PrimaryKeyRelatedField(read_only=True)  # Retorna o id da turma

    class Meta:
        model = Aluno
        fields = ['id', 'nome_aluno', 'matricula_aluno', 'turma']

class TurmaSerializer(serializers.ModelSerializer):
    professor_principal = ProfessorSerializer(read_only=True)
    representante = AlunoSerializer(read_only=True)
    alunos = AlunoSerializer(many=True, read_only=True)
    professor_principal_id = serializers.PrimaryKeyRelatedField(
        queryset=Professor.objects.all(), source="professor_principal", write_only=True, required=False, allow_null=True
    )
    representante_id = serializers.PrimaryKeyRelatedField(
        queryset=Aluno.objects.all(), source="representante", write_only=True, required=False, allow_null=True
    )

    class Meta:
        model = Turma
        fields = [
            'id', 'turno', 'serie', 'turma',
            'professor_principal', 'professor_principal_id',
            'representante', 'representante_id',
            'alunos'
        ]