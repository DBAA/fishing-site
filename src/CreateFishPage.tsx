/**
 * Fish Creator Page
 * 
 * Gets user data, 
 * allows user to create fish, 
 * sends fish and user data back up to server to update db
 * 
 * TODO:
 * real assets and standardization (400x400 resolution? centered content?)
 * asset info lookup from db or embedded into file name?
 * what are the fish stats we want to expose? how to describe move-sets? (could have an adj. type associated with each move-set/pattern)
 * implement cost of certain assets / bait currency associated with account?
 */

//original imports
import React, { useEffect, useState, useRef } from "react";
import firebase, { auth, provider } from "./firebase.js";
import NavBar from "./NavBar";
import { ContentContainer, ActionButton } from "./App";
import styled from "styled-components";

//p5 imports
import { ReactP5Wrapper } from "react-p5-wrapper";
import P5 from "p5";
// import Fish from "./Fish";
// import FishAssets from './FishParts.js';

//asset loading
let assets = {};
const fishAssets = loadFishAssets(); //an object that contains each asset file

//p5 fish creator stuff
function sketch(p5: P5) {
  let bg = p5.color(77,132,32);
  let fishParts: {body: Array<P5.Image>, head: Array<P5.Image>, eye: Array<P5.Image>, fin: Array<P5.Image>} = {
    body: [],
    head: [],
    eye: [],
    fin: [],
  }; //the p5 images preloaded

  p5.preload = () => {
    Object.keys(fishAssets).forEach((part) => {
      fishAssets[part].forEach((file) => {
        let f = p5.loadImage(assets[file]);
        console.log(f);
        fishParts[part].push(f);
      });
    });
  }

  p5.setup = () => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight - 50, p5.WEBGL); //how to get height of top bar dynamically? rn just inspecting
    p5.background(bg);
    p5.imageMode(p5.CENTER);

  }

  p5.draw = () => {
    // p5.background(200);
    p5.image(fishParts["head"][2], 0, 0, 100, 100);
    p5.image(fishParts["body"][2], -100, -100, 100, 100);
    p5.image(fishParts["fin"][2], 100, 100, 100, 100);

  }
}

function loadFishAssets(){
  //normally could get all this just from using folders in the asset directory, but don't know how with react
  assets = importAll(
    require.context("./fishParts", false, /\.(png|jpe?g|svg)$/)
  );
  
  const parts: {body: Array<string>, head: Array<string>, eye: Array<string>, fin: Array<string>} = {
    body: [],
    head: [],
    eye: [],
    fin: [],
  }

  Object.keys(assets).forEach((file, i)=>{
    //prob a better way using regex, but works for now
    if(file.startsWith("head")){
      parts["head"].push(file);
    } else if (file.startsWith("body")){
      parts["body"].push(file);
    } else if (file.startsWith("eye")){
      parts["eye"].push(file);
    } else if (file.startsWith("fin")){
      parts["fin"].push(file);
    } else {
      console.log("error with name of file: " + file);
    }
  });

  return parts;
}

//original react/ts stuff
type Props = {
  prevPage?: string;
};

function importAll(r) {
  let images = {};
  r.keys().map((item, index) => {
    images[item.replace("./", "")] = r(item);
  });
  return images;
}

const CreateFishPage = ({ prevPage }: Props) => {
  // const [assets, setAssets] = useState({});
  // useEffect(() => {
  //   const images = importAll(
  //     require.context("./assets", true, /\.(png|jpe?g|svg)$/)
  //   );
  //   setAssets(images);
  //   console.log(assets);
  // }, []);

  return (
    <>
      <NavBar />
      <ReactP5Wrapper sketch={sketch} />
      {/* <img src={assets["Dk_jr.jpg"]} /> */}
      {/* <ContentContainer>Fish Creator goes here</ContentContainer> */}
    </>
  );
};

export default CreateFishPage;
