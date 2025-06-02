import React from "react";
import fb from "../Img/fb.svg";
import insta from "../Img/insta.svg";
import twitter from "../Img/twitter.svg";
import tiktok from "../Img/tiktok.svg";
import email from "../Img/email.svg";

import styled from "styled-components";

const Container = styled.div`
  background-color: rgb(39, 39, 39);
  height: auto;
  color: white;
  padding: 60px 0 10px 0;
  text-align: center;

  h1 {
    margin: 0;
    font-family: "Times New Roman", Times, serif;
    font-size: 30px;
  }
`;

const Socials = styled.div`
  position: relative;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    position: relative;
    margin: 0 20px;
  }
  p {
    display: block;
    margin-top: 20px; 
    text-align: center;
    
  }
`;

const Text = styled.div`
  font-family: 'Courier Prime', monospace;
  font-weight: 700;
  font-size: 2.5rem;
  line-height: 1.15;
  letter-spacing: 0.05em;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.5rem; 
    line-height: 1.2;
    letter-spacing: 0.04em;
  }
`

const Credits = styled.div`
  margin-top: 2.5em;
  margin-bottom: 1em;
  padding: 2em;
  font-family: 'Hanken Grotesk', monospace;
  line-height: 1.5;

  a {
    color: white;
    text-decoration: underline;
    cursor: pointer;
    display: inline-block;
    margin-top: 0.5em;
    
    &:hover {
      opacity: 0.8;
    }
  }
`;

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <Container>
        <h1>DAILY BRUIN</h1>
        <Socials>
          <a href="https://www.instagram.com/dailybruin" target="_blank" rel="noreferrer">
            <img src={insta} alt="Instagram" />
          </a>
          <a href="https://www.facebook.com/dailybruin" target="_blank" rel="noreferrer">
            <img src={fb} alt="Facebook" />
          </a>
          <a href="https://www.twitter.com/dailybruin" target="_blank" rel="noreferrer">
            <img src={twitter} alt="Twitter" />
          </a>
          <a href="https://www.tiktok.com/@dailybruin" target="_blank" rel="noreferrer">
            <img src={tiktok} alt="TikTok" />
          </a>
          <a href="http://eepurl.com/cFEiZX" target="_blank" rel="noreferrer">
            <img src={email} alt="Email" />
          </a>
        </Socials>
        <Credits>
          Built with Suzy's <span className="heart">♥</span> in Kerckhoff 118 by Noah Hrung and Liam McGlynn. Designed and illustrated by Noah Hrung.
          <br />
          <a onClick={scrollToTop}>Back to top</a>
        </Credits>
      </Container>
    </>
  );
};

export default Footer;