import { useState } from "react";
import React from "react";

export default function Input({ onInputChange }) {
  const [inputText, setInputText] = useState("");

  const handleChange = (event) => {
   
    setInputText(event.target.value);
  };

  const handleClick = (e) => {
    e.preventDefault()
    onInputChange(inputText);
    console.log(inputText)
  };


  return (
    <>
      <div
        className="
    bg-teal-700
    border-spacing-2
    rounded-3xl
    mx-auto
    w-[420px]
    justify-between
    p-3
   
    "
      >
        <p
          className="
        text-xl
    font-semibold
        p-3
                "
        >
          Enter text & Select the Card
        </p>
        <form onSubmit={handleClick}>
          <div className="w-full max-w-sm">
            <input
              className="
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
              id="Kname"
              placeholder="Enter Name"
              type="text"
              value={inputText}
              onChange={handleChange}
            
          
            />
              
          </div>

          
          <div className="p-10
          
          my-14
          ">
            <button
              className="shadow bg-teal-450  hover:bg-teal-950 
               hover:text-white
                    focus:shadow-outline focus:outline-none
                    text-black font-bold
                    rounded
                    
                    text-2xl
                     

                    "
              type="submit"
               
            >
              PUSH
            </button>
          </div>
        </form>
         


    
  

         
      </div>
     
    </>
  );
}
