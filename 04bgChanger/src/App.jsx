import { useState } from 'react'

import './App.css'

function App() {
  const [mycolor, setMycolor] = useState("black")

  return (
    <>

   {/* container */}
  <div className=" 
        bg-black
       
        h-[90vh] 
        flex flex-col
        font-mono
        p-3
        rounded-3xl
        
        
    
         justify-between"
      style={{backgroundColor:mycolor}}
      >
         {/* Header */}
            <div className="
            text-white 
              text-2xl
              
              style={{bac}}
              
              ">
            Project 04 | Background Changer (TailwindCSS)
            
              
              <hr></hr>
              
              </div>
            
        {/* Body*/}
              <div className="
                  w-full
                    
                  
                  flex-wrap
                  border-spacing-1
                  border
                  rounded-xl
                  relative h-20  
                  inset-y-0 right-0
                  bg-slate-600

                  justify-center
                  text-gray-300 
                  outline-none
                  ">

           
           
           <p>Select the Color to Apply</p>     
           <hr></hr>      
              <div>
              <button className='
              mt-3
              mx-2
              outline-none
              px-1
              py-1
              bg-red-500
              text-sm
              active:scale-y-75 
              transition-transform
              '
              onClick={()=>setMycolor('rgb(239 68 68)')}
              >Red</button>
              <button className='
              mt-3
              mx-2
              outline-none
              px-1
              py-1
              bg-blue-600
              text-sm
              active:scale-y-75 
              transition-transform
              
              '
              onClick={()=>setMycolor('rgb(37 99 235)')}
              >Blue</button>
               <button className='
              mt-3
              outline-none
              mx-2
              px-1
              py-1
              bg-gray-400
              text-black
              text-sm
              active:scale-y-75 
              transition-transform'
              onClick={()=>setMycolor('rgb(156 163 175)')}
              >Gray</button>
               <button className='
              mx-2
              mt-3
              outline-none
              px-1
              py-1
              text-black
              bg-orange-400
              text-sm
              active:scale-y-75 
              transition-transform
              '
              onClick={()=>setMycolor('rgb(251 146 60)')}
              >Orange</button>
               <button className='
              mx-2
              mt-3
              outline-none
              px-1
              py-1
              bg-yellow-200
              text-sm
              active:scale-y-75 
              transition-transform
              text-black
              '
              onClick={()=>setMycolor('rgb(254 240 138)')}
              >Yellow</button>
               <button className='
              mx-2
              mt-3
              outline-none
              px-1
              py-1
              bg-violet-600
              text-sm
              active:scale-y-75 
              transition-transform
              ' onClick={()=>setMycolor('rgb(124 58 237)')}
              >Violet</button>
               <button className='
              mx-2
              mt-3
              outline-none
              px-1
              py-1
              bg-pink-500
               
              
              active:scale-y-75 
              transition-transform
              

              text-sm'
              onClick={()=>setMycolor('rgb(236 72 153)')}
              
              >Pink</button>
              <button className='
              mx-2
              mt-3
              outline-none
              px-1
              py-1
              text-black
              bg-green-400
               
              
              active:scale-y-75 
              transition-transform
              

              text-sm
              '
              onClick={()=>setMycolor('rgb(74 222 128)')}
              >Green </button>
              
              
              
               

              </div>
 
                

                  
              </div>
       {/* Footer */}
            <div className="
              bg-gray-200 py-2
                container mx-auto
              text-gray-800 
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
