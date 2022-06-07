import { get, ref } from "firebase/database";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import { db } from "../services/firebase";


export function Home() {
    const history = useNavigate();
    const { user, signInWithGoogle } = useAuth();
    const [roomCode, setRoomCode] = useState('');

    async function handleCreateRoom() {
        if (!user) {
            await signInWithGoogle()
        }

        history('/rooms/new');
    }

    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault();

        if (roomCode.trim() === '') {
            return;
        }

        const roomRef = await get(ref(db, `rooms/${roomCode}`))

        if (!roomRef.exists()) {
            alert('Room does not exists.');
            return;
        }

        if (roomRef.val().endedAt) {
            alert('Room already closed.');
            return;
        }

        history(`/rooms/${roomCode}`);
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
                    <button onClick={handleCreateRoom} className="mt-16 h-[50px] rounded-lg font-medium bg-[#ea4335] text-[#FFF] flex justify-center items-center cursor-pointer border-0 transition ease-in-out hover:-translate-y-1 hover:bg-red-500 duration-300">
                        <img src="/images/google-icon.svg" alt="Logo do Google" className="mr-2" />
                        Crie a sua sala com o Google
                    </button>
                    <div className="text-sm md:text-2xl lg:text-sm text-[#a8a8b3] mt-8 mx-0 flex items-center before:flex-1 before:h-[1px] before:bg-[#a8a8b3] before:mr-4 after:flex-1 after:h-[1px] after:bg-[#a8a8b3] after:ml-4">ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input 
                            type='text'
                            placeholder='Digite o código da sala'
                            className="h-12 w-full rounded-lg pt-0 px-4 bg-[#FFF] border-2 border-solid"
                            onChange={event => setRoomCode(event.target.value)}
                            value={roomCode}
                        />
                        <Button className="w-full mt-8 flex h-[50px] rounded-lg font-medium bg-[#835afd] text-[#FFF] pt-0 px-8 justify-center items-center cursor-pointer border-0 transition ease-in-out hover:-translate-y-1 hover:bg-indigo-600 duration-300 disabled:cursor-not-allowed disabled:opacity-60">
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}