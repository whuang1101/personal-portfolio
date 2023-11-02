import "../css/skills.css"
import python from "../svg/python-svgrepo-com.svg"
import Cplusplus from "../svg/c++.svg"
import java from "../svg/java.svg"
import javascript from "../svg/javascript.svg"
import swift from "../svg/swift.svg"
import matlab from  "../svg/matlab.svg"
import react from "../svg/react.svg"
import vue from "../svg/vue.svg"
import node from "../svg/node.svg"
import express from "../svg/express.svg"
import mongo from "../svg/mongo.svg"
import jest from "../svg/jest.svg"
import tailwind from "../svg/tailwind.svg"
import git from "../svg/git.svg"
import heroku from  "../svg/heroku.svg"
import vscode from "../svg/vscode.svg"
import figma from "../svg/figma.svg"
import canva from "../svg/canva.svg"
import sourceCode from "../svg/source-code.svg"  
import framework from "../svg/framework.svg"
import technology from "../svg/technology.svg"  
import {motion} from "framer-motion"
const SkillsPage = () => {
    return (
        <div className="skills-page" id="skills">
            <div className="skills-center">
                <h1 className="about-me-title"><span style={{color:"white"}}>My </span><span className="about-color">Skills </span>
                <span style={{color:"white"}}>━━━━━━━</span></h1>
                <div className="skills-boxes">
                    <div className="skills-box">
                        <motion.div className="languages" whileHover={{y:"-2.5%"}}>
                            <img src={sourceCode} alt="Source Code" width={"40%"} style={{paddingBottom:"2em"}}/>
                            <h3 className="skill-title">
                                Languages
                            </h3>
                            <div className="skills">
                                <div className="skill-icon"><span>Python</span> <img src={python} alt="python logo" className="icon"/> </div>
                                <div className="skill-icon"><span>C++</span><img src={Cplusplus} alt="c++ logo" className="icon"/> </div>
                                <div className="skill-icon"><span>Java</span><img src={java} alt="java logo" className="icon"/> </div>
                                <div className="skill-icon"><span>JS</span><img src={javascript} alt="javascript logo" className="icon"/> </div>
                                <div className="skill-icon"><span>Matlab</span><img src={matlab} alt="matlab logo" className="icon"/> </div>
                                <div className="skill-icon"><span>Swift</span><img src={swift} alt="swift logo" className="icon"/> </div>
                            </div>
                        </motion.div>
                    </div>
                    <div className="skills-box">
                            <motion.div className="languages" whileHover={{y:"-2.5%"}}>
                            <img src={framework} alt="Source Code" width={"40%"} style={{paddingBottom:"2em"}}/>

                            <h3 className="skill-title">
                                Frameworks/Libraries/Databases
                            </h3>
                            <div className="skills">
                                <div className="skill-icon"><span>React.js</span> <img src={react} alt="react logo" className="icon"/> </div>
                                <div className="skill-icon"><span>Vue.js</span> <img src={vue} alt="vue logo" className="icon"/> </div>
                                <div className="skill-icon"><span>Node.js</span> <img src={node} alt="node logo" className="icon"/> </div>
                                <div className="skill-icon"><span>Express.js</span> <img src={express} alt="express logo" className="icon"/> </div>
                                <div className="skill-icon"><span>MongoDb</span> <img src={mongo} alt="mongoDb logo" className="icon"/> </div>
                                <div className="skill-icon"><span>Jest</span> <img src={jest} alt="Jest logo" className="icon"/> </div>
                                <div className="skill-icon"><span>Tailwind</span> <img src={tailwind} alt="Tailwind logo" className="icon"/> </div>
                                <div>Jquery</div>
                                <div>Django</div>   
                            </div>
                        </motion.div>
                    </div>
                    <div className="skills-box">
                        <motion.div className="languages" whileHover={{y:"-2.5%"}}>
                            <img src={technology} alt="Source Code" width={"40%"} style={{paddingBottom:"1em"}}/>

                            <h3 className="skill-title">
                                Technologies
                            </h3>
                            <div className="skills">
                                <div className="skill-icon"><span>Git</span> <img src={git} alt="git logo" className="icon"/> </div>
                                <div className="skill-icon"><span>Heroku</span> <img src={heroku} alt="heroku logo" className="icon"/> </div>
                                <div className="skill-icon"><span>VS Code</span> <img src={vscode} alt="vscode logo" className="icon"/> </div>                                
                                <div className="skill-icon"><span>Figma</span> <img src={figma} alt="figma logo" className="icon"/> </div>                               
                                <div className="skill-icon"><span>Canva</span> <img src={canva} alt="canva logo" className="icon"/> </div>                              
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default SkillsPage