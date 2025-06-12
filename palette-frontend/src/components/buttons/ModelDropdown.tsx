import { twMerge } from 'tailwind-merge'
import  ModelChoice from './ModelChoice'

export const ModelDropdown = ({
  onModelSelect,
  className
}: {
  onModelSelect: (model: string[], company: string) => void
  className?: string
}) => {
  return (
    <div
      className={twMerge(
        'absolute left-0 top-full mt-2 bg-zinc-900/95 rounded-lg p-2 shadow-lg w-[200px]',
        className
      )}
    >
      <ModelChoice
        className="w-full"
        company="OpenAI"
        children={[['GPT-4o', 'chatgpt-4o-latest'], ['GPT-4o mini', 'gpt-4o-mini'], ['GPT-o1 preview', 'o1-preview'], ['GPT-o1 mini', 'o1-mini']]}
        onModelSelect={onModelSelect}
      />
      <ModelChoice
        className="w-full"
        company="Anthropic"
        children={[
         
          ['Claude 3.5 Sonnet', 'claude-3-5-sonnet-20241022'],
          
        ]}
        onModelSelect={onModelSelect}
      />
      <ModelChoice
        className="w-full"
        company="Google"
        children={[['Gemini 2.0 Flash', 'gemini-2.0-flash']]}
        onModelSelect={onModelSelect}
      />
      <ModelChoice
        className="w-full"
        company="Meta"
        children={[['Llama 3.1', 'llama-3-1-8b-instruct']]}
        onModelSelect={onModelSelect}
      />
    </div>
  )
}
