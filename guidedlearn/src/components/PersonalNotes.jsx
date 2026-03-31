import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, doc, setDoc, onSnapshot, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { FileText, Plus, Save, Bold, List, Type, Trash2, Heading1, Heading2, Loader2, Edit3, AlertTriangle } from 'lucide-react'; // 💡 AlertTriangle එකතු කළා
import toast from 'react-hot-toast';

export default function PersonalNotes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // 💡 අලුත්: Delete කරන්න යන Note එක මතක තියාගන්න State එක
  const [noteToDelete, setNoteToDelete] = useState(null);
  
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
        selectNote(loadedNotes[0]);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const selectNote = (note) => {
    setActiveNote(note);
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

  // 💡 1. Delete Button එක එබුවම කෙලින්ම මකන්නේ නෑ, State එකට දාගන්නවා
  const requestDelete = (e, noteId) => {
    e.stopPropagation(); 
    setNoteToDelete(noteId);
  };

  // 💡 2. Popup එකේ "Cancel" එබුවම වෙන දේ
  const cancelDelete = () => {
    setNoteToDelete(null);
  };

  // 💡 3. Popup එකේ "Yes, Delete" එබුවම තමයි ඇත්තටම මකන්නේ
  const confirmDelete = async () => {
    if (!noteToDelete) return;
    
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'personal_notes', noteToDelete));
      if (activeNote?.id === noteToDelete) {
        setActiveNote(null);
      }
      toast.success('Note deleted!');
    } catch (error) {
      toast.error("Failed to delete.");
    } finally {
      setNoteToDelete(null); // මකලා ඉවර වුණාම Popup එක වහනවා
    }
  };

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) editorRef.current.focus();
  };

  const preventBlur = (e) => e.preventDefault();

  return (
    // 💡 relative දැම්මා අර Popup එක මේ පෙට්ටිය ඇතුළේ විතරක් එන්න
    <div className="flex h-[450px] w-full bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-700/50 relative">
      
      {/* --- 📁 Left Sidebar (File Directory) --- */}
      <div className="w-48 bg-slate-950/80 border-r border-slate-700/50 flex flex-col">
        <div className="p-3 border-b border-slate-700/50 flex justify-between items-center bg-slate-900/50">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">My Notes</span>
          <button onClick={createNewNote} className="text-purple-400 hover:text-white hover:bg-purple-500/20 p-1.5 rounded-lg transition-colors" title="New Note">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
          {isLoading ? (
            <div className="flex justify-center p-4"><Loader2 className="w-5 h-5 text-purple-400 animate-spin" /></div>
          ) : notes.length === 0 ? (
            <div className="text-center p-4 text-xs text-slate-500">No notes yet.<br/>Click + to create.</div>
          ) : (
            notes.map(note => (
              <div 
                key={note.id} 
                onClick={() => selectNote(note)}
                className={`group flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all duration-200 ${activeNote?.id === note.id ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent'}`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileText className="w-3.5 h-3.5 shrink-0 opacity-70" />
                  <span className="text-sm font-medium truncate">{note.title}</span>
                </div>
                {/* 💡 මෙතන onClick එක requestDelete වලට මාරු කළා */}
                <button 
                  onClick={(e) => requestDelete(e, note.id)} 
                  className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-white hover:bg-red-500 p-1.5 rounded-md transition-all"
                  title="Delete Note"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- 📝 Right Editor Area --- */}
      <div className="flex-1 flex flex-col bg-slate-900/20 relative">
        {activeNote ? (
          <>
            <div className="h-14 bg-slate-800/80 border-b border-slate-700/50 flex items-center justify-between px-4 gap-4 shadow-sm">
              <div className="flex-1 flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-xl border border-slate-700/50 focus-within:border-purple-500/50 transition-colors">
                <Edit3 className="w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={activeNote.title}
                  onChange={(e) => setActiveNote(prev => ({ ...prev, title: e.target.value }))}
                  onBlur={handleSave} 
                  placeholder="Note Title..."
                  className="bg-transparent text-white font-bold text-sm w-full border-none outline-none placeholder-slate-600"
                />
              </div>

              <div className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-xl border border-slate-700/50 shrink-0">
                <button onMouseDown={preventBlur} onClick={() => formatText('formatBlock', 'H1')} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"><Heading1 className="w-4 h-4" /></button>
                <button onMouseDown={preventBlur} onClick={() => formatText('formatBlock', 'H2')} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"><Heading2 className="w-4 h-4" /></button>
                <button onMouseDown={preventBlur} onClick={() => formatText('formatBlock', 'P')} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"><Type className="w-4 h-4" /></button>
                <div className="w-px h-4 bg-slate-700 mx-1"></div>
                <button onMouseDown={preventBlur} onClick={() => formatText('bold')} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"><Bold className="w-4 h-4" /></button>
                <button onMouseDown={preventBlur} onClick={() => formatText('insertUnorderedList')} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"><List className="w-4 h-4" /></button>
              </div>

              <button 
                onClick={handleSave} 
                disabled={isSaving}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50 shrink-0"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save
              </button>
            </div>

            <div 
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              className="flex-1 p-6 outline-none overflow-y-auto custom-scrollbar prose prose-invert prose-purple max-w-none prose-h1:text-2xl prose-h1:font-black prose-h2:text-xl prose-h2:font-bold prose-p:text-slate-300 prose-li:text-slate-300"
              placeholder="Start typing your notes here..."
              onBlur={handleSave} 
            ></div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
            <FileText className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-sm font-medium">Select a note from the sidebar<br/>or click + to create a new one</p>
          </div>
        )}
      </div>

      {/* --- 🚀 අලුත් කෑල්ල: Custom Delete Confirmation Modal --- */}
      {noteToDelete && (
        <div className="absolute inset-0 z-[200] bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700/50 rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl relative overflow-hidden flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
            
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            
            <h4 className="text-white font-black text-xl mb-2">Delete Note?</h4>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              This action cannot be undone. Are you absolutely sure you want to delete this note?
            </p>
            
            <div className="flex gap-3 w-full">
              <button 
                onClick={cancelDelete} 
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold py-3 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete} 
                className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)]"
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