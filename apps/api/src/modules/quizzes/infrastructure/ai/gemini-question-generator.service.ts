import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { GoogleGenerativeAI } from '@google/generative-ai'
import {
  IAIQuestionGenerator,
  GenerateQuestionsParams,
  GeneratedQuestion,
} from './ai-question-generator.interface'

@Injectable()
export class GeminiQuestionGeneratorService implements IAIQuestionGenerator {
  private readonly logger = new Logger(GeminiQuestionGeneratorService.name)

  async generateQuestions(
    params: GenerateQuestionsParams,
  ): Promise<GeneratedQuestion[]> {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      throw new BadRequestException('GEMINI_API_KEY não configurada')
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.1-flash-lite-preview',
    })

    const prompt = this.buildPrompt(params)

    this.logger.log(`Gerando ${params.questionCount} questões via Gemini...`)

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    return this.parseResponse(text, params)
  }

  private buildPrompt(params: GenerateQuestionsParams): string {
    const {
      theme,
      difficulty,
      questionType,
      questionCount,
      generationContext,
    } = params

    let prompt: string = `Você é um professor especialista em criação de questões educacionais.
Gere exatamente ${questionCount} questões sobre o tema "${theme}".

Requisitos:
- Dificuldade: ${difficulty}
- Tipo de questão: ${questionType}
`

    if (generationContext) {
      prompt += `
Contexto de Geração:
- Disciplina: ${generationContext.subject}
- Tópico: ${generationContext.topic}
- Nível de ensino: ${generationContext.gradeLevel}
- Nível cognitivo (Bloom): ${generationContext.cognitiveLevel}
- Estilo de linguagem: ${generationContext.languageStyle}
- Estratégia de dificuldade: ${generationContext.difficultyStrategy}
- Objetivos de aprendizagem: ${generationContext.learningObjectives.join(', ')}
`

      if (generationContext.rules.length > 0) {
        prompt += `- Regras: ${generationContext.rules.join('; ')}\n`
      }

      if (generationContext.referenceMaterial) {
        prompt += `- Material de referência: ${generationContext.referenceMaterial}\n`
      }
    }

    if (questionType === 'MULTIPLA_ESCOLHA') {
      prompt += `
Para cada questão de múltipla escolha, gere exatamente 5 alternativas, sendo apenas 1 correta.
`
    } else if (questionType === 'VERDADEIRO_FALSO') {
      prompt += `
Para cada questão de verdadeiro ou falso, gere 2 alternativas: "Verdadeiro" e "Falso", sendo apenas 1 correta.
`
    }

    if (questionType === 'DISCURSIVA') {
      prompt += `
Responda EXCLUSIVAMENTE com um JSON válido no seguinte formato (sem markdown, sem texto extra).
Questões discursivas NÃO possuem alternativas. Inclua apenas os campos abaixo:
[
  {
    "statement": "Enunciado da questão discursiva",
    "type": "DISCURSIVA",
    "explanation": "Explicação detalhada de como a resposta deve ser elaborada",
    "correctAnswer": "Resposta esperada completa e detalhada"
  }
]

IMPORTANTE:
- NÃO inclua o campo "alternatives" em nenhuma questão.
- O campo "correctAnswer" é OBRIGATÓRIO e deve conter uma resposta modelo completa.
- O campo "explanation" deve conter os critérios de avaliação ou pontos-chave esperados na resposta.
`
    } else {
      prompt += `
Responda EXCLUSIVAMENTE com um JSON válido no seguinte formato (sem markdown, sem texto extra):
[
  {
    "statement": "Enunciado da questão",
    "type": "${questionType}",
    "explanation": "Explicação detalhada da resposta",
    "correctAnswer": "Texto da resposta correta",
    "alternatives": [
      { "text": "Alternativa A", "isCorrect": false },
      { "text": "Alternativa B", "isCorrect": true },
      { "text": "Alternativa C", "isCorrect": false },
      { "text": "Alternativa D", "isCorrect": false },
      { "text": "Alternativa E", "isCorrect": false }
    ]
  }
]
`
    }

    return prompt
  }

  private parseResponse(
    text: string,
    params: GenerateQuestionsParams,
  ): GeneratedQuestion[] {
    try {
      const cleanText = text
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim()

      const parsed = JSON.parse(cleanText)

      if (!Array.isArray(parsed)) {
        throw new BadRequestException('Resposta da IA não é um array')
      }

      return parsed.map((q: any) => {
        const type = q.type || params.questionType
        const isDiscursiva = type === 'DISCURSIVA'

        return {
          statement: q.statement,
          type,
          explanation: q.explanation || undefined,
          correctAnswer: q.correctAnswer || undefined,
          alternatives: isDiscursiva ? undefined : q.alternatives || undefined,
        }
      })
    } catch (error) {
      this.logger.error(`Erro ao parsear resposta da IA: ${error}`)
      this.logger.debug(`Resposta bruta: ${text}`)
      throw new BadRequestException(
        'Falha ao processar resposta da IA. Tente novamente.',
      )
    }
  }
}
