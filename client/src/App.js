import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import {
	Dashboard,
	Home,
	Login,
	MusicPlayer,
	PageNotFound,
} from './components';
import ArtistInfo from './components/ArtistInfo';
import { app } from './config/firebase.config';

import { getAuth } from 'firebase/auth';

import { AnimatePresence, motion } from 'framer-motion';
import { validateUser } from './api';
import { useStateValue } from './context/StateProvider';
import { actionType } from './context/reducer';
import AboutUs from './components/AboutUs';
import UserProfile from './components/UserProfile';

const App = () => {
	const firebaseAuth = getAuth(app);
	const navigate = useNavigate();

	const [{ user, isSongPlaying }, dispatch] = useStateValue();

	console.log(user);

	const [auth, setAuth] = useState(
		false || window.localStorage.getItem('auth') === 'true'
	);

	useEffect(() => {
		firebaseAuth.onAuthStateChanged((userCred) => {
			if (userCred) {
				console.log(userCred);
				userCred.getIdToken().then((token) => {
					// console.log(token); instead of this you can just validate the user as shown below.
					validateUser(token).then((data) => {
						dispatch({
							type: actionType.SET_USER,
							user: data,
						});
						// if (!data.isAdmin) {
						// 	navigate('/');
						// }
					});
				});
			} else {
				setAuth(false);
				window.localStorage.setItem('auth', 'false');
				dispatch({
					type: actionType.SET_USER,
					user: null,
				});
				navigate('/login');
			}
		});
	}, []);

	return (
		<AnimatePresence exitBeforeEnter>
			<div className="h-auto min-w-[680px] bg-primary flex justify-center items-center">
				<Routes>
					<Route path="/login" element={<Login setAuth={setAuth} />} />
					<Route path="/" element={<Home />} />
					<Route path="/home" element={<Home />} />
					{user !== null && user['user'].role === 'admin' && (
						<Route path="/dashboard/*" element={<Dashboard />} />
					)}
					<Route path="/artist-info" element={<ArtistInfo />} />
					<Route path="/about-us" element={<AboutUs />} />
					<Route path="/user-profile" element={<UserProfile />} />
					<Route path="*" element={<PageNotFound />} />
				</Routes>

				{isSongPlaying && (
					<motion.div
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						className={`fixed min-w-[700px] h-26 inset-x-0 bottom-0 bg-cardOverlay drop-shadow-2xl backdrop-blur-md flex items-center justify-center`}>
						<MusicPlayer />
					</motion.div>
				)}
			</div>
		</AnimatePresence>
	);
};

export default App;
