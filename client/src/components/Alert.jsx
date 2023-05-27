import React from 'react'
import { FcApproval, FcHighPriority } from "react-icons/fc";
import { motion } from 'framer-motion';

const Alert = ({type}) => {
  return (
    
    <motion.div
    initial={{translate : 100, opacity : 0}}
    animate={{translate : 0, opacity : 1}}
    exit={{translate : 100, opacity : 0}}
    key={type}
    className={`fixed top-12 right-12 px-4 py-2 rounded-md backdrop-blur-md flex items-center justify-center shadow-xl
    ${type === "success" && "bg-yellow-100"}
    ${type === "failed" && "bg-red-400"} 

    `}>
        {type === "success" && (
            <div className='flex items-center justify-center gap-4'>
                <FcApproval className='text-3xl' />
                <p className='text-xl font-semibold'>
                    Upload Successfully Saved
                </p>
            </div>
        )}

{type === "failed" && (
            <div className='flex items-center justify-center gap-4'>
                <FcHighPriority className='text-3xl' />
                <p className='text-xl font-semibold'>
                    Upload Failed
                </p>
            </div>
        )}

        
    </motion.div>
  )
}

export default Alert