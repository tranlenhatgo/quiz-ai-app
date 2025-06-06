import CryptoJS from 'crypto-js';

export default async function handler(req, res) {
   if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Only POST requests allowed', statusCode: 405 });
   }

   const { id, name } = req.body;

   if (!id || !name) {
      return res.status(400).json({ message: 'ID and Name are required', statusCode: 400 });
   }

   try {
      // Fetch questions from the external REST API
      const response = await fetch(`${process.env.REST_API_URL}/question?quizId=${id}`, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
         },
      });

      if (!response.ok) {
         const errorData = await response.json();
         return res.status(response.status).json({
            message: errorData.message || 'Failed to fetch questions',
            statusCode: response.status,
         });
      }

      const data = await response.json();

      // Encrypt the correctAnswer field in each question
      const encryptionKey = process.env.ANSWER_ENCRYPTION_KEY; // Ensure this is set in your .env file
      const encryptedData = data.map(question => ({
         ...question,
         correctAnswer: CryptoJS.AES.encrypt(question.correctAnswer, encryptionKey).toString(),
      }));

      return res.status(200).json(encryptedData); // Return the data with encrypted correctAnswer
   } catch (error) {
      console.error('Error fetching questions:', error);
      return res.status(500).json({
         message: 'Internal Server Error',
         statusCode: 500,
      });
   }
}