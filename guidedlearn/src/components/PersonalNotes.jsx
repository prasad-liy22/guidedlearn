import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, doc, setDoc, onSnapshot, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { FileText, Plus, Save, Bold, List, Type, Trash2, Heading1, Heading2, Loader2, Edit3, AlertTriangle, ChevronLeft } from 'lucide-react'; // 💡 ChevronLeft එකතු කළා
import toast from 'react-hot-toast';

export default function PersonalNotes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [showMobileList, setShowMobileList] = useState(true);
  
  const editorRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    const notesRef = collection(db, 'users', user.uid, 'personal_notes');
    
    const unsubscribe = onSnapshot(notesRef, (snapshot) => {
      const loadedNotes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      loadedNotes.sort((a, b) => (b.updatedAt?.toMillis() || 0) - (a.updatedAt?.toMillis() || 0));
      setNotes(loadedNotes);
      setIsLoading(false);
      
      if (loadedNotes.length > 0 && !activeNote) {
        setActiveNote(loadedNotes[0]);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const selectNote = (note) => {
    setActiveNote(note);
    setShowMobileList(false);
  };

  useEffect(() => {
    if (activeNote && editorRef.current) {
      editorRef.current.innerHTML = activeNote.content || '';
    }
  }, [activeNote?.id]);

  const createNewNote = async () => {
    const newNoteId = Date.now().toString();
    const newNote = {
      id: newNoteId,
      title: 'Untitled Note',
      content: '',
      updatedAt: serverTimestamp()
    };
    
    setActiveNote(newNote);
    setShowMobileList(false);
    
    try {
      await setDoc(doc(db, 'users', user.uid, 'personal_notes', newNoteId), newNote);
    } catch (error) {
      toast.error("Failed to create note.");
    }
  };

  const handleSave = async () => {
    if (!activeNote || !editorRef.current) return;
    setIsSaving(true);
    
    const content = editorRef.current.innerHTML;

    try {
      await setDoc(doc(db, 'users', user.uid, 'personal_notes', activeNote.id), {
        title: activeNote.title, 
        content: content,
        updatedAt: serverTimestamp()
      }, { merge: true });
      
      toast.success('Note saved!', { style: { background: '#8b5cf6', color: '#fff' } });
    } catch (error) {
      toast.error('Failed to save.');
    } finally {
      setIsSaving(false);
    }
  };

  const requestDelete = (e, noteId) => {
    e.stopPropagation(); 
    setNoteToDelete(noteId);
  };

  const cancelDelete = () => {
    setNoteToDelete(null);
  };

  const confirmDelete = async () => {
    if (!noteToDelete) return;
    
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'personal_notes', noteToDelete));
      if (activeNote?.id === noteToDelete) {
        setActiveNote(null);
        setShowMobileList(true);
      }
      toast.success('Note deleted!');
    } catch (error) {
      toast.error("Failed to delete.");
    } finally {
      setNoteToDelete(null); 
    }
  };

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) editorRef.current.focus();
  };

  const preventBlur = (e) => e.preventDefault();

  return (
    <div className="flex h-[500px] md:h-[550px] w-full bg-slate-900/50 rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-700/50 relative shadow-2xl">
      
      {/* --- 📁 Left Sidebar (File Directory) --- */}
      <div className={`w-full md:w-56 lg:w-64 bg-slate-950/80 border-r-0 md:border-r border-slate-700/50 flex flex-col ${showMobileList ? 'flex' : 'hidden'} md:flex shrink-0 transition-all`}>
        <div className="p-4 border-b border-slate-700/50 flex justify-between items-center bg-slate-900/50">
          <span className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest">My Notes</span>
          <button onClick={createNewNote} className="text-purple-400 hover:text-white bg-purple-500/10 hover:bg-purple-500/30 p-2 rounded-xl transition-all active:scale-95" title="New Note">
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
          {isLoading ? (
            <div className="flex justify-center p-6"><Loader2 className="w-6 h-6 text-purple-400 animate-spin" /></div>
          ) : notes.length === 0 ? (
            <div className="text-center p-6 text-sm text-slate-500 font-medium">No notes yet.<br/>Click + to create.</div>
          ) : (
            notes.map(note => (
              <div 
                key={note.id} 
                onClick={() => selectNote(note)}
                className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 active:scale-[0.98] ${activeNote?.id === note.id ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent'}`}
              >
                <div className="flex items-center gap-3 overflow-hidden flex-1">
                  <FileText className={`w-4 h-4 shrink-0 ${activeNote?.id === note.id ? 'text-purple-400' : 'opacity-70'}`} />
                  <span className="text-sm font-bold truncate">{note.title || 'Untitled'}</span>
                </div>
                <button 
                  onClick={(e) => requestDelete(e, note.id)} 
                  className="opacity-100 md:opacity-0 group-hover:opacity-100 text-slate-500 hover:text-white hover:bg-red-500 p-1.5 md:p-2 rounded-lg transition-all active:scale-95 ml-2 shrink-0"
                  title="Delete Note"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- 📝 Right Editor Area --- */}
      <div className={`flex-1 flex flex-col bg-slate-900/20 relative ${!showMobileList ? 'flex' : 'hidden'} md:flex`}>
        {activeNote ? (
          <>
            <div className="bg-slate-800/80 border-b border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:px-4 gap-3 shadow-sm shrink-0">
              
              {/* Back Button (Mobile) & Title */}
              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto flex-1">
                <button 
                  onClick={() => setShowMobileList(true)} 
                  className="md:hidden p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex-1 flex items-center gap-2 bg-slate-900/50 px-3 py-2 sm:py-2.5 rounded-xl border border-slate-700/50 focus-within:border-purple-500/50 transition-colors w-full">
                  <Edit3 className="w-4 h-4 text-slate-500 shrink-0" />
                  <input
                    type="text"
                    value={activeNote.title}
                    onChange={(e) => setActiveNote(prev => ({ ...prev, title: e.target.value }))}
                    onBlur={handleSave} 
                    placeholder="Note Title..."
                    className="bg-transparent text-white font-bold text-sm md:text-base w-full border-none outline-none placeholder-slate-600"
                  />
                </div>
              </div>

              {/* Formatting Tools & Save Button */}
              <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto overflow-hidden">
                <div className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-xl border border-slate-700/50 shrink-0 overflow-x-auto custom-scrollbar">
                  <button onMouseDown={preventBlur} onClick={() => formatText('formatBlock', 'H1')} className="p-1.5 sm:p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors active:scale-95"><Heading1 className="w-4 h-4 sm:w-4 sm:h-4" /></button>
                  <button onMouseDown={preventBlur} onClick={() => formatText('formatBlock', 'H2')} className="p-1.5 sm:p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors active:scale-95"><Heading2 className="w-4 h-4 sm:w-4 sm:h-4" /></button>
                  <button onMouseDown={preventBlur} onClick={() => formatText('formatBlock', 'P')} className="p-1.5 sm:p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors active:scale-95"><Type className="w-4 h-4 sm:w-4 sm:h-4" /></button>
                  <div className="w-px h-4 bg-slate-700 mx-0.5 sm:mx-1 shrink-0"></div>
                  <button onMouseDown={preventBlur} onClick={() => formatText('bold')} className="p-1.5 sm:p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors active:scale-95"><Bold className="w-4 h-4 sm:w-4 sm:h-4" /></button>
                  <button onMouseDown={preventBlur} onClick={() => formatText('insertUnorderedList')} className="p-1.5 sm:p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors active:scale-95"><List className="w-4 h-4 sm:w-4 sm:h-4" /></button>
                </div>

                <button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="flex items-center gap-1.5 sm:gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all disabled:opacity-50 shrink-0 active:scale-95 shadow-lg shadow-purple-600/20"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span className="hidden xs:inline">Save</span>
                </button>
              </div>
            </div>

            <div 
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              className="flex-1 p-4 sm:p-6 md:p-8 outline-none overflow-y-auto custom-scrollbar prose prose-sm sm:prose-base prose-invert prose-purple max-w-none prose-h1:text-2xl sm:prose-h1:text-3xl prose-h1:font-black prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:font-bold prose-p:text-slate-300 prose-li:text-slate-300 w-full"
              placeholder="Start typing your notes here..."
              onBlur={handleSave} 
            ></div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-6 text-center">
            <FileText className="w-12 h-12 sm:w-16 sm:h-16 mb-4 opacity-20" />
            <p className="text-sm sm:text-base font-bold">Select a note from the sidebar<br/>or click + to create a new one</p>
          </div>
        )}
      </div>

      {/* --- 🚀 Custom Delete Confirmation Modal --- */}
      {noteToDelete && (
        <div className="absolute inset-0 z-[200] bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700/50 rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl relative overflow-hidden flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
            
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-4 sm:mb-6 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
              <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
            </div>
            
            <h4 className="text-white font-black text-xl sm:text-2xl mb-2">Delete Note?</h4>
            <p className="text-slate-400 text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed font-medium">
              This action cannot be undone. Are you absolutely sure you want to delete this note?
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button 
                onClick={cancelDelete} 
                className="w-full sm:w-1/2 bg-slate-800 hover:bg-slate-700 text-white text-sm sm:text-base font-bold py-3.5 sm:py-3 rounded-xl transition-colors active:scale-95 border border-slate-700"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete} 
                className="w-full sm:w-1/2 bg-red-500 hover:bg-red-600 text-white text-sm sm:text-base font-bold py-3.5 sm:py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] active:scale-95"
              >
                Yes, Delete
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}