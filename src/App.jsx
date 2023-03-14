import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import { data } from "./data"
import Split from "react-split"
import { nanoid } from "nanoid"

// Sync notes with localStorage - branch: notes-to-localStorage
// Add note summary titles
// Move modified notes to the top of the list
// Delete notes

export default function App() {
	/**
	 * lazy initialization lets state running every render of App component
	 */ /* notes trash can */
	const [notes, setNotes] = React.useState(
		() => JSON.parse(localStorage.getItem("notes")) || []
	)

	const [currentNoteId, setCurrentNoteId] = React.useState(
		(notes[0] && notes[0].id) || ""
	)

	function createNewNote() {
		const newNote = {
			id: nanoid(),
			body: "# Type your markdown note's title here",
		}
		setNotes((prevNotes) => [newNote, ...prevNotes])
		setCurrentNoteId(newNote.id)
	}

	function updateNote(text) {
		// scrimba solution
		// Put the most recently-modified note at the top
		// setNotes(oldNotes => {
		//     const newArray = []
		//     for(let i = 0; i < oldNotes.length; i++) {
		//         const oldNote = oldNotes[i]
		//         if(oldNote.id === currentNoteId) {
		//             newArray.unshift({ ...oldNote, body: text })
		//         } else {
		//             newArray.push(oldNote)
		//         }
		//     }
		//     return newArray
		// })
		// my solution
		setNotes((oldNotes) => {
			let noteIndex
			const updatedNotes = oldNotes.map((oldNote, index) => {
				if (oldNote.id === currentNoteId) {
					noteIndex = index
					return { ...oldNote, body: text }
				} else return oldNote
			})
			const noteUpdated = updatedNotes.splice(noteIndex, 1)
			updatedNotes.unshift(noteUpdated[0])
			return updatedNotes
		})
	}

	function deleteNote(event, noteId) {
		event.stopPropagation()
		// scrimba solution
		// setNotes(oldNotes => oldNotes.filter(note => note.id !== noteId))
		// my solution
		let noteIndex = notes.findIndex((note) => noteId == note.id)
		setNotes((oldNotes) => {
			const newNotes = []
			oldNotes.map((note, index) => {
				if (index != noteIndex) newNotes.push(note)
			})
			return newNotes
		})
	}

	function findCurrentNote() {
		return (
			notes.find((note) => {
				return note.id === currentNoteId
			}) || notes[0]
		)
	}

	React.useEffect(
		// save notes
		() => {
			const currentNotes = JSON.stringify(notes)
			localStorage.setItem("notes", currentNotes)
			//console.log(notes)
		},
		[notes]
	)

	return (
		<main>
			{notes.length > 0 ? (
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
					{currentNoteId && notes.length > 0 && (
						<Editor
							currentNote={findCurrentNote()}
							updateNote={updateNote}
						/>
					)}
				</Split>
			) : (
				<div className="no-notes">
					<h1>You have no notes</h1>
					<button className="first-note" onClick={createNewNote}>
						Create one now
					</button>
				</div>
			)}
		</main>
	)
}

