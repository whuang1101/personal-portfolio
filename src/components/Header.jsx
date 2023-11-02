import { useEffect, useState } from "react";
import { Link } from 'react-scroll';
import home from "../svg/house.svg"
import person from "../svg/person.svg"
import technology from "../svg/technology_white.svg"  
import project from "../svg/project.svg"

useEffect
const Header = () =>{
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
          if (window.scrollY > 0) {
            setIsSticky(true);
          } else {
            setIsSticky(false);
          }
        };
    
        window.addEventListener('scroll', handleScroll);
    
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
      }, []);
  
    return (
        <header className={`${isSticky ? 'sticky' : ''}`}>
            <nav>
                <h1 className="name"><span>Wilson</span><span className={`${isSticky ? '' : 'title-color'}`}>Huang</span></h1>
                <ul className="about-project">
                    <Link to="home"smooth={true} duration={1000} className="hoverable-element"><li><img src={home} alt="home" className="smaller-icon"/><span>Home</span></li></Link>
                    <Link to="about"smooth={true} duration={1000} className="hoverable-element"><li><img src={person} alt="person" className="smaller-icon"/><span>About Me</span></li></Link>
                    <Link to="skills"smooth={true} duration={1000} className="hoverable-element"><li><img src={technology} alt="skills" className="smaller-icon"/><span>Skills</span></li></Link>
                    <Link to="project"smooth={true} duration={1000} className="hoverable-element"><li><img src={project} alt="project" className="smaller-icon"/><span>Projects</span></li></Link>
                </ul>
            </nav>
        </header>
    );
}
export default Header

