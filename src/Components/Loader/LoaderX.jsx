import React from 'react'
import logo from '../../assets/xchange-symbol.svg'

const LoaderX = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-slate-800">
      <div className="relative w-32 h-32">
        <img src={logo} alt="Xchange" className="w-full h-full opacity-20" />
        <div
          className="absolute inset-0 fill-x"
          style={{
            WebkitMaskImage: `url(${logo})`,
            maskImage: `url(${logo})`,
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
          }}
        />
      </div>
      <p className="mt-6 text-sm tracking-[0.3em] uppercase text-slate-500">Loading Xchange</p>
    </div>
  )
}

export default LoaderX
