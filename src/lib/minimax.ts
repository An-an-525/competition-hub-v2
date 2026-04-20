/**
 * MiniMax M2.7 API 客户端 - SSE 流式调用
 */

const API_URL = 'https://api.minimax.chat/v1/text/chatcompletion_v2'
const MODEL = 'MiniMax-Text-01'

const SYSTEM_PROMPT =
  '你是长沙理工大学竞赛助手，专门回答关于学科竞赛、创新学分、校赛/省赛/国赛流程等问题。回答要简洁准确，引用政策时注明来源。'

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

/**
 * 流式调用 MiniMax API
 * @param messages 对话历史（不含 system prompt）
 * @param onChunk 收到文本片段时的回调
 * @param onDone 流式结束回调
 * @param onError 错误回调
 */
export async function streamChat(
  messages: ChatMessage[],
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (error: Error) => void,
): Promise<void> {
  const apiKey = import.meta.env.VITE_MINIMAX_API_KEY as string | undefined

  if (!apiKey) {
    onError(new Error('未配置 VITE_MINIMAX_API_KEY 环境变量'))
    return
  }

  const fullMessages: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages,
  ]

  let response: Response
  try {
    response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: fullMessages,
        stream: true,
      }),
    })
  } catch (err) {
    onError(err instanceof Error ? err : new Error('网络请求失败'))
    return
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => '')
    onError(
      new Error(
        `API 请求失败 (${response.status}): ${errorText || response.statusText}`,
      ),
    )
    return
  }

  if (!response.body) {
    onError(new Error('响应体为空，无法读取流'))
    return
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })

      // SSE 格式: 每行以 "data: " 开头
      const lines = buffer.split('\n')
      // 保留最后一行（可能不完整）
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || !trimmed.startsWith('data:')) continue

        const data = trimmed.slice(5).trim()
        if (data === '[DONE]') {
          onDone()
          return
        }

        try {
          const parsed = JSON.parse(data) as {
            choices?: Array<{
              delta?: { content?: string }
              finish_reason?: string | null
            }>
          }
          const content = parsed.choices?.[0]?.delta?.content
          if (content) {
            onChunk(content)
          }
          if (parsed.choices?.[0]?.finish_reason === 'stop') {
            onDone()
            return
          }
        } catch {
          // 忽略无法解析的行
        }
      }
    }

    // 流结束但未收到 [DONE]，也视为完成
    onDone()
  } catch (err) {
    onError(err instanceof Error ? err : new Error('读取流时发生错误'))
  }
}
