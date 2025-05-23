export default async function getQuestionsByQuizId(id, name) {
   if (!id) {
      throw new Error('ID is required to fetch questions');
   }
   if (!name) {
      throw new Error('Name is required to fetch questions');
   }
   try {
      const response = await fetch('/api/question/quiz-questions', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({ id, name }), 
      });

      if (!response.ok) {
         const errorData = await response.json();
         throw new Error(errorData.message || 'Failed to fetch questions');
      }

      const data = await response.json();
      return data; 
   } catch (error) {
      console.error('Error fetching questions by ID:', error);
      throw error; 
   }
}
