import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';

export default function AddTodo() {
    const router = useRouter();
    const [name_text, setName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (name_text.length === 0) {
            alert("Please enter a value for the name");
        } else {
            const user = await supabase.auth.user();
            const { data, error } = await supabase
                .from('todos')
                .insert([
                    { name: name_text, isDone: false, user_id: user.id },
                ]);
            if (error) {
                alert(JSON.stringify(error));
            } else {
                router.push('/');
            }
        }
    }

    return (
        <div className='container'>
            <h1>Add a todo item to the list</h1>
            <form onSubmit={handleSubmit} className="inputForm">
                <label htmlFor='name_text'>
                    Name
                </label>
                <input
                    type="text"
                    id="name"
                    value={name_text}
                    onChange={(e) => setName(e.target.value)}
                />
                <div>
                    <button onClick={(e) => {
                        e.preventDefault();
                        router.push('/')
                    }}>
                        Cancel
                    </button>
                    <button type='submit'>Add</button>
                </div>
            </form>
        </div>
    );
}