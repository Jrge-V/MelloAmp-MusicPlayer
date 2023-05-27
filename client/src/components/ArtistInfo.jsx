import React, { useEffect } from 'react';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import { getAllArtist } from '../api';
import { useStateValue } from '../context/StateProvider';
import { actionType } from '../context/reducer';
import { IoLogoTwitter, IoLogoSoundcloud, IoLogoInstagram } from 'react-icons/io5';

const ArtistInfo = () => {
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
		<div className="w-full h-auto flex flex-col items-center justify-center bg-zinc-800">
			<Header />
			<div>
				<h1 className="text-center text-white font-bold pt-8 text-2xl">
					Please checkout out the socials of our featured artists below!
				</h1>
			</div>
			<div className="w-full p-6 flex flex-wrap items-center justify-evenly">
				<div className="grid grid-cols-4 gap-4">
					{allArtists &&
						allArtists.map((artist) => (
							<div
								key={artist.id}
								className="flex flex-col items-center justify-center p-3"
							>
								<div className="relative w-40 min-w-210 px-2 p-3 cursor-pointer hover:bg-opacity-50 hover:bg-amber-300 bg-zinc-700 shadow-md rounded-lg flex flex-col items-center">
									<img
										className="w-full h-full object-cover"
										src={artist.imageURL}
										alt={artist.name}
									/>
								</div>
								<h2 className="text-center text-white mt-2">{artist.name}</h2>
								<div className="w-80 min-w-[160px] h-80 min-h-[160px] rounded-lg drop-shadow-lg relative overflow-hidden text-center">
									<div className="text-xl flex flex-row justify-center gap-20 pt-10">
										{artist.twitter && (
											<a
												href={`https://twitter.com/${artist.twitter.replace(
													"www.twitter.com/",
													""
												)}`}
												target="_blank"
												rel="noopener noreferrer"
											>
												<IoLogoTwitter className="mb-2 text-blue-500 text-center hover:underline hover:text-amber-300 text-7xl" />
											</a>
										)}
										{artist.instagram && (
											<a
												href={`https://instagram.com/${artist.instagram.replace(
													"www.instagram.com/",
													""
												)}`}
												target="_blank"
												rel="noopener noreferrer"
											>
												<IoLogoInstagram className="mb-2 text-blue-500 text-center hover:underline hover:text-amber-300 text-7xl" />

											</a>
										)}
										{artist.soundcloud && (
											<a
												href={`https://soundcloud.com/${artist.soundcloud.replace(
													"www.soundcloud.com/",
													""
												)}`}
												target="_blank"
												rel="noopener noreferrer"
											>
												<IoLogoSoundcloud className="mb-2 text-blue-500 text-center hover:underline hover:text-amber-300 text-7xl" />
											</a>
										)}
									</div>
								</div>
							</div>
						))}
				</div>
			</div>
		</div>
	);

};

export default ArtistInfo;