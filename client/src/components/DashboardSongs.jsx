import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { IoAdd } from 'react-icons/io5';
import { useState } from 'react';
import { useStateValue } from '../context/StateProvider';
import { getAllSongs } from '../api';
import { actionType } from '../context/reducer';
import SongCard from './SongCard';
import SearchBar from './SearchBar';

const DashboardSongs = () => {
	const [songFilter, setSongFilter] = useState('');
	const [{ allSongs }, dispatch] = useStateValue();

	useEffect(() => {
		if (!allSongs) {
			getAllSongs().then((data) => {
				dispatch({
					type: actionType.SET_ALL_SONGS,
					allSongs: data.songs,
				});
			});
		}
	}, []);

	return (
		<div className="w-full p-4 flex items-center justify-center flex-col">
			<div className="w-full flex justify-center items-center">
				<NavLink
					to={'/dashboard/newSong'}
					className="flex items-center justify-right px-10 border rounded-md border-gray-300 text-textColor hover:border-gray-500 hover:shadow-md cursor-pointer">
					<IoAdd />
					Add New Song!
				</NavLink>
				<SearchBar
					value={songFilter}
					onChange={(e) => setSongFilter(e.target.value)}
				/>
			</div>

			{/* Main Container */}
			<div className="relative w-full my-4 p-4 py-16">
			{/* <div className="relative w-full my-4 p-4 py-16 border border-gray-300 rounded-md"> */}
				{/* The count number */}
				<div className="absolute top-4 left-4">
					<p className="text-xl font-bold text-textColor">
						<span className="text-xl font-semibold text-textColor">
							Count :{' '}
						</span>
						{allSongs?.length}
					</p>
				</div>

				<SongContainer data={allSongs} filter={songFilter} />
			</div>
		</div>
	);
};

export const SongContainer = ({ data, filter }) => {
	if (!data) {
		return <div>No songs</div>;
	}
	const filteredSongs = data.filter(
		(song) =>
			song.name.toLowerCase().includes(filter.toLowerCase()) ||
			song.artist.toLowerCase().includes(filter.toLowerCase())
	);

	return (
		<div className="w-full flex flex-wrap gap-3 items-center justify-evenly">
			{filteredSongs.map((song, i) => (
				<SongCard key={song._id} data={song} index={i} type="song" />
			))}
		</div>
	);
};

export default DashboardSongs;