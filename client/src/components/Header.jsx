import React, { useState } from 'react';
import { NavLink, useNavigate, Routes, Route } from 'react-router-dom';

import { Logo, Logo2 } from '../assets/img';
import { isActiveStyles, isNotActiveStyles } from '../utils/styles';
import { useStateValue } from '../context/StateProvider';

import { getAuth } from 'firebase/auth';
import { app } from '../config/firebase.config';

import { motion } from 'framer-motion';

const Header = () => {
	const [{ user }, dispatch] = useStateValue();

	const navigate = useNavigate();
	const [isMenu, setisMenu] = useState(false);

	const logOut = () => {
		const firebaseAuth = getAuth(app);
		firebaseAuth
			.signOut()
			.then(() => {
				window.localStorage.setItem('auth', 'false');
			})
			.catch((e) => console.log(e));
		navigate('/login', { replace: true });
	};

	return (
		<header className="flex items-center w-full p-4 md:py-0 md:px-6 bg-amber-400">
			<NavLink to={'/'}>
				<img src={Logo2} alt="MelloAmp Logo with lightning" className="w-40" />
			</NavLink>

			<ul className="flex items-center justify-center ml-7">
				<li className="mx-5 text-lg">
					<NavLink
						to={'/home'}
						className={({ isActive }) =>
							isActive ? isActiveStyles : isNotActiveStyles
						}>
						Home
					</NavLink>
				</li>

				<li className="mx-5 text-lg">
					<NavLink
						to={'/artist-info'}
						className={({ isActive }) =>
							isActive ? isActiveStyles : isNotActiveStyles
						}>
						Artist Info
					</NavLink>
				</li>

				<li className="mx-5 text-lg">
					<NavLink
						to={'/about-us'}
						className={({ isActive }) =>
							isActive ? isActiveStyles : isNotActiveStyles
						}>
						About Us
					</NavLink>
				</li>
			</ul>

			<div
				onMouseEnter={() => setisMenu(true)}
				onMouseLeave={() => setisMenu(false)}
				className="flex items-center ml-auto cursor-pointer gap-2 relative">
				<img
					src={user?.user?.imageURL || 'https://firebasestorage.googleapis.com/v0/b/projectmelloamp.appspot.com/o/Images%2FDefault%20Pic.jpg?alt=media&token=1a75ef66-f0f2-4722-b0d0-c018035391cc'}

					className="w-12 h-12 min-w-[44px] object-cover rounded-full shadow-lg"
					alt="This is to display their google image when logged in"
					referrerPolicy="no-referrer"
				/>
				<div className="flex flex-col">
					<p className="text-lg hover:text-headingColor font-semibold">
					{user?.user?.name || user?.user.email.split("@")[0]}
					</p>
				</div>

				{isMenu && (
					<motion.div
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 50 }}
						className="absolute z-10 top-12 p-3 right-0 w-275 gap-2 bg-card shadow-lg rounder-lg backdrop-blur-sm flex flex-col">
						<NavLink to={'/user-profile'}>
							<p className="text-base hover:font-semibold duration-150 transition-all ease-in-out">
								Profile
							</p>
						</NavLink>
						<p className="text-base hover:font-semibold duration-150 transition-all ease-in-out">
							Favorites
						</p>

						<hr />

						{user?.user?.role === 'admin' && (
							<>
								<NavLink to={'/dashboard/home'}>
									<p className="text-base hover:font-semibold duration-150 transition-all ease-in-out">
										Dashboard
									</p>
								</NavLink>
								<hr />
							</>
						)}

						<p
							className="text-base hover:font-semibold duration-150 transition-all ease-in-out"
							onClick={logOut}>
							Sign Out
						</p>
					</motion.div>
				)}
			</div>
		</header>
	);
};

export default Header;