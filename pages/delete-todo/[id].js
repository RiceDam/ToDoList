import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../utils/supabaseClient';

// Deletes a todo item based on id
export default function DeleteTodo() {
    const router = useRouter();
    const { id } = router.query;
    const [name, setName] = useState('');

    // On page load fetch todo item based on id
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

    // Function that attempts to delete a todo item
    // On success reroutes to main page
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase
            .from('todos')
            .delete()
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
                <label>
                    {name}
                </label>
                <div>
                    <button onClick={(e) => {
                        e.preventDefault();
                        router.push('/')
                    }}>
                        Cancel
                    </button>
                    <button type='submit'>Delete</button>
                </div>
            </form>
        </div>
    );
}