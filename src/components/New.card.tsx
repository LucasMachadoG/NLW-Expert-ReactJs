import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'sonner'

interface newNoteProps{
  onNoteCreated: (content: string) => void
}

let speechRecognition: SpeechRecognition | null = null

export function NewCard({ onNoteCreated }: newNoteProps){
  const [option, setOption] = useState(true)
  const [content, setContent] = useState('')
  const [isRecording, setIsRecording] = useState(false)

  const handleStartEditor = () => {
    setOption(false)
  }

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)

    if(e.target.value === ''){
      setOption(true)
    }
  }

  const handleSaveNote = (e: FormEvent) => {
    e.preventDefault()

    if(content === ''){
      return
    }

    onNoteCreated(content)

    setContent('')
    setOption(true)

    toast.success("Nota criada com sucesso")

  }

  const handleStartRecording = () => {
    const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window
    || 'webkitSpeechRecognition' in window

    if(!isSpeechRecognitionAPIAvailable){
      alert("Infelizmente o seu navegador não suporta a API de gravação!")
      return
    }

    setIsRecording(true)
    setOption(false)

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

    speechRecognition = new SpeechRecognitionAPI()

    speechRecognition.lang = 'pt-BR'
    //Só vai parar de gravar quando eu clicar manualmente em algum botao
    speechRecognition.continuous = true
    //Quando eu falar alguma palavra dificil que ele n entenda, vai fazer com que ele só me retorne uma opção ao invés de varias
    speechRecognition.maxAlternatives = 1
    //Faz com que essa API vá trazendo o resultado conforme eu for falando, não apenas quando eu parar de gravar
    speechRecognition.interimResults = true

    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript)
      }, '')

      setContent(transcription)
    }

    speechRecognition.onerror = (event) => {
      console.log(event)
    }

    speechRecognition.start()
  }

  const handleStopRecording = () => {
    setIsRecording(false)

    if(speechRecognition !== null){
      speechRecognition.stop()
    }
  }

  return(
    <Dialog.Root>
      <Dialog.Trigger className='rounded-md bg-slate-700 p-5 gap-3 text-left overflow-hidden flex flex-col hover:ring-2 outline-none hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400'>
        <span className='text-sm font-medium text-slate-200'>Adicionar nota</span>
        <p className='text-sm leading-6 text-slate-400'>
          Grave uma nota em áudio que será convertida para texto automaticamente.
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className='inset-0 fixed bg-black/50' />
        <Dialog.Content className='fixed inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 
          md:-translate-y-1/2 md:max-w-[640px] w-full bg-slate-700 md:rounded-md flex flex-col
          outline-none md:h-[60vh] overflow-hidden
        '>
          <Dialog.Close className='absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400'>
            <X className='w-5 h-5 hover:text-slate-100'/>
          </Dialog.Close>

        <form className='flex-1 flex-col flex'>
          <div className='flex flex-1 flex-col gap-3 p-5'>
            <span className='text-sm font-medium text-slate-300'>
              Adicionar nota
            </span>
            
            {option ? (
              <p className='text-sm leading-6 text-slate-400 text-left'>Comece <button type='button' onClick={handleStartRecording} className='font-medium text-lime-400 hover:underline'> gravando</button> uma nota em áudio ou se preferir <button type='button' className='font-medium text-lime-400 hover:underline' onClick={handleStartEditor}>
                utilize apenas texto.
              </button>
            </p>
            ) : (
              <textarea 
                autoFocus 
                className='text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none' 
                onChange={(e) => handleContentChange(e)}
                value={content}
              />
            )}
          </div>

          {isRecording ? (
            <button 
              type='button'
              onClick={handleStopRecording}
              className='w-full bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none 
                font-medium hover:text-slate-100 flex items-center justify-center gap-2'
            >
              <div className='size-3 rounded-full bg-red-500 animate-pulse'/>
              Gravando (clique para interromper)
            </button>
          ) : (
            <button 
            type='button'
            onClick={handleSaveNote}
            className='w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500'
          >
            Salvar nota
          </button>
          )}

          
        </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}