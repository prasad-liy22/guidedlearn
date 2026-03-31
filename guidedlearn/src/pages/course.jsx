import { useState, useEffect } from 'react';

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [newSubject, setNewSubject] = useState('');
  const [newLevel, setNewLevel] = useState('Beginner');

  useEffect(() => {
    fetch('http://localhost:3000/courses')
      .then(response => response.json())
      .then(data => setCourses(data))
      .catch(error => console.error("Error:", error));
  }, []);

  const handleAddCourse = (e) => {
    e.preventDefault();
    const courseData = { subject: newSubject, level: newLevel };

    fetch('http://localhost:3000/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(courseData)
    })
      .then(response => response.json())
      .then(addedCourse => {
        setCourses([...courses, addedCourse]);
        setNewSubject('');
        setNewLevel('Beginner');
      });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 md:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 sm:mb-8 text-center">
          My <span className="text-cyan-600 font-bold">LMS Courses</span>
        </h1>

        <div className="bg-white p-5 sm:p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 mb-8 sm:mb-10">
          <h3 className="text-base sm:text-lg font-semibold text-slate-700 mb-4">Add a new course</h3>
          
          <form onSubmit={handleAddCourse} className="flex flex-col md:flex-row gap-3 sm:gap-4">
            <input 
              type="text" 
              placeholder="Subject course" 
              value={newSubject} 
              onChange={(e) => setNewSubject(e.target.value)} 
              required 
              className="flex-1 px-4 py-3 sm:py-2.5 text-base sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            />
            
            <select 
              value={newLevel} 
              onChange={(e) => setNewLevel(e.target.value)} 
              className="px-4 py-3 sm:py-2.5 text-base sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white cursor-pointer transition-all"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            
            <button 
              type="submit" 
              className="w-full md:w-auto bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3 sm:py-2.5 rounded-xl font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-95 md:hover:-translate-y-1"
            >
              Add
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {courses.map(course => (
            
            <div key={course.id} className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 transform active:scale-[0.98] sm:hover:-translate-y-2 cursor-pointer group">
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-100 text-cyan-600 rounded-xl flex items-center justify-center text-xl sm:text-2xl group-hover:bg-cyan-600 group-hover:text-white transition-colors duration-300 shrink-0">
                  📚
                </div>
                
                <span className={`px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-bold rounded-full whitespace-nowrap ml-2 ${
                  course.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                  course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {course.level}
                </span>
              </div>
              
              <h4 className="text-lg sm:text-xl font-bold text-slate-800 mb-1.5 sm:mb-2">{course.subject}</h4>
              <p className="text-xs sm:text-sm text-slate-500">That course completely made for {course.level} level.</p>
            </div>

          ))}
        </div>

      </div>
    </div>
  );
}

export default CoursesPage;