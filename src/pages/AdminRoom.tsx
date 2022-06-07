import { ref, remove, update } from "firebase/database";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/Button";
import { Question } from "../components/Question";
import { RoomCode } from "../components/RoomCode";
import { useRoom } from "../hooks/useRoom";
import { useTheme } from "../hooks/useTheme";
import { db } from "../services/firebase";
import { BsFillLightbulbFill } from 'react-icons/bs'
import { MdDarkMode } from 'react-icons/md'

type RoomParams = {
    id: string;
}

export function AdminRoom() {
    const history = useNavigate()
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const { theme, setTheme } = useTheme();

    const { title, questions } = useRoom(roomId);

    async function handleEndRoom() {
        const roomRef = ref(db, `rooms/${roomId}`)

        await update(roomRef, {
            endedAt: new Date(),
        })

        history('/');
    }

    async function handleDeleteQuestion(questionId: string) {
        if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
            await remove(ref(db, `rooms/${roomId}/questions/${questionId}`))
        }
    }

    async function handleCheckQuestionAsAnswered(questionId: string) {
        await update(ref(db, `rooms/${roomId}/questions/${questionId}`), {
            isAnswered: true,
        })
    }

    async function handleHighlightQuestion(questionId: string) {
        await update(ref(db, `rooms/${roomId}/questions/${questionId}`), {
            isHighlighted: true,
        })
    }

    return (
        <div>
            <header className="p-6 border border-solid border-[#e2e2e2] dark:border-slate-800">
                <div className="max-w-[1128px] px-2 sm:px-0 m-auto pt-2 sm:pt-0 sm:flex sm:justify-between items-center">
                    <img src="/images/logo.svg" alt="Letmeask" className="max-h-[45px] px-28 sm:px-0" />
                        <div className='flex space-x-2 pb-4 pt-4 px-16 sm:pt-0 sm:pb-0 sm:px-0 cursor-pointer'>
                            <span className='text-lg font-bold font-Poppins text-[#29292e] dark:text-white'>Trocar tema:</span>
                            { theme === "light" ? (
                                <MdDarkMode size={30} className='cursor-pointer dark:text-white' onClick={() => setTheme("dark")} />
                            ) : (
                                <BsFillLightbulbFill size={30} className='cursor-pointer dark:text-white' onClick={() => setTheme("light")} />
                            ) }
                        </div>
                    <div className="flex flex-wrap gap-4 pt-4 mx-2 sm:mx-0 sm:pt-0">
                        <RoomCode code={`${roomId}`} />
                        <Button
                            className="h-12 mx-20 mt-2 sm:mx-0 sm:mt-0 rounded-lg font-medium bg-[#FFF] text-[#835afd] outline pt-0 px-8 justify-center items-center cursor-pointer border-0 transition ease-in-out hover:-translate-y-1 duration-300"
                            onClick={handleEndRoom}
                        >
                            Encerrar Sala
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-[800px] m-auto">
                <div className="mt-8 mr-0 mb-6 items-center justify-center sm:justify-start sm:pl-3 md:justify-start flex">
                    <h1 className="font-Poppins font-bold text-xl lg:text-2xl text-[#29292e] dark:text-white">Sala {title}</h1>
                    { questions.length > 0 && <span className="ml-4 bg-[#e559f9] rounded-full pt-2 pr-4 pl-4 pb-2 text-[#FFF] font-medium text-sm justify-center text-center">{questions.length} pergunta(s)</span> }
                </div>
                
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
                                {!question.isAnswered && (
                                <>
                                <button
                                    type="button"
                                    onClick={() => handleCheckQuestionAsAnswered(question.id)}
                                >
                                    <img src="/images/check.svg" alt="Marcar pergunta como respondida" />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleHighlightQuestion(question.id)}
                                >
                                    <img src="/images/answer.svg" alt="Dar destaque à pergunta" />
                                </button>
                                </>
                                )}
                                
                                <button
                                    type="button"
                                    onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    <img src="/images/delete.svg" alt="Deletar pergunta" />
                                </button>
                            </Question>
                        )
                    })}
                </div>
            </main>
        </div>
    );
}