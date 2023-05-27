import React, { useEffect, useState } from 'react';

import { app } from '../config/firebase.config';
import {
	getAuth,
	GoogleAuthProvider,
	signInWithPopup,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from 'firebase/auth';

import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';

import { useStateValue } from '../context/StateProvider';
import { validateUser } from '../api';
import { actionType } from '../context/reducer';

import { LoginBg } from '../assets/video';

import ErrorMessage from './ErrorMessage'; // import the new component

const Login = ({ setAuth }) => {
	const firebaseAuth = getAuth(app);
	const provider = new GoogleAuthProvider();

	const navigate = useNavigate();

	const [{ user }, dispatch] = useStateValue();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const [loginEmail, setLoginEmail] = useState('');
	const [loginPassword, setLoginPassword] = useState('');

	const [error, setError] = useState(null); // add state for error message

	const handleEmailChange = (event) => {
		setEmail(event.target.value);
	};

	const handlePasswordChange = (event) => {
		setPassword(event.target.value);
	};

	const handleLoginEmailChange = (event) => {
		setLoginEmail(event.target.value);
	};

	const handleLoginPasswordChange = (event) => {
		setLoginPassword(event.target.value);
	};

	const createAccount = async () => {
		try {
			// Validate that all required fields have been filled out
			if (!email || !password) {
				throw new Error('Please fill out all required fields');
			}

			// Create the user account
			const userCredential = await createUserWithEmailAndPassword(
				firebaseAuth,
				email,
				password
			);
			const user = userCredential.user;

			// Navigate to the home page
			navigate('/', { replace: true });
		} catch (error) {
			if (error.code === 'auth/email-already-in-use') {
				// Set error message
				setError('Email is already in use');
			} else if (error.message === 'Please fill out all required fields') {
				// Set error message
				setError('Please fill in both the email and the password');
			}
		}
	};

	const login = async () => {
		try {
			// Validate that all required fields have been filled out
			if (!loginEmail || !loginPassword) {
				throw new Error('Please fill out all required fields');
			}

			// Log the user in
			const userCredential = await signInWithEmailAndPassword(
				firebaseAuth,
				loginEmail,
				loginPassword
			);
			const user = userCredential.user;

			// Navigate to the home page
			navigate('/', { replace: true });
		} catch (error) {
			if (error.code === 'auth/user-not-found') {
				// Set error message
				setError('User not found. Please check your email and password.');
			} else if (error.code === 'auth/wrong-password') {
				// Set error message
				setError('Incorrect password. Please check your email and password.');
			} else if (error.message === 'Please fill out all required fields') {
				// Set error message
				setError('Please fill in both the email and the password');
			}
		}
	};

	const loginWithGoogle = async () => {
		await signInWithPopup(firebaseAuth, provider).then((userCred) => {
			if (userCred) {
				setAuth(true);
				window.localStorage.setItem('auth', 'true');

				firebaseAuth.onAuthStateChanged((userCred) => {
					if (userCred) {
						userCred.getIdToken().then((token) => {
							validateUser(token).then((data) => {
								dispatch({
									type: actionType.SET_USER,
									user: data,
								});
							});
						});
						navigate('/', { replace: true });
					} else {
						setAuth(false);
						dispatch({
							type: actionType.SET_USER,
							user: null,
						});
						navigate('/login');
					}
				});
			}
		});
	};

	useEffect(() => {
		if (window.localStorage.getItem('auth') === 'true') {
			navigate('/', { replace: true });
		}
	});

	return (
		<div className="relative w-screen h-screen">
			<video
				src={LoginBg}
				type="video/mp4"
				autoPlay
				muted
				loop
				className="w-full h-full object-cover"
			/>

			<div className="absolute inset-0 bg-darkOverlay flex items-center justify-center p-4">
				<div
					className="w-full md:w-375 p-4 bg-darkOverlay shadow-2xl rounded-md backdrop-blur-md flex 
              flex-col items-center justify-center mr-4">
					<div className="flex flex-col">
						<h2 className="font-semibold font-sans text-xl text-center text-amber-400 mb-2 underline">
							SIGN IN
						</h2>
						<label
							htmlFor="loginEmail"
							className="font-semibold font-sans text-amber-400">
							Email:
						</label>
						<input
							type="email"
							id="loginEmail"
							name="loginEmail"
							value={loginEmail}
							onChange={handleLoginEmailChange}
							required
						/>
					</div>

					<div className="flex flex-col">
						<label
							htmlFor="loginPassword"
							className="font-semibold text-amber-400 font-sans">
							Password:
						</label>
						<input
							type="password"
							id="loginPassword"
							name="loginPassword"
							value={loginPassword}
							onChange={handleLoginPasswordChange}
							required
						/>

						<button
							onClick={login}
							className="bg-amber-400 hover:bg-neutral-300 text-zinc-800 font-semibold font-sans py-2 px-4 rounded mt-4">
							Sign in
						</button>
					</div>
					<h2 className="font-bold text-xl text-center text-amber-400 mt-2">
						----- OR -----
					</h2>

					<div
						className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-cardOverlay 
            cursor-pointer hover:bg-card hover:shadow-md duration-100 ease-in-out transition-all mt-4"
						onClick={loginWithGoogle}>
						<FcGoogle className="text-xl" />
						Continue with Google
					</div>
				</div>

				<div
					className="w-full md:w-375 p-4 bg-darkOverlay shadow-2xl rounded-md backdrop-blur-md flex 
    flex-col items-center justify-center">
					<div className="flex flex-col items-center justify-center gap-4 mt-4">
						<h2 className="font-semibold font-sans text-xl text-center text-amber-400 underline">
							CREATE ACCOUNT
						</h2>
						<div className="flex flex-col">
							<label
								htmlFor="email"
								className="font-semibold font-sans text-amber-400">
								Email:
							</label>
							<input
								type="email"
								id="email"
								name="email"
								value={email}
								onChange={handleEmailChange}
								required
							/>
						</div>
						<div className="flex flex-col">
							<label
								htmlFor="password"
								className="font-semibold font-sans text-amber-400">
								Password:
							</label>
							<input
								type="password"
								id="password"
								name="password"
								value={password}
								onChange={handlePasswordChange}
								required
							/>
						</div>

						<button
							onClick={createAccount}
							className="bg-amber-400 hover:bg-neutral-300 text-zinc-800 font-semibold py-2 px-4 rounded font-sans">
							Sign up
						</button>
					</div>
				</div>
			</div>
			{error && (
				<div className="absolute top-10 left-0 right-0 flex items-center justify-center">
					<ErrorMessage message={error} />
				</div>
			)}
		</div>
	);
};

export default Login;
