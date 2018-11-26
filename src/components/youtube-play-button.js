import styled from 'styled-components'

let YouTubePlayButton = styled.button`
  position: relative;
  font-size: 1em; /* change this to change size */
  width: 4em;
  height: 3em;
  padding: 0;
  background: #000;
  border-radius: 50% / 10%;
  color: #fff;
  text-align: center;
  text-indent: 0.1em;
  transition: all 150ms ease-out;
  border: none;

  &:hover {
    background: #ff0000;
  }

  &::before {
    position: absolute;
    background: inherit;
    border-radius: 5% / 50%;
    bottom: 9%;
    content: '';
    left: -5%;
    right: -5%;
    top: 9%;
  }

  &::after {
    position: absolute;
    border-style: solid;
    border-width: 1em 0 1em 1.732em;
    border-color: transparent transparent transparent rgba(255, 255, 255, 0.75);
    content: ' ';
    font-size: 0.75em;
    height: 0;
    margin: -1em 0 0 -0.75em;
    top: 50%;
    width: 0;
  }
`

export default YouTubePlayButton
