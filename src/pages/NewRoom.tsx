import { push, ref } from "firebase/database";
import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { db } from "../services/firebase";
import { useAuth } from "../hooks/useAuth";

import { useNavigate } from "react-router-dom";

export function NewRoom() {
    const { user } = useAuth();
    const history = useNavigate();

    const [newRoom, setNewRoom] = useState('');

    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault();

        if (newRoom.trim() === '') {
            return;
        }

        const roomRef = ref(db, 'rooms');

        const firebaseRoom = await push(roomRef, {
            title: newRoom,
            authorId: user?.id,
        });

        history(`/rooms/${firebaseRoom.key}`)
        setNewRoom("");
    }

    return (
        <div className="flex items-stretch h-screen">
            <aside className="hidden lg:flex-1 bg-[#835afd] text-white lg:flex flex-col justify-center py-32 px-20">
                <img src="/images/illustration.svg" alt="Ilustração perguntas e respostas" className="max-w-xs" />
                <strong className="font-bold text-3xl mt-4">Crie salas de Q&amp;A ao vivo</strong>
                <p className="text-xl mt-4 text-[#f8f8f8]">Tire as dúvidas da sua audiência em tempo real</p>
            </aside>
            <main className="flex-1 pt-0 px-8 flex items-center justify-center">
                <div className="flex flex-col w-full max-w-xs items-stretch text-center">
                    <img src="/images/logo.svg" alt="Logo LetMeAsk" className="self-center" />
                    <h2 className="text-2xl mt-16 mx-0 mb-6 font-Poppins font-bold dark:text-white">Criar uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input 
                            type='text'
                            placeholder='Digite o nome da sala'
                            className="h-12 w-full rounded-lg pt-0 px-4 bg-[#FFF] border-2 border-solid"
                            onChange={event => setNewRoom(event.target.value)}
                            value={newRoom}
                        />
                        <Button className="w-full mt-8 flex h-[50px] rounded-lg font-medium bg-[#835afd] text-[#FFF] pt-0 px-8 justify-center items-center cursor-pointer border-0 transition ease-in-out hover:-translate-y-1 hover:bg-indigo-600 duration-300 disabled:cursor-not-allowed disabled:opacity-60">
                            Criar sala
                        </Button>
                    </form>
                    <p className="text-sm text-[#737380] dark:text-slate-200 mt-4">
                        Quer entrar em uma sala existente? <Link to="/" className="text-[#e559f9] hover:underline">clique aqui</Link>
                    </p>
                </div>
            </main>
        </div>
    )
}