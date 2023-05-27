import React from 'react';
import { NavLink, Routes, Route } from 'react-router-dom';
import Header from './Header';

import { IoHome } from 'react-icons/io5';
import { isActiveStyles, isNotActiveStyles } from '../utils/styles';
import {
	Alert,
	DashboardAlbums,
	DashboardArtist,
	DashboardHome,
	DashboardSongs,
	DashboardUsers,
} from '.';
import DashboardNewSong from './DashboardNewSong';
import { useStateValue } from '../context/StateProvider';

const Dashboard = () => {
	const [{ alertType }, dispatch] = useStateValue();

	return (
		<div className="w-full h-auto flex flex-col items-center justify-center bg-zinc-800">
			<Header />

			<div className="w-[60%] my-2 p-4 flex items-center justify-evenly text-amber-200">
				<NavLink
					to={'/dashboard/home'}
					className={({ isActive }) =>
						isActive ? isActiveStyles : isNotActiveStyles
					}>
					<IoHome className="text-2xl text-amber-200" />{' '}
				</NavLink>

				<NavLink
					to={'/dashboard/user'}
					className={({ isActive }) =>
						isActive ? isActiveStyles : isNotActiveStyles
					}>
					Users
				</NavLink>

				<NavLink
					to={'/dashboard/songs'}
					className={({ isActive }) =>
						isActive ? isActiveStyles : isNotActiveStyles
					} >
					Songs
				</NavLink>

				<NavLink
					to={'/dashboard/artist'}
					className={({ isActive }) =>
						isActive ? isActiveStyles : isNotActiveStyles
					}>
					Artists
				</NavLink>

				<NavLink
					to={'/dashboard/albums'}
					className={({ isActive }) =>
						isActive ? isActiveStyles : isNotActiveStyles
					}>
					Albums
				</NavLink>
			</div>


			<div>
				<Routes>
					<Route path="/home" element={<DashboardHome />} />
					<Route path="/user" element={<DashboardUsers />} />
					<Route path="/songs" element={<DashboardSongs />} />
					<Route path="/artist" element={<DashboardArtist />} />
					<Route path="/albums" element={<DashboardAlbums />} />
					<Route path="/newSong" element={<DashboardNewSong />} />
				</Routes>
			</div>

			{alertType && <Alert type={alertType} />}
		</div>
	);
};

export default Dashboard;