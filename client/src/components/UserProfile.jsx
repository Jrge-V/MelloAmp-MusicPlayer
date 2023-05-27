import React, { useEffect, useState } from 'react';
import Header from './Header';
import moment from 'moment';
import { useStateValue } from '../context/StateProvider';

const UserProfile = () => {
    const [{ user }, dispatch] = useStateValue();



    return (
        <div className="w-full h-auto flex flex-col items-center justify-center bg-zinc-800">
            <Header />

            <div className='pt-10'>

                <img
                    src={user?.user?.imageURL || 'https://firebasestorage.googleapis.com/v0/b/projectmelloamp.appspot.com/o/Images%2FDefault%20Pic.jpg?alt=media&token=1a75ef66-f0f2-4722-b0d0-c018035391cc'}
                    className="h-40 w-40 min-w-[44px] object-cover rounded-full shadow-lg"
                    alt="This is to display their google image when logged in"
                    referrerPolicy="no-referrer"
                />
            </div>

            <div>

                <p className="text-white text-lg font-semibold pt-5">
                    Name: {user?.user?.name || user?.user.email.split("@")[0]}
                </p>

            </div>

            <div className="text-white text-lg font-semibold pt-5">
                Email: {user?.user?.email}
            </div>

            <div className="text-white text-lg font-semibold pt-5">
                Created At: {moment(user?.user?.createdAt).format('MMMM D, YYYY')}
            </div>


        </div>
    );
};

export default UserProfile;
