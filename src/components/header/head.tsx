import React from 'react'
import { DarkmodeToggle } from '../darkmode-toggle'

export default function Header() {
    return (
        <div className='flex flex-row justify-center w-full h-25 bg-amber-900 p-2'>
            <div className='flex flex-row justify-center w-full md:max-w-3xl lg:max-w-5xl'>

                <nav className='flex flex-row w-full '>
                    <DarkmodeToggle />
                </nav>
            </div>

        </div>
    )
}
