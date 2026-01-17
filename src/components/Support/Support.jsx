import React from 'react'
import IEDC from '../../assets/support/IEDC-Logo.png'
import KSM from '../../assets/support/KSM.png'
import GovtKerala from '../../assets/support/GovtKerala.png'

function Support() {
  return (
    <div>
        <h2 className='text-center mt-14 mb-4 text-gray-600 font-bold text-2xl'>Supported by</h2>
        <div className='flex flex-col justify-evenly items-center md:flex-row xl:flex-row'>     
            <img className='w-60 m-5' src={IEDC} alt="idec-logo"></img>
            <img className='w-52 m-5' src={KSM} alt="ksm-logo"></img>
            <img className='w-52 m-5' src={GovtKerala} alt="govt-kerala-logo"></img>
        </div>
    </div>
  )
}

export default Support