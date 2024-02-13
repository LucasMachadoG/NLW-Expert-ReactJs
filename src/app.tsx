import { ChangeEvent, useState } from 'react'
import logo from './assets/logo.svg'
import { Card } from './components/Card'
import { NewCard } from './components/New.card'

interface noteProps{
  id: string,
  date: Date,
  content: string
}

export default function App() {
  const [notes, setNotes] = useState<noteProps[]>(() => {
    const notesStorage = localStorage.getItem('notes')

    if(notesStorage){
      return JSON.parse(notesStorage)
    }
    return []
  })
  const [search, setSearch] = useState('')

  function onNoteCreated(content: string){
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content
    }

    const notesArray = [newNote, ...notes]

    setNotes(notesArray)

    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  function onNoteDeleted(id: string){
    const newArrayNotes = notes.filter((note) => {
      return note.id !== id
    })

    setNotes(newArrayNotes)
    localStorage.setItem('notes', JSON.stringify(newArrayNotes))
  }

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value

    setSearch(query)
  }

  const filteredNotes = search !== '' ? notes.filter((note) => note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase())) : notes

  return (
    <div className='mx-auto max-w-6xl my-12 space-y-6 px-5'>
      <img src={logo} alt='NLW - Expert' />

      <form className='w-full'>
        <input 
          type='text' 
          placeholder='Busque em suas notas...' 
          className='w-full bg-transparent text-3xl font-semibold tracking-tight placeholder:text-slate-500 outline-none'
          onChange={handleSearch}
        />
      </form>

      <div className='h-px bg-slate-700' />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]'>
        <NewCard onNoteCreated={onNoteCreated} />
        {filteredNotes.map((note) => (
          <Card key={note.id} note={note} onNoteDeleted={onNoteDeleted} />
        ))}
      </div>
    </div>
  )
}

