import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IoTrash } from 'react-icons/io5';
import { deleteObject, ref } from 'firebase/storage';
import {
	deleteAlbumById,
	deleteArtistById,
	deleteSongById,
	getAllAlbums,
	getAllArtist,
	getAllSongs,
} from '../api';
import { useStateValue } from '../context/StateProvider';
import { actionType } from '../context/reducer';
import { storage } from '../config/firebase.config';
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom';

const SongCard = ({ data, index, type }) => {
	const [isDelete, setisDelete] = useState(false);
	const [
		{ allArtists, allSongs, allAlbums, alertType, songIndex, isSongPlaying },
		dispatch,
	] = useStateValue();

	const deleteData = (data) => {
		const deleteRef = ref(storage, data.imageURL);
		deleteObject(deleteRef).then(() => {});

    //Delete Songs
    deleteSongById(data._id).then((res) => {
        if (res.data) {
            dispatch({
                type: actionType.SET_ALL_SONGS,
                allSongs: allSongs.filter(song => song._id !== data._id),
            });
        }
    });

    //Delete Artist
    deleteArtistById(data._id).then((res) => {
        if (res.data) {
            dispatch({
                type: actionType.SET_ALL_ARTISTS,
                allArtists: allArtists.filter(artist => artist._id !== data._id),
            });
        }
    });

    //Delete Album
    deleteAlbumById(data._id).then((res) => {
        if (res.data) {
            dispatch({
                type: actionType.SET_ALL_ALBUMS,
                allAlbums: allAlbums.filter(album => album._id !== data._id),
            });
        }
    });
};

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

	const navigate = useNavigate();
	return (
		<motion.div
			className="relative w-40 min-w-210 px-2 py-4 cursor-pointer hover:bg-card bg-gray-100 shadow-md rounded-lg flex flex-col items-center"
			onClick={type === 'song' && addToContext}>
			<div className="w-40 min-w-[160px] h-40 min-h-[160px] rounded-lg drop-shadow-lg relative overflow-hidden">
				<motion.img
					whileHover={{ scale: 1.05 }}
					src={data.imageURL}
					className="w-full rounded-lg object-cover"
				/>
			</div>

			<p className="text-base text-center text-headingColor font-semibold my-2">
				{data.name.length > 25 ? `${data.name.slice(0, 25)}..` : data.name}
				{data.artist && (
					<span className="block text-sm text-gray-400 my-1">
						{data.artist.length > 25
							? `${data.artist.slice(0, 25)}...`
							: data.artist}
					</span>
				)}
			</p>

			<div className="w-full absoulte bottom-2 right-2 flex items-center justify-between px-4">
				<motion.i
					whileTap={{ scale: 0.75 }}
					className="text-base text-red-400 drop-shadow-md hover:text-red-600"
					onClick={(e) => {
						e.stopPropagation();
						setisDelete(true);
					}}>
					<IoTrash />
				</motion.i>
			</div>
			{isDelete && (
				<motion.div
					className="absolute inset-0 backdrop-blur-md bg-cardOverlay flex items-center flex-col justify-center px-4 py-2 gap-0"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}>
					<p className="text-lg text-headingColor font-semibold text-center">
						Confirm the deletion of the item?
					</p>
					<div className="flex items-center gap-4">
						<motion.button
							className="px-2 py-1 text-sm uppercase bg-red-300 rounded-md hover:bg-red-500 cursor-pointer"
							whileTap={{ scale: 0.7 }}
							onClick={(e) => {
								e.stopPropagation();
								deleteData(data);
								
							}}>
							Yes
						</motion.button>
						<motion.button
							className="px-2 py-1 text-sm uppercase bg-green-300 rounded-md hover:bg-green-500 cursor-pointer"
							whileTap={{ scale: 0.7 }}
							onClick={(e) => {
								e.stopPropagation();
								setisDelete(false);
							}}>
							No
						</motion.button>
					</div>
				</motion.div>
			)}
		</motion.div>
	);
};

export default SongCard;