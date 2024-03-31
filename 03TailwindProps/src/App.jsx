import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Cards from './components/Cards'
import autoprefixer from 'autoprefixer'
import Input from './components/Input'

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
         justify-between
      ">
         {/* Header */}
            <div className="
            text-white 
              text-4xl
              
              ">
            Project 03 | Tailwind CSS & Props
            <div>
              <br></br>
              <hr></hr>
              </div>
            </div>
           
            <div className='
            text-gray-300 
            
            '>
            <p>Passing Props to components</p>
            </div>
        {/* Body*/}
              <div className="
               inline-flex
               py-2
               px-4
               m-2
               space-x-10
              text-white
              flex-gr              
              

                ">
                  <Input />
                  <Cards />
                  <Cards />

                  
                  

              </div>
       {/* Footer */}
            <div className="
              bg-black py-2
                container mx-auto
              text-white 
                text-center
                rounded-3xl
                h-10
                
              ">
                <p>Raghav | April 24</p>
              </div>
       
    </div>

    </>
  )
}

export default App
