import React, { useEffect, useState, useRef } from "react";
import firebase, { auth, provider } from "./firebase.js";
import NavBar from "./NavBar";
import { ContentContainer, ActionButton } from "./App";
import styled from "styled-components";

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
  const [assets, setAssets] = useState({});
  useEffect(() => {
    const images = importAll(
      require.context("./assets", false, /\.(png|jpe?g|svg)$/)
    );
    setAssets(images);
  }, []);

  return (
    <>
      <NavBar />
      <iframe width="100%" height="700px;" src="/show-creator"></iframe>
    </>
  );
};

export default CreateFishPage;
