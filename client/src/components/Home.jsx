import Header from './Header';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useStateValue } from '../context/StateProvider';
import { actionType } from '../context/reducer';

import { motion } from 'framer-motion';
import { getAllSongs } from '../api';
import SearchBar from './SearchBar';

const SongCard = ({ data, index, type }) => {
	const [{ songIndex, isSongPlaying }, dispatch] = useStateValue();

	const addToContext = () => {
		if (!isSongPlaying) {
			dispatch({
				type: actionType.SET_ISSONG_PLAYING,
				isSongPlaying: true,
			});
		}

		if (songIndex !== index) {
			dispatch({
				type: actionType.SET_SONG_INDEX,
				songIndex: index,
			});
		}
	};

	return (
		<motion.div
			className="relative w-40 min-w-210 px-2 py-4 cursor-pointer hover:bg-opacity-50 hover:bg-amber-300 bg-zinc-700 shadow-md rounded-lg flex flex-col items-center"
			onClick={type === 'song' && addToContext}>
			<div className="w-40 min-w-[160px] h-40 min-h-[160px] rounded-lg drop-shadow-lg relative overflow-hidden">
				<motion.img
					whileHover={{ scale: 1.05 }}
					src={data.imageURL}
					className="w-full rounded-lg object-cover"
				/>
			</div>

			<p className="text-base text-center text-white font-semibold my-2">
				{data.name.length > 25 ? `${data.name.slice(0, 25)}..` : data.name}
				{data.artist && (
					<span className="block text-sm text-white my-1">
						{data.artist.length > 25
							? `${data.artist.slice(0, 25)}...`
							: data.artist}
					</span>
				)}

			</p>

			<span className="text-center text-yellow-300 mt-1 font-normal text-sm">
					{data.genre.length > 25 ? `(${data.genre.slice(0, 25)}..)` : `(${data.genre})`}
				</span>

				<span className="text-center text-yellow-300 font-normal text-sm">
					{data.language.length > 25 ? `(${data.language.slice(0, 25)}..)` : `(${data.language})`}
				</span>


			<div className="w-full absolute bottom-2 right-2 flex items-center justify-between px-4"></div>
		</motion.div>
	);
};

export const SongContainer = ({ data, filter }) => {
	const filteredSongs = data.filter(
	  (song) =>
		song.name.toLowerCase().includes(filter.toLowerCase()) ||
		song.artist.toLowerCase().includes(filter.toLowerCase()) ||
		song.genre.toLowerCase().includes(filter.toLowerCase()) ||
		song.language.toLowerCase().includes(filter.toLowerCase())
	);
  
	return (
	  <div className="w-full flex flex-wrap gap-3 items-center justify-evenly">
		{filteredSongs.length > 0 ? (
		  filteredSongs.map((song, i) => (
			<SongCard key={song._id} data={song} index={i} type="song" />
		  ))
		) : (
			<div>
		  <p className="text-center text-yellow-300 mt-4 text-2xl font-bold">No results found for "{filter}"</p>
		  <p className="text-center text-yellow-200 mt-4 text-sm font-medium">Please make sure you are using the correct keywords.</p>
			</div>
		)}
	  </div>
	  
	);
	
  };

const Home = () => {
	const [songFilter, setSongFilter] = useState('');
	const [{ allSongs }, dispatch] = useStateValue();
	const [isFocus, setisFocus] = useState(false);

	useEffect(() => {
		if (!allSongs) {
			getAllSongs().then((data) => {
				dispatch({
					type: actionType.SET_ALL_SONGS,
					allSongs: data.song,
				});
			});
		}
	});

	return (
		<div className="w-full h-auto flex flex-col items-center justify-center bg-primary">
			<Header />
			<div className="w-full p-4 flex items-center justify-center flex-col bg-zinc-800">
				<SearchBar
					value={songFilter}
					onChange={(e) => setSongFilter(e.target.value)}
				/>
				{/*Main Container */}
				{/* if you want the border copy after this. border border-gray-300 rounded-md */}
				{allSongs && (
					<div className="relative flex w-full my-4 p-4 py-16">
						<SongContainer data={allSongs} filter={songFilter} />
					</div>
				)}
			</div>
		</div>
	);
};

export default Home;