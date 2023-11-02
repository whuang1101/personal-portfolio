import "../css/about.css"
import selfie from "../assets/IMG_5782.png"
import { motion, useInView } from 'framer-motion';
import { useRef } from "react";
const AboutPage = () => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })


    return (
      <div
       className='about' id="about">
        <div className="about-center">
          <div className="about-me"
              ref={ref}    
              style={{
                transform: isInView ? "none" : "translateX(-200px)",
                opacity: isInView ? 1 : 0,
                transition: "all 1s cubic-bezier(0.17, 0.55, 0.55, 1) 1s"
              }} >
            <div className="about-me-title">
            <span className="about-color">About</span> <span style={{color:"white"}}>Me</span> <span className="about-color" style={{fontWeight:"bolder"}}>━━━━━━━</span>
            </div>
            <div className="about-me-content">
              Hey, my name is Wilson Huang. I am a recent graduate from the University of Florida with a B.S. in Biomedical Engineering.
              I am currently looking for a full-time software engineering position. I am passionate about building web applications and learning new technologies.
              I embarked on a self-taught computer science journey and completing the open source boot camp The Odin Project. In my free time, I enjoy playing games, 
              watching movies, and developing new apps.
            </div>
          </div>
          <div className="me-pic"         
          ref={ref}    
      style={{
        transform: isInView ? "none" : "translateX(-200px)",
        opacity: isInView ? 1 : 0,
        transition: "all 1s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s"
      }}>
            <img src={selfie} alt="Selfie"  width={"40%"}style={{borderRadius:"2em"}}/>
          </div>
        </div>
      </div>
    );
  };
  
  export default AboutPage;
  