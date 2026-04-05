export type TutorialStep = {
  /** CSS selector or data-tutorial attribute value */
  target: string
  title: string
  description: string
  placement: 'top' | 'bottom' | 'left' | 'right'
}

export const professorSteps: TutorialStep[] = [
  {
    target: '[data-tutorial="nav-turmas"]',
    title: 'Suas Turmas',
    description:
      'Gerencie suas turmas, veja alunos matriculados e compartilhe o código de acesso.',
    placement: 'right',
  },
  {
    target: '[data-tutorial="nav-quizzes"]',
    title: 'Quizzes Criados',
    description:
      'Visualize todos os seus quizzes, acompanhe o status de cada um e acesse os relatórios de desempenho dos alunos.',
    placement: 'right',
  },
  {
    target: '[data-tutorial="nav-criar-quiz"]',
    title: 'Criar Quiz com IA',
    description:
      'Crie quizzes em 4 passos: escolha um contexto, configure dificuldade e quantidade, aguarde a IA gerar as questões e revise antes de publicar.',
    placement: 'right',
  },
  {
    target: '[data-tutorial="nav-contextos"]',
    title: 'Contextos de Geração',
    description:
      'Configure diretrizes de geração — nível cognitivo, estilo de linguagem e material de referência — para que a IA produza questões alinhadas ao currículo.',
    placement: 'right',
  },
  {
    target: '[data-tutorial="nav-config"]',
    title: 'Configurações',
    description:
      'Atualize seu nome, e-mail e senha. Você também pode excluir sua conta a partir daqui.',
    placement: 'right',
  },
]

export const alunoSteps: TutorialStep[] = [
  {
    target: '[data-tutorial="nav-turmas"]',
    title: 'Entrar em Turmas',
    description:
      'Use o código fornecido pelo seu professor para se matricular em uma turma e acessar os quizzes disponíveis.',
    placement: 'right',
  },
  {
    target: '[data-tutorial="nav-historico"]',
    title: 'Histórico de Tentativas',
    description:
      'Reveja todas as suas tentativas anteriores, confira suas notas e veja o feedback detalhado de cada questão.',
    placement: 'right',
  },
  {
    target: '[data-tutorial="nav-config"]',
    title: 'Seu Perfil',
    description: 'Atualize suas informações pessoais — nome, e-mail e senha.',
    placement: 'right',
  },
]
