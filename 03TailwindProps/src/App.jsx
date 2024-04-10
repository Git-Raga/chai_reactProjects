import {useState } from "react";
import React from "react"; 
import './App.css'
import Cards from './components/Cards'
import Input from './components/Input'

function App() {
  const [textFromInput, setTextFromInput] = useState("");
  const handleInputChange = (text) => {
    setTextFromInput(text);
  };

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
            Project 03 | Tailwind CSS & Props (contextAPI)
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
                  <Input onInputChange={handleInputChange} />
                  <Cards cardname="Card-1"inputText={textFromInput}/>
                  <Cards cardname="Card-2"inputText={textFromInput}/>

                  
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
