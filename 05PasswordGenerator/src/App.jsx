import { useCallback, useState,useEffect,useRef } from "react";
import "./App.css";
function App() {
  
  const [passw, setPassw] = useState("");
  const [passwlength, setPasswLength] = useState(6);
  const [numberAllowed, setNumberAllowed] = useState(false);
  const [splcrAllowed, setSplcrAllowed] = useState(false);
  
  const handleSubmit = () => {};
  const handleChange = (event) => {
    setInputValue(event.target.value);
  };
  //ref hook
  const passwordref=useRef(null);
  const copypasswordtoclipboard=useCallback(()=>{
    passwordref.current?.select()
    window.navigator.clipboard.writeText(passw)
    },
    [passw])
  
  const passwGene=useCallback(()=>{
    let pass=""
    let passtr=
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    if(numberAllowed)passtr+="01234567890"
    if(splcrAllowed)passtr+="!@#$%^&*()~{}[]"

    for(let i=1;i<=passwlength;i++){
      let char=Math.floor(Math.random()*passtr.length)
      //console.log("Char value is ", char + "Value of i is : ",i)
      pass+=passtr.charAt(char)

    } setPassw(pass)


  },[passwlength,numberAllowed,splcrAllowed,setPassw])
  
  useEffect(()=>{
    passwGene()
  },
  [numberAllowed,splcrAllowed,passwlength])






  
  return (
    <>
      {/* container */}
      <div
        className=" 
        bg-slate-900
        h-[90vh] 
        flex flex-col
        font-poppins
        p-3
        rounded-xl
      "
      >
        {/* Header */}
        <div
          className="
            text-white 
              text-2xl
              mb-2              
              "
        >
          Project 05 | Password Generator
        </div>
        <hr></hr>
        {/* Body*/}
        <div
          className="
                  w-full
                  mt-40
                  flex-wrap
                  border-spacing-1
                  border
                  rounded-xl
                  inset-y-0 right-0
                  bg-cyan-700
                  text-black
                  text-xl
                  static
                  h-80
    "
        >
          <p>Generate Random Password</p>
          <hr></hr>
          <div
            className="relative
           mt-10
           p-5
           w-full
           flex items-center
           "
          >
            <input
              type="text"
              className="pl-14 pr-4 py-2 
                    border rounded-lg
                    w-full
                    text-black
                    ml-2
                    text-xl
                    outline-none
                    "
              placeholder="Random Generated Password"
              value={passw}
              readOnly
              ref={passwordref}
              
            />
            <div
              className="absolute  pl-3
                      flex items-center  
                      pointer-events-none
                      text-2xl
                      "
            >
              <i className="fa-sharp fa-solid fa-key text-gray-400"></i>
              <p> &nbsp;|</p>
            </div>
            <div>
              <button
                className="bg-gray-800 rounded-lg
                    text-white  
                    px-2 py-2 my-2 mx-2
                    w-24
                    h-12
                    text-sm
                    transform active:scale-x-75 transition-transform
                    hover:bg-stone-300
                    hover:text-black
                    "
                    onClick={copypasswordtoclipboard}

              >
 

                <i className="fa fa-clipboard" aria-hidden="true"></i>{" "}
                &nbsp;Copy
              </button>
            </div>
          </div>
          <div>
            <input
              className="
              cursor-pointer
              -translate-x-44
              "
              type="range"
              step="1"
              min="3"
              max="30"
              value={passwlength}
              onChange={(e) => {
                setPasswLength(e.target.value);
              }}
            />
            <label
              className="
                  absolute
                  -translate-x-40
                  mx-2
                  text-base
                  text-teal-100
          "
            >
              Password Length : {passwlength}
            </label>
          </div>
          <div
            className="
         mt-5
         flex-col
        "
          >
            {" "}
            <div
              className="
                translate-x-2
                  "
            >
              <input
                className="
                  cursor-pointer
                  h-4
                  w-4
                  "
                type="checkbox"
                id="numberallowed"
                checked={numberAllowed}
                onChange={() => {
                  setNumberAllowed((prev) => !prev);
                }}
              />
              <label
                className="
                   mx-5
                  text-base
                  text-white
                  "
              >
                Include Numbers
              </label>
            </div>
            <div
              className="
                  translate-x-12
                  translate-y-3
                  "
            >
              <input
                className="
                                    cursor-pointer
                                    h-4
                                    w-4
                                    "
                type="checkbox"
                id="splchrallowed"
                checked={splcrAllowed}
                onChange={() => {
                  setSplcrAllowed((prev) => !prev);
                }}
              />
              <label
                className="mx-5
                                  text-base
                                  text-white
                                  "
              >
                Include Special Characters
              </label>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div
          className="
              bg-gray-400 
              text-black  
                text-center
                rounded-2xl
                absolute 
                bottom-12 
                right-10
                left-10
                font-poppins
              "
        >
          <p>Raghav | April 24</p>
        </div>
      </div>
    </>
  );
}
export default App;

