import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { IoMdSave } from 'react-icons/io';
import { FaRegQuestionCircle } from 'react-icons/fa';
import { AiFillBulb, AiFillFile, AiFillFolder, AiOutlineCaretUp } from "react-icons/ai";
import Image from 'next/image';
import { useBoundStore } from '@/store/useBoundStore';
import fileToGenerate from '@/helpers/quiz/fileToGenerate';

const QuizQuestionCreator = () => {
  const [currentQuestion, setCurrentQuestion] = useState({ question: '', answers: ['', '', '', ''], correctAnswer: '', category: '' });
  const { addCreatedQuestion, createdQuestions, removeCreatedQuestion, saveQuestions, hasFile, quizId, generateQuestion } = useBoundStore(state => state);

  const addQuestion = () => {
    if (!currentQuestion.question.trim()) {
      alert("Please enter a question.");
      return;
    }
    if (!currentQuestion.correctAnswer) {
      alert("Please select the correct answer.");
      return;
    }
    addCreatedQuestion(currentQuestion);
    setCurrentQuestion({ question: '', answers: ['', '', '', ''], correctAnswer: '' });
  };

  const updateQuestion = (value) => {
    setCurrentQuestion({ ...currentQuestion, question: value });
  };

  const updateOption = (index, value) => {
    const updatedAnswers = [...currentQuestion.answers];
    updatedAnswers[index] = value;
    setCurrentQuestion({ ...currentQuestion, answers: updatedAnswers });
  };

  const selectCorrectAnswer = (aIndex) => {
    const selectedAnswer = currentQuestion.answers[aIndex];
    if (!selectedAnswer.trim()) {
      alert("Please provide an answer before selecting it as correct.");
      return;
    }
    setCurrentQuestion({ ...currentQuestion, correctAnswer: selectedAnswer });
  };

  const selectListAnswer = (qIndex, aIndex, event) => {
    const updatedQuestion = createdQuestions.map((q, i) =>
      i === qIndex ? { ...q, correctAnswer: q.answers[aIndex] } : q
    );

    const buttons = event.target.closest('ul').querySelectorAll('button');
    buttons.forEach((btn) => btn.classList.remove('correctAnswer'));

    event.target.parentNode.classList.add('shake-left-right');
    event.target.classList.add('correctAnswer');
    setTimeout(() => {
      event.target.parentNode.classList.remove('shake-left-right');
    }, 600);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <FaRegQuestionCircle className="mr-2 text-blue-500" /> Create a Quiz
      </h2>

      <div className="border-b pb-4 mb-4">
        <input
          type="text"
          placeholder="Enter your question"
          value={currentQuestion.question}
          onChange={(e) => updateQuestion(e.target.value)}
          className="w-full p-2 border rounded-md focus:ring"
        />
        <div className="mt-2 space-y-2">
          {currentQuestion.answers.map((opt, oIndex) => (
            <div key={oIndex} className="flex items-center space-x-2">
              <input
                type="text"
                placeholder={`Answer ${['A', 'B', 'C', 'D'][oIndex]}`}
                value={opt}
                onChange={(e) => updateOption(oIndex, e.target.value)}
                className="w-full p-2 border rounded-md focus:ring"
              />
              <button
                type="button"
                className={`p-2 rounded-md ${currentQuestion.correctAnswer === opt && opt.trim() !== '' ? 'bg-green-500 text-white' : 'bg-gray-200'
                  }`}
                onClick={() => selectCorrectAnswer(oIndex)}
              >
                ✓
              </button>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap space-x-4 my-4">
          <button onClick={addQuestion} className="btn-primary flex items-center space-x-2">
            <FiPlus /> <span>Add Question</span>
          </button>
          <button onClick={saveQuestions} className="btn-primary flex items-center space-x-2">
            <IoMdSave /> <span>Save Quiz</span>
          </button>
          <button
            onClick={() => setCurrentQuestion({ question: '', answers: ['', '', '', ''], correctAnswer: '' })}
            className="btn-primary flex items-center space-x-2"
          >
            <AiOutlineCaretUp /> <span>Clear</span>
          </button>
          <div className="flex space-x-4">
            <button
              className="btn-primary flex items-center space-x-2"
              onClick={() => document.getElementById('fileInput').click()} // Trigger file input
            >
              <AiFillFile /> <span>Select File</span>
            </button>

            <input
              type="file"
              id="fileInput"
              className="hidden"
              accept="application/pdf, .txt, .docx, .doc, .pptx, .ppt"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (file) {
                  try {
                    await fileToGenerate(file, quizId); // Send file to backend
                  } catch (error) {
                    console.error('Error sending file:', error);
                  }
                }
              }}
            />

            <button
              className={`btn-primary flex items-center space-x-2 
                ${!hasFile ? 'bg-blue-400 before:bg-blue-500 text-white cursor-not-allowed' : ''
                }`}
              // disabled={!hasFile} // Disable until a file has been sent
              onClick={() => generateQuestion('13r0hXk2bPMLUUqESQgKodet7byvXbSJ1')}
            >
              <AiFillBulb /> <span>Generate Question</span>
            </button>
          </div>
        </div>
      </div>

      {createdQuestions.map((question, i) => (
        <div key={i} className="mb-6 relative">
          <button
            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600 m-2"
            onClick={() => removeCreatedQuestion(i)}
          >
            ✕
          </button>
          <p className='rounded-md h-32 md:h-[6.5rem] flex justify-center items-center bg-blue-500 px-5 md:px-10 py-6 text-white text-xl font-semibold mb-3'>
            {question.question}
          </p>
          <ul className={`md:columns-2 mt-4 ${'answers-' + (i + 1)}`}>
            {question.answers.map((answer, j) => (
              <li key={j + answer} className="relative">
                <button className={`${'answer-' + (j + 1)} peer btn-primary w-full shadow-sm pl-12 py-3 px-5 rounded mb-6 ${answer.length > 24 ? 'text-sm' : ''} ${answer === question.correctAnswer ? 'correctAnswer' : ''}`}
                  onClick={(e) => selectListAnswer(i, j, e)}> {answer || '---'} </button>
                <Image className='absolute pointer-events-none left-2 top-1 peer-disabled:translate-y-0 peer-hover:translate-y-[0.25em] peer-active:translate-y-[0.75em] transition-transform z-20 invert' src={`/letters/letter-${['a', 'b', 'c', 'd'][j]}.svg`} width={40} height={40} alt={`Question ${j + 1}]}`} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default QuizQuestionCreator;