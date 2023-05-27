import React, { useEffect, useRef, useState } from 'react';
import {
    getStorage,
    ref,
    getDownloadURL,
    uploadBytesResumable,
    deleteObject,
} from "firebase/storage";
import { motion } from "framer-motion";

import { BiCloudUpload } from "react-icons/bi";
import { MdDelete } from "react-icons/md";

import { storage } from "../config/firebase.config";
import { useStateValue } from '../context/StateProvider';
import FilterButtons from "./FilterButtons";
import {
    getAllAlbums,
    getAllArtist,
    getAllSongs,
    saveNewAlbum,
    saveNewArtist,
    saveNewSong
} from "../api"
import { actionType } from "../context/reducer";
import { filterByLanguage, filter } from "../utils/supportfunctions";
//import AlertSuccess from "./AlertSuccess";
//import AlertError from "./AlertError";

const DashboardNewSong = () => {
    const [songName, setsongName] = useState('');
    const [songImageCover, setsongImageCover] = useState(null)
    const [imageUploadProgress, setimageUploadProgress] = useState(0)
    const [isImageLoading, setisImageLoading] = useState(false)
    const [audioImageCover, setaudioImageCover] = useState(null)
    const [audioUploadingProgress, setaudioUploadingProgress] = useState(0)
    const [isAudioLoading, setisAudioLoading] = useState(false)

    const [artistImageCover, setartistImageCover] = useState(null);
    const [artistUploadingProgress, setartistUploadingProgress] = useState(0);
    const [isArtistUploading, setisArtistUploading] = useState(false);
    const [artistName, setartistName] = useState("");
    const [twitter, settwitter] = useState("");
    const [instagram, setinstagram] = useState("");
    const [soundcloud, setsoundcloud] = useState("");

    const [albumImageCover, setalbumImageCover] = useState(null);
    const [albumUplaodingProgress, setalbumUplaodingProgress] = useState(0);
    const [isAlbumUploading, setisAlbumUploading] = useState(false);
    const [albumName, setalbumName] = useState("");


    const [
        {
            allArtists,
            allSongs,
            allAlbums,
            artistFilter,
            albumFilter,
            filterTerm,
            languageFilter,
            alertType
        },
        dispatch,
    ] = useStateValue();


    useEffect(() => {
        if (!allArtists) {
            getAllArtist().then(data => {
                dispatch({
                    type: actionType.SET_ALL_ARTISTS,
                    allArtists: data.artist
                })
            })
        }

        if (!allAlbums) {
            getAllAlbums().then(data => {
                dispatch({
                    type: actionType.SET_ALL_ALBUMS,
                    allAlbums: data.album,
                });
            });
        }
    }, []);

    const deleteFileObject = (url, isImage) => {
        if (isImage) {
            setisImageLoading(true);
            setisAudioLoading(true);
            setisAlbumUploading(true);
            setisArtistUploading(true);
            dispatch({
                type: actionType.SET_ALERT_TYPE,
                alertType: "success"
            })

            setInterval(() => {
                dispatch({
                    type: actionType.SET_ALERT_TYPE,
                    alertType: null
                })
            }, 4000);
        }
        const deleteRef = ref(storage, url);
        deleteObject(deleteRef).then(() => {
            dispatch({
                type: actionType.SET_ALERT_TYPE,
                alertType: "failed"
            })

            setInterval(() => {
                dispatch({
                    type: actionType.SET_ALERT_TYPE,
                    alertType: null
                })
            }, 4000);

            setsongImageCover(null);
            setaudioImageCover(null);
            setalbumImageCover(null);
            setartistImageCover(null);
            setisImageLoading(false);
            setisAudioLoading(false);
            setisAlbumUploading(false);
            setisArtistUploading(false);
        });

        dispatch({
            type: actionType.SET_ALERT_TYPE,
            alertType: "success"
        })

        setInterval(() => {
            dispatch({
                type: actionType.SET_ALERT_TYPE,
                alertType: null
            })
        }, 5000);
    }

    const saveSong = () => {
        if (!songImageCover || !audioImageCover) {
            // throw alert
            dispatch({
                type: actionType.SET_ALERT_TYPE,
                alertType: "failed"
            })

            setInterval(() => {
                dispatch({
                    type: actionType.SET_ALERT_TYPE,
                    alertType: null
                })
            }, 5000);

        } else {
            setisAudioLoading(true);
            setisImageLoading(true);

            const data = {
                name: songName,
                imageURL: songImageCover,
                songURL: audioImageCover,
                album: albumFilter,
                artist: artistFilter,
                language: languageFilter,
                genre: filterTerm,
            };
            saveNewSong(data).then((res) => {
                getAllSongs().then((songs) => {
                    dispatch({
                        type: actionType.SET_ALL_SONGS,
                        allSongs: songs.song,
                    });
                });
            });

            dispatch({
                type: actionType.SET_ALERT_TYPE,
                alertType: "success"
            })

            setInterval(() => {
                dispatch({
                    type: actionType.SET_ALERT_TYPE,
                    alertType: null
                })
            }, 5000);

            setsongName(null);
            setisAudioLoading(false);
            setisImageLoading(false);
            setartistName("");
            setsongImageCover("");
            setaudioImageCover("");

            dispatch({ type: actionType.SET_ALL_ARTISTS, artistFilter: null });
            dispatch({ type: actionType.SET_LANGUAGE_FILTER, languageFilter: null });
            dispatch({ type: actionType.SET_LANGUAGE_FILTER, albumFilter: null });
            dispatch({ type: actionType.SET_FILTER_TERM, filterTerm: null });
        }
    };

    const saveArtist = () => {
        if (!artistImageCover || !artistName) {
            //Alert message
            dispatch({
                type: actionType.SET_ALERT_TYPE,
                alertType: "failed"
            })
    
            setInterval(() => {
                dispatch({
                    type: actionType.SET_ALERT_TYPE,
                    alertType: null
                })
            }, 5000);
    
        } else {
            setisArtistUploading(true);
    
            const twitterUrl = twitter ? `www.twitter.com/${twitter}` : null;
            const instagramUrl = instagram ? `www.instagram.com/${instagram}` : null;
            const soundcloudUrl = soundcloud ? `www.soundcloud.com/${soundcloud}` : null;
    
            const data = {
                name: artistName,
                imageURL: artistImageCover,
                twitter: twitterUrl,
                instagram: instagramUrl,
                soundcloud: soundcloudUrl
            }
    
            saveNewArtist(data).then((res) => {
                getAllArtist().then((data) => {
                    dispatch({
                        type: actionType.SET_ALL_ARTISTS,
                        allArtists: data.artist,
                    })
                })
            });
    
            dispatch({
                type: actionType.SET_ALERT_TYPE,
                alertType: "success"
            })
    
            setInterval(() => {
                dispatch({
                    type: actionType.SET_ALERT_TYPE,
                    alertType: null
                })
            }, 4000);
    
            setisArtistUploading(false);
            setartistImageCover(null);
            settwitter("");
            setinstagram("");
            setsoundcloud("");
        }
    };
    


    const saveAlbum = () => {
        if (!albumImageCover || !albumName) {
            dispatch({
                type: actionType.SET_ALERT_TYPE,
                alertType: "failed"
            })

            setInterval(() => {
                dispatch({
                    type: actionType.SET_ALERT_TYPE,
                    alertType: null
                })
            }, 5000);

        } else {
            setisAlbumUploading(true);

            const data = {
                name: albumName,
                imageURL: albumImageCover,
            }

            saveNewAlbum(data).then(() => {
                getAllAlbums().then((data) => {
                    dispatch({
                        type: actionType.SET_ALL_ALBUMS,
                        allAlbums: data.album,
                    });
                });
            })
            dispatch({
                type: actionType.SET_ALERT_TYPE,
                alertType: "success"
            })

            setInterval(() => {
                dispatch({
                    type: actionType.SET_ALERT_TYPE,
                    alertType: null
                })
            }, 5000);

            setisAlbumUploading(false);
            setalbumImageCover(null);
            setalbumName("");
        }
    }


    return (
        <div className='flex flex-col items-center justify-center p-4 border border-gray-300 gap-4 rounded-md'>
            <input
                type="text"
                placeholder='Song name...'
                className='w-full p-3 rounded-md text-base font-semibold text-textColor outline-none shadow-sm border border-gray-300 bg-transparent'
                value={songName}
                onChange={(e) => setsongName(e.target.value)}
            />
            <div className='flex w-full justify-between flex-wrap items-center gap-4'>
                <FilterButtons filterData={allArtists} flag={"Artist"} />
                <FilterButtons filterData={allAlbums} flag={"Album"} />
                <FilterButtons filterData={filterByLanguage} flag={"Language"} />
                <FilterButtons filterData={filter} flag={"Genre"} />
            </div>

            <div className='bg-card backdrop-blur-md w-full h-300 rounded-md border-2 border-dotted border-gray-300 cursor-pointer'>
                {isImageLoading && <FileLoader progress={imageUploadProgress} />}
                {!isImageLoading && (
                    <>
                        {!songImageCover ? (
                            <FileUploader
                                updateSate={setsongImageCover}
                                setProgress={setimageUploadProgress}
                                isLoading={setisImageLoading}
                                isImage={true}
                            />
                        ) : (
                            <div className='relative w-full h-full overflow-hidden rounded-md flex justify-center items-center'>
                                <img
                                    src={songImageCover}
                                    className='h-full object-cover'
                                    alt='upload an image'
                                />
                                <button
                                    type='button'
                                    className='absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none border-none hover:shadow-md duration-200 transition-all ease-in-out'
                                    onClick={() => deleteFileObject
                                        (songImageCover, true)}
                                >
                                    <MdDelete className='text-white' />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Audio File Uploading */}
            <div className='bg-card backdrop-blur-md w-full h-300 rounded-md border-2 border-dotted border-gray-300 cursor-pointer'>
                {isAudioLoading && <FileLoader progress={audioUploadingProgress} />}
                {!isAudioLoading && (
                    <>
                        {!audioImageCover ? (
                            <FileUploader
                                updateSate={setaudioImageCover}
                                setProgress={setaudioUploadingProgress}
                                isLoading={setisAudioLoading}
                                isImage={false}
                            />
                        ) : (
                            <div className='relative w-full h-full overflow-hidden rounded-md flex justify-center items-center'>
                                <audio src={audioImageCover} controls>
                                </audio>
                                <button
                                    type='button'
                                    className='absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none border-none hover:shadow-md duration-200 transition-all ease-in-out'
                                    onClick={() => deleteFileObject
                                        (audioImageCover, false)}
                                >
                                    <MdDelete className='text-white' />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className='flex items-center justify-center w-60 cursor-pointer p-4'>
                {isImageLoading || isAudioLoading ? (
                    <DisabledButton />
                ) : (
                    <motion.button
                        whileTap={{ scale: 0.75 }}
                        className='px-8 py-2 rounded-md text-white bg-yellow-600 hover:shadow-lg'
                        onClick={saveSong}
                    >
                        Save Song
                    </motion.button>
                )}
            </div>
            {/* Artist Upload */}
            <p className='text-xl font-semibold text-amber-300 underline'>Artist</p>
            <div className='bg-card backdrop-blur-md w-full h-300 rounded-md border-2 border-dotted border-gray-300 cursor-pointer'>
                {isArtistUploading && <FileLoader progress={artistUploadingProgress} />}
                {!isArtistUploading && (
                    <>
                        {!artistImageCover ? (
                            <FileUploader
                                updateSate={setartistImageCover}
                                setProgress={setartistUploadingProgress}
                                isLoading={setisArtistUploading}
                                isImage={true}
                            />
                        ) : (
                            <div className='relative w-full h-full overflow-hidden rounded-md flex justify-center items-center'>
                                <img
                                    src={artistImageCover}
                                    className='h-full object-cover'
                                    alt='upload an image'
                                />
                                <button
                                    type='button'
                                    className='absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none border-none hover:shadow-md duration-200 transition-all ease-in-out'
                                    onClick={() => deleteFileObject
                                        (artistImageCover, true)}
                                >
                                    <MdDelete className='text-white' />
                                </button>
                            </div>

                        )}
                    </>
                )}
            </div>

            {/* artist name */}
            <input
                type="text"
                placeholder='Artist name...'
                className='w-full p-3 rounded-md text-base font-semibold text-textColor outline-none shadow-sm border border-gray-300 bg-transparent'
                value={artistName}
                onChange={(e) => setartistName(e.target.value)}
            />

            {/* Socials: Twitter */}
            <div className='flex items-center rounded-md p-3 border border-gray-300 w-full'>
                <p className='text-base font-semibold text-gray-400'>
                    www.twitter.com/
                </p>
                <input type='text' placeholder='twitter handle...' className='w-full text-base font-semibold text-textColor outline-none bg-transparent'
                    value={twitter}
                    onChange={(e) => settwitter(e.target.value)}
                />
            </div>

            {/* Socials: Instagram */}
            <div className='flex items-center rounded-md p-3 border border-gray-300 w-full'>
                <p className='text-base font-semibold text-gray-400'>
                    www.instagram.com/
                </p>
                <input type='text' placeholder='instagram handle...' className='w-full text-base font-semibold text-textColor outline-none bg-transparent'
                    value={instagram}
                    onChange={(e) => setinstagram(e.target.value)}
                />
            </div>

            {/* Socials: Soundcloud */}
            <div className='flex items-center rounded-md p-3 border border-gray-300 w-full'>
                <p className='text-base font-semibold text-gray-400'>
                    www.soundcloud.com/
                </p>
                <input type='text' placeholder='soundcloud handle...' className='w-full text-base font-semibold text-textColor outline-none bg-transparent'
                    value={soundcloud}
                    onChange={(e) => setsoundcloud(e.target.value)}
                />
            </div>

            <div className='flex items-center justify-center w-60 cursor-pointer p-4'>
                {isArtistUploading ? (
                    <DisabledButton />
                ) : (
                    <motion.button
                        whileTap={{ scale: 0.75 }}
                        className='px-8 py-2 rounded-md text-white bg-yellow-600 hover:shadow-lg'
                        onClick={saveArtist}
                    >
                        Save Artist
                    </motion.button>
                )}
            </div>


            {/* Album Info */}
            <p className='text-xl font-semibold text-amber-300 underline'>Album</p>
            <div className='bg-card backdrop-blur-md w-full h-300 rounded-md border-2 border-dotted border-gray-300 cursor-pointer'>
                {isAlbumUploading && <FileLoader progress={albumUplaodingProgress} />}
                {!isAlbumUploading && (
                    <>
                        {!albumImageCover ? (
                            <FileUploader
                                updateSate={setalbumImageCover}
                                setProgress={setalbumUplaodingProgress}
                                isLoading={setisAlbumUploading}
                                isImage={true}
                            />
                        ) : (
                            <div className='relative w-full h-full overflow-hidden rounded-md flex justify-center items-center'>
                                <img
                                    src={albumImageCover}
                                    className='h-full object-cover'
                                    alt='upload an image'
                                />
                                <button
                                    type='button'
                                    className='absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none border-none hover:shadow-md duration-200 transition-all ease-in-out'
                                    onClick={() => deleteFileObject
                                        (albumImageCover, true)}
                                >
                                    <MdDelete className='text-white' />
                                </button>
                            </div>

                        )}
                    </>
                )}
            </div>

            {/* Album Name */}

            <input
                type="text"
                placeholder='Album name...'
                className='w-full p-3 rounded-md text-base font-semibold text-textColor outline-none shadow-sm border border-gray-300 bg-transparent'
                value={albumName}
                onChange={(e) => setalbumName(e.target.value)}
            />

            {/* Save the album */}
            <div className='flex items-center justify-center w-60 cursor-pointer p-4'>
                {isAlbumUploading ? (
                    <DisabledButton />
                ) : (
                    <motion.button
                        whileTap={{ scale: 0.75 }}
                        className='px-8 py-2 rounded-md text-white bg-yellow-600 hover:shadow-lg'
                        onClick={saveAlbum}
                    >
                        Save Album
                    </motion.button>
                )}
            </div>



        </div>
    );
};

{/* Styling the loading icon */ }
export const DisabledButton = () => {
    return (
        <button
            disabled
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
        >
            <svg
                role="status"
                className="inline w-4 h-4 mr-3 text-white animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#E5E7EB"
                />
                <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor"
                />
            </svg>
            Loading...
        </button>
    );
};

export const FileLoader = ({ progress }) => {

    return (
        <div className='w-full h-full flex flex-col items-center justify-center'>
            <p className='text-xl font-semibolb text-textColor'>
                {Math.round(progress) > 0 && <> {`${Math.round(progress)}%`} </>}
            </p>
            <div className='w-20 h-20 min-w-[40px] bg-yellow-300 animate-ping rounded-full flex items-center justify-center relative'>
                <div className='absolute inset-0 rounded-full bg-yellow-600 blur-xl'>
                </div>

            </div>
        </div>
    )
}

export const FileUploader = ({ updateSate, setProgress, isLoading, isImage }) => {

    const [
        {
            alertType
        },
        dispatch,
    ] = useStateValue();

    const uploadFile = (e) => {
        isLoading(true);
        const uploadedFile = e.target.files[0];

        const storageRef = ref(
            storage,
            `${isImage ? "Images" : "Audio"}/${Date.now()}-${uploadedFile.name}`
        );
        const uploadTask = uploadBytesResumable(storageRef, uploadedFile);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
            },
            (error) => {
                console.log(error);
                dispatch({
                    type: actionType.SET_ALERT_TYPE,
                    alertType: "failed"
                })

                setInterval(() => {
                    dispatch({
                        type: actionType.SET_ALERT_TYPE,
                        alertType: null
                    })
                }, 5000);

            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    updateSate(downloadURL);
                    isLoading(false);
                });
                dispatch({
                    type: actionType.SET_ALERT_TYPE,
                    alertType: "success"
                })

                setInterval(() => {
                    dispatch({
                        type: actionType.SET_ALERT_TYPE,
                        alertType: null
                    })
                }, 5000);

            }
        );
    };

    return (
        <label>
            <div className='flex flex-col items-center justify-center h-full'>
                <div className='flex flex-col justify-center items-center cursor-pointer'>
                    <p className='font-bold text-2xl'>
                        <BiCloudUpload />
                    </p>
                    <p className='text-lg'>
                        Upload {isImage ? "an image file" : "an audio file"}
                    </p>
                </div>
            </div>
            <input
                type='file'
                name='upload-file'
                accept={`${isImage ? "image/*" : "audio/*"}`}
                className={'w-0 h-0'}
                onChange={uploadFile}
            />
        </label>
    );
};

export default DashboardNewSong