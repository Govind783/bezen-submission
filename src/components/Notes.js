
import React, { useState } from "react";
import "../styles/Notes.css";
import { useToast, Wrap, WrapItem, Button, Modal, ModalBody, ModalHeader, ModalCloseButton, ModalFooter, Input, ModalOverlay, ModalContent } from '@chakra-ui/react'
import { BsFillPinFill } from "react-icons/bs"
import { BsTrashFill } from "react-icons/bs"
import { BsPinAngle } from "react-icons/bs";


function NotesComponent() {
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [body, setBody] = useState("");
  const [modifyData, setModifyDData] = useState(false)
  const [newArr, setNewArr] = useState([])

  const [notes, setNotes] = useState([
    {
      id: 1150,
      title: "pre added note1",
      tagline: "pre added note1",
      body: "pre added note 1"
    },

    {
      id: 1151,
      title: "pre added note2",
      tagline: "pre added note2",
      body: "pre added note 2"
    },

    {
      id: 1152,
      title: "pre added note3",
      tagline: "pre added note3",
      body: "pre added note 3"
    },

    {
      id: 1153,
      title: "pre added note4",
      tagline: "pre added note4",
      body: "pre added note 4"
    },
  ]);

  const [page, setPage] = useState(1);


  const toast = useToast()


  // submit handler
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!title || !tagline || !body) {
      toast({
        title: 'Please complete all inputs',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      return;
    }


    // generating randome number to use as id 
    function generateUniqueNumber() {
      let uniqueNumber = "";
      while (uniqueNumber.length < 4) {
        let digit = Math.floor(Math.random() * 10);
        if (!uniqueNumber.includes(digit)) {
          uniqueNumber += digit;
        }
      }
      return uniqueNumber;
    }

    let number = generateUniqueNumber();


    setNotes([...notes, { title, tagline, body, pinned: false, id: number }]);
    setTitle("");
    setTagline("");
    setBody("");
  };


  // executing on click on the pen icon
  const togglePin = (index) => {
    let pinnedCount = notes.filter((note) => note.pinned).length;
    setNotes(
      notes.map((note, i) => {
        if (i === index) {
          let newNote = { ...note };
          if (newNote.pinned) {
            newNote.pinned = false;
            pinnedCount--;
          } else {
            if (pinnedCount < 2) {
              newNote.pinned = !note.pinned;
              pinnedCount++;
            } else {
              newNote.pinned = !note.pinned;
              pinnedCount++;
              let lastPinnedNoteIndex = notes.findIndex(
                (note) => note.pinned === true && note.id !== newNote.id
              );
              notes[lastPinnedNoteIndex].pinned = false;
            }
          }
          return newNote;
        }
        return note;
      })
    );
  };





  // sorting it
  const sortedNotes = notes.sort((a, b) => {
    if (a.pinned === b.pinned) {
      return 0;
    }
    return a.pinned ? -1 : 1;
  })
    .map((note, i) => {
      let newNote = { ...note };
      if (note.pinned) {
        const pinnedCount = notes.filter((n) => n.pinned).length;
        if (pinnedCount > 2) {
          newNote.pinned = false;
        }
      }
      return newNote;
    });


  const pages = [1, 2, 3, 4, 5, 6];
  const pageChnageHandler = (e) => {
    setPage(e.target.innerText);
  };



  const deleteHandler = (id) => {

    let index = id

    const newArrayAfterDeleting = notes.filter((item) => item.id !== index)

    setNotes(newArrayAfterDeleting)


  }



  const [selectedNote, setSelectedNote] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTagline, setNewTageline] = useState("");
  const [newBody, setNewBody] = useState("");


  const openModal = (note) => {
    setSelectedNote(note);
    setNewTitle(note.title);
    setNewTageline(note.tagline)
    setNewBody(note.body)
    setIsOpen(true);

  
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleSubmit2 = () => {
    let newNotes = [...notes];
    let index = newNotes.findIndex((note) => note.id === selectedNote.id);
    newNotes[index].title = newTitle;
    newNotes[index].tagline = newTagline;
    newNotes[index].body = newBody;

    setNotes(newNotes);
    closeModal();
  };


  return (
    <div className="notes-app-container">
      <form onSubmit={handleSubmit} className="notes-form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="notes-input"
        />
        <input
          type="text"
          placeholder="Tagline"
          value={tagline}
          onChange={(event) => setTagline(event.target.value)}
          className="notes-input"
        />
        <textarea
          placeholder="Body"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          className="notes-textarea"

        />
        <button type="submit" className="notes-button">
          Add Note
        </button>
      </form>


      <div className="enteredNotesMainParent">
        {sortedNotes.slice(page * 6 - 6, page * 6).map((note, i) => (
          <div key={i} className="enteredNoteIndivitual" >

            <div onClick={() => openModal(note)}>
              <div>{note.title}</div>
              <div>{note.tagline}</div>
              <div>{note.body}</div>
            </div>

            <br />
            <div className="noteCtaHold">
              <div>
                {note.pinned === true ? <BsPinAngle className="noteIcon" /> : <BsFillPinFill className="noteIcon" onClick={() => togglePin(i)} />}
              </div>

              <div>
                <BsTrashFill className="noteIcon" onClick={() => deleteHandler(note.id)} />
              </div>

            </div>

          </div>
        ))}
      </div>



      <Modal onClose={closeModal} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modify Note</ModalHeader>
          <ModalCloseButton />
          <ModalBody>

            <Input type="text" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            <Input type="text" required value={newTagline} onChange={(e) => setNewTageline(e.target.value)} />
            <Input type="text" required value={newBody} onChange={(e) => setNewBody(e.target.value)} />


          </ModalBody>
          <ModalFooter>
            <Button variantColor="blue" mr={3} onClick={handleSubmit2}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>




      {notes.length === 0 ? <p> Add some notes✅ </p> : ""}
      {notes.length >= 4 && <div className="pagesHold">
        {pages.map((item) => {
          return <p onClick={pageChnageHandler} className="indivitualPage" key={Math.random()}> {item} </p>
        })}
      </div>}




    </div>
  );
}

export default NotesComponent;