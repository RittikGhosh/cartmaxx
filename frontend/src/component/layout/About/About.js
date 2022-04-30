import React from "react";
import "./aboutSection.css";
import { Button, Typography, Avatar } from "@material-ui/core";
import GithubIcon from "@material-ui/icons/GitHub";
import LinkdinIcon from "@material-ui/icons/LinkedIn";


const About = () => {

  const visitInstagram = () => {
    window.location = "https://rittick-portfolio.netlify.app";
  };

  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src="https://res.cloudinary.com/dslxeviu0/image/upload/v1650814238/avatars/Rittick/CC_20200916_161503_w6jnhh.png"
              alt="Founder"
            />

            <Typography>Rittick Ghosh</Typography>
            <Button onClick={visitInstagram} color="primary">
              My Portfolio Site
            </Button>
          </div>
          <div className="aboutSectionContainer2">
            
            <a
              href="https://www.linkedin.com/in/rittick-ghosh-a983ab1a3/"
              target="blank"
            >
              <LinkdinIcon className="linkedinSvgIcon" />
            </a>
            <a href="https://github.com/RittikGhosh">
              <GithubIcon className="githubSvgIcon" />
            </a>

          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
