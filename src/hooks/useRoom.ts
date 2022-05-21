import { onValue, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { database } from '../services/firebase';

type QuestionType = {
    id: string;
    author: {
        name: string;
        avatar: string;
    };
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
};

type FirebaseQuestions = Record<
    string,
    {
        author: {
            name: string;
            avatar: string;
        };
        content: string;
        isAnswered: boolean;
        isHighlighted: boolean;
    }
>;

export function useRoom(roomId: string) {
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState<QuestionType[]>([]);

    useEffect(() => {
        const roomRef = ref(database, `rooms/${roomId}`);
        onValue(roomRef, (room) => {
            const databaseRoom = room.val();
            const firebaseQuestions: FirebaseQuestions =
                databaseRoom.questions ?? {};
            const parsedQuestions = Object.entries(firebaseQuestions).map(
                ([key, value]) => {
                    return {
                        id: key,
                        author: value.author,
                        content: value.content,
                        isAnswered: value.isAnswered,
                        isHighlighted: value.isHighlighted,
                    };
                }
            );
            setTitle(databaseRoom.title);
            setQuestions(parsedQuestions);
        });
    }, [roomId]);

    return { title, questions };
}
