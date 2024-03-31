import React from 'react'

export default function Input() {
  return (
    <>
    <div className='
    bg-teal-700
    border-spacing-2
    rounded-3xl
    mx-auto
    w-[420px]
    justify-between
    p-3
   
    '>
        <p className="
        text-xl
        font-semibold
        p-3
                ">Enter text & Select the Card</p> 
       <form className="w-full max-w-sm">
                <div>
                <input className="
                rounded-lg
                bg-teal-100
               
               
                 
                 mx-5
                 py-4 px-10
                 text-xl
                 font-bold
                 text-black
                 p-3

                focus:ring-4 focus:ring-black 
                "

                id="inline-full-name" 
                placeholder='Enter Name'
                type="text"/>

              </div>
  
            <div className='p-7'>
   
      
            <input className="mr-5 leading-tight
            w-4
            h-4
            p-4
            mb-4"
             type="checkbox"/>
                  <span className="text-xl ">      Card 1</span>
                  <br></br>
                <input className="mr-5 leading-tight
                 w-4
                 h-4
                 "
                  type="checkbox"/>
                  <span className="text-xl ">      Card 2</span>
               </div>
 
 
    
                
               
                    
                    <div className='p-10'>
                    <button className="shadow bg-teal-450  hover:bg-teal-950  hover:text-white
                    focus:shadow-outline focus:outline-none
                    text-black font-bold
                    rounded
                    
                    text-2xl
                     

                    " type="button">
                        PUSH 
                    </button>
                    </div>
          
                </form>
                        </div> 

    

    </>
  )
}
