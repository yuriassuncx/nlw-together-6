import { push, ref, remove } from "firebase/database";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { Button } from "../components/Button";
import { Question } from "../components/Question";
import { RoomCode } from "../components/RoomCode";
import { useAuth } from "../hooks/useAuth";
import { useRoom } from "../hooks/useRoom";
import { db } from "../services/firebase";
import { BsFillLightbulbFill } from 'react-icons/bs'
import { MdDarkMode } from 'react-icons/md'
import { useTheme } from "../hooks/useTheme";

type RoomParams = {
    id: string;
}

export function Room() {
    const { user } = useAuth();
    const params = useParams<RoomParams>();
    const { theme, setTheme } = useTheme();
    const [newQuestion, setNewQuestion] = useState('');
    const roomId = params.id;

    const { title, questions } = useRoom(roomId);
    
    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault();

        if (newQuestion.trim() === '') {
            return;
        }

        if (!user) {
            toast.error("Você precisa estar logado!")
        }

        const roomRef = ref(db, `rooms/${roomId}/questions`);

        const firebaseQuestion = await push(roomRef, {
            content: newQuestion,
            author: {
                name: user?.name,
                avatar: user?.avatar,
            },
            isHighlighted: false,
            isAnswered: false,
        })

        await firebaseQuestion;
        setNewQuestion("");
    }

    async function handleLikeQuestion(questionId: string, likeId: string | undefined) {

        if (likeId) {
            const newLike = ref(db, `rooms/${roomId}/questions/${questionId}/likes/${likeId}`);
    
            const newLikeFunction = await remove(newLike)
            await newLikeFunction

        } else {
            const newLike = ref(db, `rooms/${roomId}/questions/${questionId}/likes`);
    
            const newLikeFunction = await push(newLike, {
                authorId: user?.id,
            })
    
            await newLikeFunction
        }
    }

    return (
        <div>
            <header className="p-6 border border-solid border-[#e2e2e2] dark:border-slate-800">
                <div className="max-w-[1128px] px-4 sm:px-0 m-auto flex-wrap sm:flex sm:justify-between items-center">
                    <img src="/images/logo.svg" alt="Letmeask" className="max-h-[45px] px-28 pb-2 lg:pb-0 sm:px-0" />
                    <div className='flex space-x-2 pb-4 px-16 sm:pb-0 sm:px-0 cursor-pointer'>
                        <span className='text-lg font-bold font-Poppins text-[#29292e] dark:text-white'>Trocar tema:</span>
                        { theme === "light" ? (
                            <MdDarkMode size={30} className='cursor-pointer dark:text-white' onClick={() => setTheme("dark")} />
                        ) : (
                            <BsFillLightbulbFill size={30} className='cursor-pointer dark:text-white' onClick={() => setTheme("light")} />
                        ) }
                    </div>
                    <RoomCode code={`${roomId}`} />
                </div>
            </header>

            <main className="max-w-[800px] m-auto">
                <div className="mt-8 mr-0 mb-6 items-center justify-center sm:justify-start sm:pl-3 md:justify-start flex">
                    <h1 className="font-Poppins font-bold text-xl lg:text-2xl text-[#29292e] dark:text-white">Sala {title}</h1>
                    { questions.length > 0 && <span className="ml-4 bg-[#e559f9] rounded-full pt-2 pr-4 pl-4 pb-2 text-[#FFF] font-medium text-sm justify-center text-center">{questions.length} pergunta(s)</span> }
                </div>

                <form onSubmit={handleSendQuestion}>
                    <textarea
                        placeholder='O que você quer perguntar?'
                        className="w-full lg:w-full border-0 p-4 rounded-lg bg-[#fefefe] shadow-xl resize-y min-h-[130px]"
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />

                    <div className="flex justify-between items-center mt-4">
                        { user ? (
                            <div className='flex items-center mx-2 sm:mx-0'>
                                <img src={user.avatar} alt={user.name} className='w-8 h-8 rounded-xl' />
                                <span className="ml-2 text-[#29292e] dark:text-slate-300 font-medium text-sm">{user.name}</span>
                            </div>
                        ) : (
                            <span className="text-sm text-[#737380] dark:text-white font-medium">Para enviar uma pergunta, <button className="text-[#835AFD] font-medium hover:underline">faça seu login.</button></span>
                        ) }
                        <Button disabled={!user} className="h-[50px] mx-2 sm:mx-0 rounded-lg font-medium bg-[#835afd] text-[#FFF] pt-0 px-8 justify-center items-center cursor-pointer border-0 transition ease-in-out hover:-translate-y-1 hover:bg-indigo-600 duration-300 disabled:cursor-not-allowed disabled:opacity-60">Enviar pergunta</Button>
                    </div>
                </form>
                
                <div className="mt-16 sm:mt-8">
                    {questions.map(question => {
                        return (
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.author}
                                isAnswered={question.isAnswered}
                                isHighlighted={question.isHighlighted}
                            >
                                { !question.isAnswered && (
                                    <button
                                        type="button"
                                        aria-label="Marcar como gostei"
                                        onClick={() => handleLikeQuestion(question.id, question.likeId)}
                                        className='border-0 bg-transparent cursor-pointer flex items-end text-[#737388] gap-2 hover:brightness-75 transition-shadow'
                                    >
                                        { question.likeCount > 0 && <span className={`text=[#737388] ${question.likeId && "text-[#835afd]"}`}>{question.likeCount}</span> }
                                        { question.likeId ? (
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#835afd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        ) : (
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        ) }
                                    </button>
                                )}
                            </Question>
                        )
                    })}
                </div>
            </main>
        </div>
    );
}