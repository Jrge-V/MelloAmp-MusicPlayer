import React from 'react';
import { Link } from 'react-router-dom';
import '../404button2.css';

const PageNotFound = () => {
	return (
		<>
			<div className="bg-zinc-800 w-full">
				<Link to="/" className="left-28 absolute top-24 text-xl z-10">
					<button data-text="Awesome" class="button2">
						Return Home
					</button>
				</Link>

				<img
					className=" h-screen"
					src="https://media3.giphy.com/media/hS42TuYYnANLFR9IRQ/giphy.gif"
					alt="404"></img>
				<img
					className="h-screen w-screen absolute opacity-[0.015] top-0"
					src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZWY2MzUyMDdmOWU1NGM3MTI0ODFiMGM2NjcwNDE0NTExOThmNTFlOCZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/lgcUUCXgC8mEo/giphy.gif"
					alt="123"></img>
			</div>
		</>
	);
};

export default PageNotFound;
