import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';
import Link from 'next/link';

export default function SignUp() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Function that attempts to sign up a user
    // If successful, reroutes to the sign in page
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            alert(JSON.stringify(error));
        } else {
            router.push('/signin');
        }
    }

    return (
        <div className='container'>
            <h1>Create a New Account</h1>
            <form onSubmit={handleSubmit} className="inputForm">
                <label htmlFor='email'>
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label htmlFor='password'>
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit">Sign up</button>
            </form>
            <Link href="/signin"><a>Have an account? Sign in</a></Link>
        </div>
    )
}