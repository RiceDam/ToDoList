import Head from 'next/head'
import { supabase } from '../utils/supabaseClient';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Home() {

  const router = useRouter();
  const [user, setUser] = useState(null);
  const [todoList, setTodos] = useState([]);
  const [cross, setCross] = useState(false);

  // On page load, checks if the user is logged in
  // If the user is logged in, proceed to pull all todo items for that user
  // Else, reroute the user to the login page
  useEffect(() => {
    const fetchTodos = async (userId) => {
      let { data: todos, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', userId);
      setTodos(todos);
    }
    const getUser = () => {
      const profile = supabase.auth.user();
      if (profile) {
        setUser(profile);
        fetchTodos(profile.id);
      } else {
        router.push('/signin');
      }
    }
    getUser();
  }, []);

  // Function to show an option menu on list item click
  const showDiv = (e) => {
    const style = e.target.parentElement.children[1].style;
    if (style.display === "none") {
      style.display = "flex";
      style.flexDirection = "row";
      style.justifyContent = "space-between";
    } else {
      style.display = 'none';
    }
  }

  // Function to sign out a user
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert(JSON.stringify({ error }));
    } else {
      router.push('/signin');
    }
  }

  // Button to toggle the crossing out of tasks
  const toggleCross = () => {
    if (cross) {
      setCross(false);
    } else {
      setCross(true);
    }
  }

  // Function to cross out or uncross an todo item
  const crossOut = async (e, todo_id) => {
    if (e.target.style.textDecoration === 'line-through') {
      e.target.style.textDecoration = 'none';
      const { data, error } = await supabase
        .from('todos')
        .update({ isDone: false})
        .match({ id: todo_id });
    } else {
      e.target.style.textDecoration = 'line-through';
      const { data, error } = await supabase
        .from('todos')
        .update({ isDone: true})
        .match({ id: todo_id });
    }
  }

  return (
    <div className="todo-container">
      <Head>
        <title>To-Do List</title>
        <meta name="description" content="A to-do list created by Eric" />
      </Head>

      <main className='todo-div'>
        <button onClick={() => logout()}>Sign Out</button>
        <h1>To-Do List</h1>
        <nav>
          <button onClick={() => toggleCross()}>{cross ? "Cancel" : "Cross Items"}</button>
        </nav>
        <ol id='todo-list'>
          {todoList.map((item) => {
            return <li key={item.id} >
              {cross
                ? <div 
                  className='content' 
                  onClick={(e) => crossOut(e, item.id)}
                  style={{textDecoration: item.isDone ? 'line-through': 'none'}}
                >
                  {item.name}
                </div>
                :
                <div 
                  className='content' 
                  onClick={showDiv}
                  style={{textDecoration: item.isDone ? 'line-through': 'none'}}
                >
                  {item.name}
                  <span className='hidden right'>&#9660;</span>
                </div>
              }
              <div className='dropdown' style={{ display: "none" }}>
                <Link href={{
                  pathname: '/edit-todo/[id]',
                  query: { id: item.id }
                }}>Edit</Link>
                <Link href={{
                  pathname: '/delete-todo/[id]',
                  query: { id: item.id }
                }}>Delete</Link>
              </div>
            </li>
          })}
        </ol>
      </main>
      <button id="add-button" onClick={(e) => router.push('/add-todo')}>+</button>
    </div >
  )
}
