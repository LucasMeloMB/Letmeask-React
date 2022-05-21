import ilustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import '../styles/auth.scss';
import { Button } from '../components/Button';
import { Link, useHistory } from 'react-router-dom';
import { FormEvent, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import { child, push, ref, set } from 'firebase/database';

export function NewRoom() {
    const { user } = useAuth();
    const [newRoom, setNewRoom] = useState('');
    const history = useHistory();

    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault();
        if (newRoom.trim() === '') return;
        const roomData = {
            title: newRoom,
            authorId: user?.id,
        };
        const firebaseRoom = await push(
            child(ref(database), 'rooms'),
            roomData
        );
        history.push(`/rooms/${firebaseRoom.key}`);
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
                    <h2>Criar uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input
                            type='text'
                            placeholder='Nome da sala'
                            onChange={(event) => setNewRoom(event.target.value)}
                            value={newRoom}
                        />
                        <Button type='submit'>Criar sala</Button>
                    </form>
                    <p>
                        Quer entrar em uma sala existente?{' '}
                        <Link to='/'>clique aqui</Link>
                    </p>
                </div>
            </main>
        </div>
    );
}
