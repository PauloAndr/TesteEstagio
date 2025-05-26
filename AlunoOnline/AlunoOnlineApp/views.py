from django.shortcuts import render
from django.http import JsonResponse
from .models import Turma, Professor, Aluno  # Certifique-se de que os modelos Turma, Professor e Aluno estão importados corretamente
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json

# Create your views here.

def get_turmas(request):
    turmas = Turma.objects.filter(ativo=True)
    turmas_data = [
        {
            'id': turma.id,
            'nome_turma': turma.nome_turma,
            'turno': turma.turno,
            'professor_principal': turma.professor_principal.nome_professor if turma.professor_principal else None,
            'turma': turma.turma
        }
        for turma in turmas
    ]
    return JsonResponse({'turmas': turmas_data})

def get_professores(request):
    professores = Professor.objects.filter(ativo=True)
    professores_data = [
        {
            'id': prof.id,
            'nome_professor': prof.nome_professor,
            'matricula_professor': prof.matricula_professor
        }
        for prof in professores
    ]
    return JsonResponse({'professores': professores_data})

def get_alunos(request):
    alunos = Aluno.objects.filter(ativo=True)
    alunos_data = [
        {
            'id': aluno.id,
            'nome_aluno': aluno.nome_aluno,
            'matricula_aluno': aluno.matricula_aluno,
            'turma': aluno.turma.nome_turma if aluno.turma else None
        }
        for aluno in alunos
    ]
    return JsonResponse({'alunos': alunos_data})

@csrf_exempt
@require_http_methods(["POST"])
def post_professor(request):
    try:
        data = json.loads(request.body)
        nome = data.get('nome_professor')
        matricula = data.get('matricula_professor')
        if not nome or not matricula:
            return JsonResponse({'error': 'Nome e matrícula são obrigatórios.'}, status=400)
        professor = Professor.objects.create(nome_professor=nome, matricula_professor=matricula)
        return JsonResponse({'id': professor.id, 'nome_professor': professor.nome_professor, 'matricula_professor': professor.matricula_professor}, status=201)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
@require_http_methods(["POST"])
def post_aluno(request):
    try:
        data = json.loads(request.body)
        nome = data.get('nome_aluno')
        matricula = data.get('matricula_aluno')
        turma_id = data.get('turma_id')
        if not nome or not matricula:
            return JsonResponse({'error': 'Nome e matrícula são obrigatórios.'}, status=400)
        turma = None
        if turma_id:
            try:
                turma = Turma.objects.get(id=turma_id)
            except Turma.DoesNotExist:
                return JsonResponse({'error': 'Turma não encontrada.'}, status=404)
        aluno = Aluno.objects.create(nome_aluno=nome, matricula_aluno=matricula, turma=turma)
        return JsonResponse({'id': aluno.id, 'nome_aluno': aluno.nome_aluno, 'matricula_aluno': aluno.matricula_aluno, 'turma': turma.nome_turma if turma else None}, status=201)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
@require_http_methods(["POST"])
def post_turma(request):
    try:
        data = json.loads(request.body)
        nome = data.get('nome_turma')
        turno = data.get('turno')
        professor_id = data.get('professor_principal_id')
        turma_field = data.get('turma')
        if not nome or not turno or not turma_field:
            return JsonResponse({'error': 'Nome da turma, turno e campo turma são obrigatórios.'}, status=400)
        professor = None
        if professor_id:
            try:
                professor = Professor.objects.get(id=professor_id)
            except Professor.DoesNotExist:
                return JsonResponse({'error': 'Professor não encontrado.'}, status=404)
        turma_obj = Turma.objects.create(
            nome_turma=nome,
            turno=turno,
            professor_principal=professor,
            turma=turma_field
        )
        return JsonResponse({
            'id': turma_obj.id,
            'nome_turma': turma_obj.nome_turma,
            'turno': turma_obj.turno,
            'professor_principal': turma_obj.professor_principal.nome_professor if turma_obj.professor_principal else None,
            'turma': turma_obj.turma
        }, status=201)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
@require_http_methods(["DELETE"])
def delete_aluno(request, aluno_id):
    try:
        aluno = Aluno.objects.get(id=aluno_id)
        if not aluno.ativo:
            return JsonResponse({'error': 'Aluno não encontrado.'}, status=404)
        # Se o aluno for representante de alguma turma, remover o vínculo
        turmas_representante = Turma.objects.filter(representante=aluno)
        for turma in turmas_representante:
            turma.representante = None
            turma.save()
        aluno.ativo = False
        aluno.save()
        return JsonResponse({'message': 'Aluno excluído com sucesso.'}, status=200)
    except Aluno.DoesNotExist:
        return JsonResponse({'error': 'Aluno não encontrado.'}, status=404)
    
@csrf_exempt
@require_http_methods(["DELETE"])
def delete_professor(request, professor_id):
    try:
        professor = Professor.objects.get(id=professor_id)
        if not professor.ativo:
            return JsonResponse({'error': 'professor não encontrado.'}, status=404)
        # Se o professor for professor_principal de alguma turma, remover o vínculo
        turmas_professor = Turma.objects.filter(professor_principal=professor)
        for turma in turmas_professor:
            turma.professor_principal = None
            turma.save()
        professor.ativo = False
        professor.save()
        return JsonResponse({'message': 'professor excluído com sucesso.'}, status=200)
    except Professor.DoesNotExist:
        return JsonResponse({'error': 'professor não encontrado.'}, status=404)
    
@csrf_exempt
@require_http_methods(["DELETE"])
def delete_turma(request, turma_id):
    try:
        turma = Turma.objects.get(id=turma_id)
        if not turma.ativo:
            return JsonResponse({'error': 'Turma não encontrada.'}, status=404)
        # Setar turma=None para todos os alunos matriculados nesta turma
        alunos = Aluno.objects.filter(turma=turma)
        for aluno in alunos:
            aluno.turma = None
            aluno.save()
        turma.ativo = False
        turma.save()
        return JsonResponse({'message': 'Turma excluída com sucesso.'}, status=200)
    except Turma.DoesNotExist:
        return JsonResponse({'error': 'Turma não encontrada.'}, status=404)

