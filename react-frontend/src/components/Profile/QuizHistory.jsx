import { use, useEffect, useState } from "react";
import { useBoundStore } from "@/store/useBoundStore";
import categoriesJSON from "@/assets/categories.json";
import { BsArrowRepeat } from "react-icons/bs";

export default function QuizHistory() {
   const { quizzes, history, getQuizByUserId } = useBoundStore(state => state);
   const [activeTab, setActiveTab] = useState('history');

   useEffect(() => {
      getQuizByUserId
   }, []);

   const historyToDisplay = history?.length > 0 ? history : [];
   const quizzesToDisplay = quizzes?.length > 0 ? quizzes : [];

   return (
      <aside className='bg-white rounded-md lg:shadow-md w-full lg:max-w-6xl mx-auto lg:col-start-1 lg:col-end-2 px-8 py-6 mt-10 flex flex-col justify-start text-slate-900'>

         {/* Tabs */}
         <div className="flex space-x-8 border-b border-gray-300">
            <button className='hover:scale-105 transition-all p-1 bg-white rounded' onClick={getQuizByUserId}>
               <BsArrowRepeat className='text-[28px]' color='#0f172a' title='New game' />
            </button>
            <button
               className={`pb-2 text-lg font-medium ${activeTab === 'history'
                  ? 'border-b-4 border-blue-500 text-blue-500'
                  : 'text-gray-500 hover:text-blue-500'
                  }`}
               onClick={() => setActiveTab('history')}
            >
               Quiz History
            </button>
            <button
               className={`pb-2 text-lg font-medium ${activeTab === 'created'
                  ? 'border-b-4 border-blue-500 text-blue-500'
                  : 'text-gray-500 hover:text-blue-500'
                  }`}
               onClick={() => setActiveTab('created')}
            >
               Created Quizzes
            </button>
         </div>

         {/* Tab Content */}
         {activeTab === 'history' && (
            <div className='overflow-y-auto max-h-[80vh] lg:max-h-[75vh]'>
               <ul className='space-y-3'>
                  {historyToDisplay.map((quiz, index) => {
                     // Extract correctAnswers and totalQuestions from the score field
                     const [correctAnswers, totalQuestions] = quiz.score.split('/').map(Number);
                     const percentage = ((correctAnswers / totalQuestions) * 100).toFixed(1);

                     // Determine the color class based on the percentage
                     const getColorClass = (percentage) => {
                        if (percentage < 33.33) return 'text-red-500'; // 0-1/3
                        if (percentage < 66.67) return 'text-orange-400'; // 1/3-2/3
                        return 'text-green-500'; // 2/3+
                     };

                     return (
                        <li key={index} className='p-3 border rounded-md flex items-center gap-4 mt-4'>
                           <div className='relative w-24 h-24'>
                              <svg className='w-full h-full' viewBox="0 0 36 36">
                                 <path
                                    className="text-gray-300"
                                    d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                 />
                                 <path
                                    className={getColorClass(percentage)}
                                    d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeDasharray={`${percentage}, 100`}
                                 />
                              </svg>
                              <div className='absolute inset-0 flex items-center justify-center text-sm font-bold'>
                                 {correctAnswers}/{totalQuestions}
                              </div>
                           </div>
                           <div>
                              <p><strong>Quiz:</strong> {quiz.quizTitle}</p>
                              <p><strong>Date:</strong> {new Date(quiz.updatedAt).toLocaleDateString()}</p>
                              <p><strong>Percentage:</strong> {percentage}%</p>
                           </div>
                        </li>
                     );
                  })}
                  {historyToDisplay.length === 0 && (
                     <li className='p-3 border rounded-md flex items-center gap-4'>
                        <p>No quiz history available.</p>
                     </li>
                  )}
               </ul>
            </div>
         )}

         {activeTab === 'created' && (
            <div className='overflow-y-auto max-h-[80vh] lg:max-h-[75vh]'>
               <ul className='space-y-3'>
                  {quizzesToDisplay.map((quiz, index) => (
                     <li key={index} className='p-4 border rounded-md flex flex-col gap-4 relative mt-4'>
                        <div className="flex justify-between items-start">
                           <div>
                              <p><strong>Quiz ID:</strong> {quiz.quiz_id}</p>
                              <p><strong>Title:</strong> {quiz.title}</p>
                              <p><strong>Description:</strong> {quiz.description}</p>
                              <p>
                                 <strong>Status:</strong>{' '}
                                 <span
                                    className={`font-bold ${quiz.status === 'ACTIVE' ? 'text-green-500' :
                                       quiz.status === 'INACTIVE' ? 'text-gray-500' :
                                          quiz.status === 'PENDING' ? 'text-orange-500' :
                                             'text-red-500' // For DELETED
                                       }`}
                                 >
                                    {quiz.status}
                                 </span>
                              </p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                 {quiz.categories?.map((category, i) => {
                                    const categoryData = categoriesJSON.find(cat => cat.name.toUpperCase() === category.replace(/_/g, ' '));
                                    return (
                                       <div
                                          key={i}
                                          className="w-10 h-10 flex items-center justify-center rounded-full"
                                          style={{
                                             backgroundColor: categoryData?.color || '#ccc',
                                          }}
                                          title={categoryData?.name || category}
                                       >
                                          <img
                                             src={`/categories-icons/${category.toLowerCase().replace(/_/g, ' ')}.svg`}
                                             alt={category}
                                             className="w-6 h-6"
                                          />
                                       </div>
                                    );
                                 })}
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-sm">
                                 <strong>Start Time:</strong>
                                 <br />
                                 <span className="text-blue-500">{new Date(quiz.start_time).toLocaleString()}</span>
                              </p>
                              <p className="text-sm mt-2">
                                 <strong>End Time:</strong>
                                 <br />
                                 <span className="text-red-500">{new Date(quiz.end_time).toLocaleString()}</span>
                              </p>
                           </div>
                        </div>
                     </li>
                  ))}
                  {quizzesToDisplay.length === 0 && (
                     <li className='p-3 border rounded-md flex items-center gap-4'>
                        <p>No created quizzes available.</p>
                     </li>
                  )}
               </ul>
            </div>
         )}
      </aside>
   )
}
