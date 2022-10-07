
import { useEffect, useState } from 'react';
import './App.css';
import  Editor from './components/Editor'
import Sidebar from './components/Sidebar'
import {nanoid} from 'nanoid'
import Split from 'react-split';

function App() {

  const [notes, setNotes] = useState( () => JSON.parse(localStorage.getItem("notes")) || [])
  const [currentNoteId, setCurrentNoteId] = useState(
    (notes[0] && notes[0].id) || ""
  )

  useEffect(()=>{
    localStorage.setItem("notes", JSON.stringify(notes))
  }, [notes])

  function createNewNote(){
    const newNote = {
      id:nanoid(),
      body: "New Note"
    }
    setNotes(prevNote => [newNote, ...prevNote])
    setCurrentNoteId(newNote.id)
  }

  function updateNote(text){
    setNotes(oldNotes => {
      const newArray =[]
      for(let i=0; i<oldNotes.length; i++){
        const oldNote = oldNotes[i]
        if(oldNote.id === currentNoteId){
          newArray.unshift({...oldNote, body:text})
        }else{
          newArray.push(oldNote)
        }
      }
      return newArray
    })
  }

  function deleteNote(event, noteId){
    event.stopPropagation()
    setNotes(oldNotes => oldNotes.filter(note => note.id !== noteId))
  }

  function findCurrentNote(){
    return notes.find(note =>{
      return note.id ===currentNoteId
    }) || notes[0]
  }

  return (
    <div className="App">
      
      <main>
        {
            notes.length > 0 
            ?
            <Split 
                sizes={[30, 70]} 
                direction="horizontal" 
                className="split"
            >
                <Sidebar
                    notes={notes}
                    currentNote={findCurrentNote()}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    deleteNote={deleteNote}
                />
                {
                    currentNoteId && 
                    notes.length > 0 &&
                    <Editor 
                        currentNote={findCurrentNote()} 
                        updateNote={updateNote} 
                    />
                }
            </Split>
            :
            <div className="no-notes">
                <h1>You have no notes</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Create one now
                </button>
            </div>
            
        }
        </main>
    
    </div>
  );
}

export default App;
