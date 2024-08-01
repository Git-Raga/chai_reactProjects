import { useEffect, useState } from 'react';
import db from"../appwrite/database"


function Notes() {
  const [notes, setNotes] = useState([]);

  const init = async () => {
    try {
      // const response = await databases.listDocuments(
      //   import.meta.env.VITE_DATABASE_ID,
      //   import.meta.env.VITE_COLLECTION_ID_TODOS
      // );
      const response =await db.todocollection.list() 
      setNotes(response.documents);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4
      font-mono">Notes</h1>
      {notes.length === 0 ? (
        <div>No notes found</div>
      ) : (
        notes.map((note) => (
          <div key={note.$id} className="p-4 mb-4 border rounded shadow font-black
          font-mono">
            {note.taskname}
          </div>
        ))
      )}
    </div>
  );
}

export default Notes;
