import "../css/project.css"
import OdinBook from "../photos/odin-book.png"
import KeepInTouch from "../photos/keep-in-touch.png"
import PhotoTagging from "../photos/photo-tagging.png"
import MembersOnly from "../photos/members-only.png"
import Blog from "../photos/blog.png"
import FerventFashion from "../photos/fervent-fashion.png"
import react from "../svg/react.svg"
import node from "../svg/node.svg"
import express from "../svg/express.svg"
import javascript from "../svg/javascript.svg"
import figma from "../svg/figma.svg"
import mongo from "../svg/mongo.svg"
import socket from "../svg/socket.svg"
import passport from "../svg/passportjs.svg"
import { motion } from "framer-motion"



const ProjectsPage = () => {
    const allProjects = ["Odin Book", "KeepInTouch", "Pixel Finder", "Members Only", "The Best Blog", "Fervent Fashion"]
    const images = [OdinBook, KeepInTouch, PhotoTagging, MembersOnly, Blog, FerventFashion]
    const description = [
        "Social Media Platform",
        "Messenger App",
        "Where's the Pokemon? Game",
        "Message Board",
        "Blog with CRUD functionality",
        "E-Commerce Website",
    ]
    const made_with = [[mongo,express,react,node, passport,javascript,figma],
    [mongo,express,react,node,javascript, passport,figma,socket],
    [mongo,express,react,node,javascript],
    [mongo,express,react,node,javascript,passport],
    [mongo,express,react,node,javascript,figma],
    [react,javascript]
]
    const demo = ["https://lustrous-dodol-b9be51.netlify.app/",
"https://mellow-sfogliatella-52d786.netlify.app/",
"https://incandescent-froyo-150a8b.netlify.app/",
"https://members-only-production-dc78.up.railway.app/",
"https://main--euphonious-nougat-ad7d5a.netlify.app/",
"https://earnest-ganache-26ee42.netlify.app/"
]
    const liveCode = ["https://github.com/whuang1101/OdinBook",
"https://github.com/whuang1101/KeepInTouch",
"https://github.com/whuang1101/photo-tagging",
"https://github.com/whuang1101/members-only",
"https://github.com/whuang1101/blog_client",
"https://github.com/whuang1101/Shopping-Cart"
]
    return (
        <div className="project-page" id="project">
            <div className="project-center">
                <div className="about-me-title">
                    <span className="about-color">My</span> <span style={{color:"white"}}>Projects</span> <span className="about-color" style={{fontWeight:"bolder"}}>━━━━━━━</span>
                </div>
                <div className="project-cards">
                {allProjects.map((element, index) => (
                <div className="project-card" key={element}>
                    <img src={images[index]} alt={element} width={"100%"} height={"20%"} className="project-image"/>
                    <div className="project-info">
                        <h2 className="project-card-title">
                         {element}
                        </h2>
                        <div className="project-card-description">
                        {description[index]}
                        </div>
                        <div className="project-card-make">
                            Made With:
                            {made_with[index].map((element) => (
                                    <span key={element}>
                                        <img src={element} alt="python logo" className="smaller-icon"/>
                                    </span>
                            ))}
                        </div>
                        <div className="buttons">
                            <a href={demo[index]}>
                                <motion.button className="demo"
                                whileHover={{ scale: 1.1 }} 
                                whileTap={{ scale: 0.9 }}  
                                initial={{ scale: 1 }} >
                                    Demo
                                </motion.button>
                            </a>
                            <a href={liveCode[index]}>
                                <motion.button className="live-code"
                                whileHover={{ scale: 1.1 }} 
                                whileTap={{ scale: 0.9 }}  
                                initial={{ scale: 1 }} >
                                    Live Code
                                </motion.button>
                            </a>
                        </div>
                    </div>
                </div>
                ))}

                </div>
            </div>
        </div>
    )
}
export default ProjectsPage