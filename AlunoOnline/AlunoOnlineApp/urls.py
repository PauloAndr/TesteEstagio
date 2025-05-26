from django.urls import path
from . import views

urlpatterns = [
    path('turmas/', views.get_turmas, name='get_turmas'),
    path('turmas/post/', views.post_turma, name='post_turma'),
    path('turmas/<int:turma_id>/delete/', views.delete_turma, name='delete_turma'),
    path('professores/', views.get_professores, name='get_professores'),
    path('professores/post/', views.post_professor, name='post_professor'),
    path('professores/<int:professor_id>/delete/', views.delete_professor, name='delete_professor'),
    path('alunos/', views.get_alunos, name='get_alunos'),
    path('alunos/post/', views.post_aluno, name='post_aluno'),
    path('alunos/<int:aluno_id>/delete/', views.delete_aluno, name='delete_aluno'),
    
]