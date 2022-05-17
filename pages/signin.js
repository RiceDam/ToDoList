import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';
import Link from 'next/link';

export default function SignIn() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Function that attempts to login a user
    // If successful, reroutes to the main page
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { error } = await supabase.auth.signIn({
            email,
            password,
        });

        if (error) {
            alert(JSON.stringify(error));
        } else {
            router.push('/');
        }
    }

    return (
        <div className="container">
            <h1>Sign In to Your Account</h1>
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

                <button type="submit">Sign In</button>
            </form>
            <Link href="/signup"><a>Don&apos;t have an account? Create one</a></Link>
        </div>
    )
}