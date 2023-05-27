import React, { useEffect } from 'react';
import { getAllArtist } from '../api';
import { actionType } from '../context/reducer';
import { useStateValue } from '../context/StateProvider';
import SongCard from './SongCard';

const DashboardArtists = () => {
	const [{ allArtists }, dispatch] = useStateValue();

	useEffect(() => {
		if (!allArtists) {
			getAllArtist().then((data) => {
				dispatch({
					type: actionType.SET_ALL_ARTISTS,
					allArtists: data.artist,
				});
			});
		}
	}, []);

	return (
		<div className="w-full p-4 flex items-center justify-center flex-col">
			<div className="relative w-full my-4 p-4 py-16 rounded-md">
				<ArtistContainer data={allArtists} />
			</div>
		</div>
	);
};

export const ArtistContainer = ({ data }) => {
	if (!data || !Array.isArray(data) || data.length === 0) {
		console.log('No data');
		return (
			<div className="w-full flex flex-wrap gap-3 items-center justify-evenly">
				No Artist
			</div>
		);
	}
	return (
		<div className="w-full flex flex-wrap gap-3 items-center justify-evenly">
			{data.map((song, i) => (
				<SongCard key={song._id} data={song} index={i} type="artist" />
			))}
		</div>
	);
};


export default DashboardArtists;