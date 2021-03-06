import ilustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';
import '../styles/auth.scss';
import { Button } from '../components/Button';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FormEvent, useState } from 'react';
import { get, ref } from 'firebase/database';
import { database } from '../services/firebase';
import toast from 'react-hot-toast';

export function Home() {
    const history = useHistory();
    const { user, signInWithGoogle } = useAuth();
    const [roomCode, setRoomCode] = useState('');

    async function handleCreateRoom() {
        if (!user) await signInWithGoogle();
        history.push('/rooms/new');
    }

    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault();
        if (roomCode.trim() === '') return;

        const RoomRef = await get(ref(database, 'rooms/' + roomCode));
        if (!RoomRef.exists()) {
            toast.error('Room does not exist!');
            return;
        }
        history.push(`/rooms/${roomCode}`);
    }

    return (
        <div id='page-auth'>
            <aside>
                <img src={ilustrationImg} alt='ilustração' />
                <strong>Crie salas de Q&amp;A ao vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo real</p>
            </aside>
            <main>
                <div className='main-content'>
                    <img src={logoImg} alt='letmeask' />
                    <button onClick={handleCreateRoom} className='create-room'>
                        <img src={googleIconImg} alt='google' />
                        Crie sua sala com o Google
                    </button>
                    <div className='separator'>ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input
                            type='text'
                            placeholder='Digite o código da sala'
                            onChange={(event) =>
                                setRoomCode(event.target.value)
                            }
                            value={roomCode}
                        />
                        <Button type='submit'>Entrar na sala</Button>
                    </form>
                </div>
            </main>
        </div>
    );
}
