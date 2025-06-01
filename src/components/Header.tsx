import styled from "styled-components";
import React from "react";

const DBHeader = styled("div")`
  z-index: 2001;

  position: -webkit-sticky;
  position: sticky;
  top: 0;
  // background:rgb(39, 39, 39);;
  background: rgb(39, 39, 39);;
  width: 100%;
  padding: 0.2em 0.2em;
  color: white;
  font-family: "Source Code Pro", monospace;
  // font-family: "ITC Century";
  font-weight: 200;
  font-style: italic;
  text-align: center;
  // text-transform: uppercase;
  font-size: clamp(6px, 0.5vw, 12px);
  line-height: 30px;
  white-space: nowrap;
  overflow: hidden;
  /* border-bottom: 2px solid black; */

  a {
    text-decoration: none;
    display: inline-block;
    width: 100%;
  }

  h1 {
    background: white;
    width: fit-content;
    margin: 0 auto;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    padding: 0 10px;
  }
`;

const Header = () => {
  return (
    <DBHeader>
      {/* Daily Bruin */}
      <a href="https://stack.dailybruin.com">
        {/*<img src={DBLogo} alt="Daily Bruin" /> */}
        <h1>../Daily Bruin/The Stack</h1>
      </a>
    </DBHeader>
  );
};

export default Header;