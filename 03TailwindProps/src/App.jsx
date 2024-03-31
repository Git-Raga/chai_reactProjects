import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Cards from './components/Cards'
import autoprefixer from 'autoprefixer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
   {/* container */}
   <div className=" */}
      bg-teal-950
      h-[90vh] 
      flex flex-col
      font-mono
      p-3
      rounded-3xl
      w-[1200px]
    ">
         {/* Header */}
            <div className="
            text-white 
              text-4xl mb-4
              p-1
              ">
            Project 03 | Tailwind CSS & Props
            </div>
            <hr></hr>
        {/* Body*/}
              <div className="
              mx-auto
              py-8 flex-grow
              text-white
                ">
                  Passing Props to components
              </div>
       {/* Footer */}
            <div className="
              bg-black py-2
                container mx-auto
              text-white text-center
                rounded-3xl
              ">
                <p>Raghav | April 24</p>
              </div>
       
    </div>

    </>
  )
}

export default App
