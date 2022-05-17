import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../utils/supabaseClient';

export default function EditTodo() {
    const router = useRouter();
    const { id } = router.query;
    const [name, setName] = useState('');

    useEffect(() => {
        const fetchTodo = async (todo_id)  => {
            let { data: todos, error } = await supabase
                .from('todos')
                .select('*')
                .eq('id', todo_id);
            setName(todos[0].name);
        }
        fetchTodo(id); 
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase
            .from('todos')
            .update({ name: name})
            .match({ id: id });
        if (error) {
            alert(JSON.stringify(error));
        } else {
            router.push('/');
        }
    }

    return (
        <div className='container'>
            <h1>Do you want to delete this item?</h1>
            <form onSubmit={handleSubmit} className="inputForm">
                <label htmlFor='name'>
                    Name
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <div>
                    <button onClick={(e) => {
                        e.preventDefault();
                        router.push('/')
                    }}>
                        Cancel
                    </button>
                    <button type='submit'>Update</button>
                </div>
            </form>
        </div>
    );
}