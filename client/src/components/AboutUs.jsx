import React, { useEffect, useState } from 'react';
import Header from './Header';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getAllArtist } from '../api';
import { useStateValue } from '../context/StateProvider';
import { actionType } from '../context/reducer';

const AboutUs = () => {
    const [userDatas, setUserDatas] = useState([]);
  
    useEffect(() => {
      const fetchUserDatas = async () => {
        const usernames = ['Jrge-V', 'sshaldan', 'janelletio98', 'yheee', 'HusnainMasood'];
        const requests = usernames.map(username => axios.get(`https://api.github.com/users/${username}`));
        const responses = await Promise.all(requests);
        const datas = responses.map(response => response.data);
        setUserDatas(datas);
      };
      fetchUserDatas();
    }, []);
  
    return (
      <div className="w-full h-auto flex flex-col items-center justify-center bg-zinc-800">
        <Header />
        <div className="flex flex-wrap justify-center">
          {userDatas.map(userData => (
            <a href={userData.html_url} target="_blank" rel="noopener noreferrer" className="relative w-60 min-w-210 p-3 cursor-pointer hover:bg-opacity-50 hover:bg-amber-300 bg-zinc-700 shadow-md rounded-lg flex flex-col items-center mb-4 mr-10 top-10 text-white" key={userData.id}>
              <img className="py-1" src={userData.avatar_url} alt="Profile" />
              <h1 className="py-1">{userData.login}</h1>
              <h1>{userData.name}</h1>
            </a>
          ))}
        </div>
      </div>
    );
  };
  
  export default AboutUs;
  