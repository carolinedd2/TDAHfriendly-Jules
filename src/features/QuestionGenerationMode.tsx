import { TrailDetail, StudyItemMeta, StudyItem } from "@/types/types";
import React from "react";

// Props for QuestionGenerationMode component
interface QuestionGenerationModeProps {
  trailOrder: string[];
  trailDetails: Record<string, TrailDetail>;
  topicsMeta: StudyItemMeta[];
  loadTopicContentById: (topicId: string) => Promise<StudyItem>;
}

// Example usage of the interface in a functional component
export const QuestionGenerationMode: React.FC<QuestionGenerationModeProps> = ({
  trailOrder,
  trailDetails,
  topicsMeta,
  loadTopicContentById,
}) => {
  // Example usage to avoid unused variable error
  console.log(trailOrder, trailDetails, topicsMeta, loadTopicContentById);

  // Implementing real logic for question generation
  const generateQuestions = async () => {
    const questions = [];
    for (const topic of topicsMeta) {
      const content = await loadTopicContentById(topic.id);
      const keywords = (content?.body ?? '').split(' ').slice(0, 5);

      interface GeneratedQuestion {
        topicId: string;
        question: string;
        alternatives: string[];
      }

      questions.push({
        topicId: topic.id,
        question: `What is the main idea of ${content.title}?`,
        alternatives: [
          ...keywords.map((keyword: string): string => `How does ${keyword} relate to ${content.title}?`),
          `${content.title}` // Correct alternative
        ]
      } as GeneratedQuestion);
    }
    return questions;
  };

  // Example call to generateQuestions
  generateQuestions().then((questions) => console.log(questions));

  // Adding interactive UI and customization
  const [difficulty, setDifficulty] = React.useState('easy');
  interface GeneratedQuestion {
    topicId: string;
    question: string;
    alternatives: string[];
  }
  const [questions, setQuestions] = React.useState<GeneratedQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [timer, setTimer] = React.useState(30);

  React.useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(timer - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleGenerateQuestions = async () => {
    const generatedQuestions = await generateQuestions();
    setQuestions(generatedQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimer(30);
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 1);
    }
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setTimer(30);
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      <h1>Question Generation Mode</h1>
      <label>
        Select Difficulty:
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value='easy'>Easy</option>
          <option value='medium'>Medium</option>
          <option value='hard'>Hard</option>
        </select>
      </label>
      <button onClick={handleGenerateQuestions}>Generate Questions</button>
      {currentQuestion ? (
        <div>
          <h2>Question {currentQuestionIndex + 1}</h2>
          <p>{currentQuestion.question}</p>
          <ul>
            {currentQuestion.alternatives.map((alt, index) => (
              <li key={index}>
                <button onClick={() => handleAnswer(alt === currentQuestion.alternatives[3])}>{alt}</button>
              </li>
            ))}
          </ul>
          <p>Time left: {timer} seconds</p>
          <p>Score: {score}</p>
          {score > 5 && <p>Great job! Keep it up! 🌟</p>}
          {score <= 5 && <p>Don't give up! You can do it! 💪</p>}
        </div>
      ) : (
        <p>No more questions. Your score: {score}</p>
      )}
    </div>
  );
};

export default QuestionGenerationMode;