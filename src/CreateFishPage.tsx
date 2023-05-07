/**
 * Fish Creator Page
 * 
 * Gets user data, 
 * allows user to create fish, 
 * sends fish and user data back up to server to update db
 * 
 * TODO:
 * 
 * //NOT UPDATED SINCE WE SWITCHED TO GAME MAKER
 * //need to get user data, push fish data to firebase with user uuid
 * 
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
import Fish from "./Fish";

//asset loading
let assets = {};
const fishAssets = loadFishAssets(); //an object that contains each asset file
const creatorFonts = importAll(
    require.context("./fonts", false, /\.(ttf)$/)
  );

//p5 fish creator stuff
function sketch(p5: P5) {
  let bg = p5.color(77,132,32);
  let font;

  //UI variables
  let nameInput;
  let currentPart = "head";
  let leftButton, sizeSlider, rightButton;
  let color1, color2, color3;
  let submitButton;
  let w,h;

  //fish data
  let fish = {
    color1: randomHex(),
    color2: randomHex(),
    color3: randomHex(),
    body: {
      "head": [p5.floor(p5.random(0,fishAssets["head"].length)), p5.random()], //normalized size so can adjust in game to whatever
      "eye": [p5.floor(p5.random(0,fishAssets["eye"].length)), p5.random()],
      "dorsal": [p5.floor(p5.random(0,fishAssets["fin"].length)), p5.random()],
      "ventral": [p5.floor(p5.random(0,fishAssets["fin"].length)), p5.random()],
      "pectoral": [p5.floor(p5.random(0,fishAssets["fin"].length)), p5.random()],
      "tail": [p5.floor(p5.random(0,fishAssets["fin"].length)), p5.random()],
      "body": [p5.floor(p5.random(0,fishAssets["body"].length)), p5.random()],
    }
  }

  let fishParts: {body: Array<P5.Image>, head: Array<P5.Image>, eye: Array<P5.Image>, fin: Array<P5.Image>} = {
    body: [],
    head: [],
    eye: [],
    fin: [],
  }; //the p5 images preloaded

  p5.preload = () => {
    font = p5.loadFont(creatorFonts["MochiyPopOne-Regular.ttf"])
    console.log(creatorFonts["MochiyPopOne-Regular.ttf"]);
    Object.keys(fishAssets).forEach((part) => {
      fishAssets[part].forEach((file) => {
        let f = p5.loadImage(assets[file]);
        // console.log(f);
        fishParts[part].push(f);
      });
    });
  }


  p5.setup = () => {
    // console.log();
    p5.createCanvas(p5.windowWidth, p5.windowHeight - 50, p5.WEBGL); //how to get height of top bar dynamically? rn just inspecting
    p5.background(bg);
    p5.textFont(font);
    //settings
    p5.ellipseMode(p5.CENTER);
    p5.rectMode(p5.CENTER);
    p5.imageMode(p5.CENTER);
    p5.angleMode(p5.RADIANS);
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.noStroke();

    w = p5.width;
    h = p5.height;

    //UI
    nameInput = p5.createInput("FISH NAME").class("inputs").position(0, 50).size(w - 50, h/10);
    nameInput.center("horizontal");
    //TODO css styling
    // nameInput = p5.createInput("FISH NAME").class("inputs").position(40, 30).size(w - 50, h/10);
    
    sizeSlider = p5.createSlider(0, 1, fish.body.body[1], 0.01).position(3 * w/9, 6 * h/10);
    sizeSlider.input(()=>{
      fish.body[currentPart][1] = sizeSlider.value();
    });
    
    color1 = p5.createColorPicker(fish.color1).position(w/9, 7 * h/10).size(w/5, h/14);
    color1.input(()=>{
      fish.color1 = color1.value();
    });
    color2 = p5.createColorPicker(fish.color2).position(4 * w/9, 7 * h/10).size(w/5, h/14);
    color2.input(()=>{
      fish.color2 = color2.value();
    });
    color3 = p5.createColorPicker(fish.color3).position(7 * w/9, 7 * h/10).size(w/5, h/14);
    color3.input(()=>{
      fish.color3 = color3.value();
    });
    
    submitButton = p5.createButton("SUBMIT FISH").class("buttons").position(2*w/3, 9 * h/10).size(w/3, h/10);
    submitButton.pressed(()=>{ //send to server, confirm TODO

    });
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

//misc helper functions
function randomHex(){ // thanks https://css-tricks.com/snippets/javascript/random-hex-color/
  var randomColor = Math.floor(Math.random()*16777215).toString(16);
  return "#" + randomColor;
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
