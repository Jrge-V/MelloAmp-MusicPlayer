import React, { useEffect, useState } from 'react';
import { RiPlayListFill } from 'react-icons/ri';
import { useStateValue } from '../context/StateProvider';
import { motion } from 'framer-motion';

import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { getAllSongs } from '../api';
import { actionType } from '../context/reducer';

import { IoClose, IoMusicalNote } from 'react-icons/io5';

//Audio Player

const MusicPlayer = () => {
	const nextTrack = () => {
		if (songIndex > allSongs.length - 2) {
			dispatch({
				type: actionType.SET_SONG_INDEX,
				songIndex: 0,
			});
		} else {
			dispatch({
				type: actionType.SET_SONG_INDEX,
				songIndex: songIndex + 1,
			});
		}
	};

	const previousTrack = () => {
		if (songIndex === 0) {
			dispatch({
				type: actionType.SET_SONG_INDEX,
				songIndex: 0,
			});
		} else {
			dispatch({
				type: actionType.SET_SONG_INDEX,
				songIndex: songIndex - 1,
			});
		}
	};

	const closePlayer = () => {
		dispatch({
			type: actionType.SET_ISSONG_PLAYING,
			isSongPlaying: false,
		});
	};

	const [{ allSongs, songIndex, isSongPlaying }, dispatch] = useStateValue();
	const [isPlaylist, setisPlaylist] = useState(false);
	return (
		<div className="w-full flex items-center gap-3">
			<div className={`w-full items-center gap-3 p-4 flex relative`}>
				<img
					src={allSongs[songIndex]?.imageURL}
					alt=""
					className="w-24 h-24 object-cover rounded-md"
				/>

				<div className="flex items-start flex-col w-36 h-30">
					<p className="text-l text-headingColor font-semibold">
						{`${
							allSongs[songIndex]?.name.length > 20
								? allSongs[songIndex]?.name.slice(0, 20)
								: allSongs[songIndex]?.name
						}`}{' '}
						<span className="text-base">
							{/*{(allSongs[songIndex]?.album)} if you want to display album during song */}
							{allSongs[songIndex]?.AudioPlayer}
						</span>
					</p>
					<p className="text-headingColor">
						{allSongs[songIndex]?.artist}{' '}
						<span className="text-sm text-headingColor font-semibold">
							({allSongs[songIndex]?.genre})
						</span>
					</p>

					<motion.i
						whileTap={{ scale: 0.8 }}
						onClick={() => setisPlaylist(!isPlaylist)}>
						<RiPlayListFill className="text-headingColor hover:text-headingColor text-3xl cursor-pointer" />
					</motion.i>
				</div>

				<div className="flex-1">
					<AudioPlayer
						src={allSongs[songIndex]?.songURL}
						onPlay={() => console.log('is playing')}
						autoPlay={true}
						showSkipControls={true}
						onClickNext={nextTrack}
						onClickPrevious={previousTrack}
					/>
				</div>
				{isPlaylist && <PlayListCard />}

				<IoClose onClick={closePlayer} />
			</div>
		</div>
	);
};

export const PlayListCard = () => {
	const [{ allSongs, songIndex, isSongPlaying }, dispatch] = useStateValue();

	useEffect(() => {
		if (!allSongs) {
			getAllSongs().then((data) => {
				dispatch({
					type: actionType.SET_ALL_SONGS,
					allSongs: data.song,
				});
			});
		}
	}, []);

	const setCurrentPlaySong = (index) => {
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
		<div className="absolute left-4 bottom-24 gap-2 py-2 w-350 max-w-[350px] h-510 max-h-[510px] flex flex-col overflow-y-scroll scrollbar-thin rounded-md shadow-md bg-headingColor">
			{allSongs.length > 0 ? (
				allSongs.map((music, index) => (
					<motion.div
						initial={{ opacity: 0, translateX: 50 }}
						animate={{ opacity: 1, translateX: 0 }}
						transition={{ duration: 0.3, delay: index * 0.1 }}
						className="group w-full p-4 hover:bg-card flex gap-3 items-center cursor-pointer bg-transparent"
						onClick={() => setCurrentPlaySong(index)}
						key={index}>
						<IoMusicalNote className="text-textColor group-hover:text-headingColor text-2xl cursor-pointer" />
						<div className="flex items-start flex-col">
							<p className="text-lg text-textColor font-semibold">
								{`${
									music?.name.length > 20
										? music?.name.slice(0, 20)
										: music?.name
								}`}{' '}
								<span className="text-base">({music?.album})</span>
							</p>
							<p className="text-headingColor">
								{music?.artist}{' '}
								<span className="text-sm font-semibold">
									({music?.genre})
								</span>
							</p>
						</div>
					</motion.div>
				))
			) : (
				<></>
			)}
		</div>
	);
};

export default MusicPlayer;