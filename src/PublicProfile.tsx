import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import firebase, { auth, provider, storage } from "./firebase.js";
import NavBar from "./NavBar";
import { ContentContainer } from "./App";
import LoginModule, { LoginContainer, Field, SubButton } from "./LoginModule";
import styled from "styled-components";
import { ModuleBackground, DarkTextColor } from "./colors";
import { isReactNative } from "./img/tile_files/0.chunk.js";

const WebLink = styled(Field)`
  width: 400px;
`;

const InfoPane = styled.div`
  margin-left: 10px;
`;

const InnerContainer = styled.div`
  margin: auto;
  display: flexbox;
  width: 80%;
  color: ${DarkTextColor};
  background-color: ${ModuleBackground};
  padding: 20px;
  box-sizing: border-box;

  textarea {
    font-size: 16px;
    width: 100%;
    height: 100px;
    border: 0;
    -webkit-appearance: none;
    box-sizing: border-box;
    resize: none;
    margin: 5px 0px;
  }

  label {
    display: flex;
    align-items: center;
    i {
      margin: 0 3px;
    }

    @media (max-width: 992px) {
      flex-direction: column;
      text-align: left;
    }
  }
  p {
    margin-bottom: 20px;
  }
`;

const FileRow = styled.div`
width; 100%;
margin: 10px 0px;
font-family: 'Raleway';
display: flex;
align-items: center;
input{
    margin-left: 10px;
}

@media(max-width: 992px){
    flex-direction: column;
    text-align: left;
}

i{margin-right:5px; color: grey;}
`;

const BuildRow = styled(FileRow)`
  justify-content: space-between;
  div {
    display: flex;
    align-items: center;

    @media (max-width: 992px) {
      flex-direction: column;
      text-align: left;
    }
  }
`;

const StatusText = styled.div`
  text-align: center;
  p {
    margin: 10px 0;
  }
  margin-bottom: 40px;
`;
const ThumbnailPreview = styled.img`
  width: 150px;
  height: 150px;
  object-fit: contain;
  margin-bottom: 10px;
`;
const PublicProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [currentSubmissionRef, setCurrentSubmissionRef] = useState<any>(null);
  const titleEl = useRef<any>(null);
  const descriptionEl = useRef<any>(null);
  const usernameEl = useRef<any>(null);
  const thumbnailEl = useRef<any>(null);
  const linkEl = useRef<any>(null);
  const buildEl = useRef<any>(null);

  const { uuid } = useParams();

  const [thumbnailURL, setThumbnailURL] = useState<any>("");
  const [buildURL, setBuildURL] = useState<any>("");
  const [ready, setReady] = useState<boolean>(false);
  const [imageLoc, setImageLoc] = useState<any>(null);
  const [apps, setApps] = useState<any[]>([]);
  useEffect(() => {
    // const thisSubmission = firebase
    //   .database()
    //   .ref("Users")
    //   .orderByChild("uuid")
    //   .equalTo(uuid);
    const myApps = firebase.database().ref("Apps");

    myApps.on("value", (snapshot) => {
      let items = snapshot.val();
      let appsList = [];
      for (let item in items) {
        // appsList.push(items[item]);
      }
      // // sort by timestamp
      // const sortedSubmissionsList = submissionsList.sort(
      //   (a, b) => b.lastUpdated - a.lastUpdated
      // );

      setApps(appsList);
    });

    const thisSubmission = firebase
      .database()
      .ref("Users")
      .orderByChild("uuid")
      .equalTo(uuid);

    thisSubmission.on("value", (snapshot) => {
      //  console.log("SNQOPHIR");
      // console.log(snapshot.val());
      if (snapshot.val() !== null) {
        console.log(snapshot.val());
        console.log(snapshot.val()[Object.keys(snapshot.val())[0]]);
        var snapshotContent = snapshot.val()[Object.keys(snapshot.val())[0]];
        setReady(true);
        if (snapshot.val()[Object.keys(snapshot.val())[0]] != null) {
          setProfile(snapshot.val()[Object.keys(snapshot.val())[0]]);
          var newURL = getThumbURL(
            snapshot.val()[Object.keys(snapshot.val())[0]].uuid
          );
          setThumbnailURL(newURL);
          setCurrentSubmissionRef([Object.keys(snapshot.val())[0]]);
        } else {
          setProfile(null);
          setReady(true);
        }
      } else {
        setReady(true);
      }
    });
  }, []);
  // if (snapshotContent.name) {
  //   titleEl.current.value = snapshotContent.name;
  // }
  // if (snapshotContent.id) {
  //   usernameEl.current.value = snapshotContent.id;
  // }

  // if (snapshotContent.platform) {
  //   setSelectedPlatform(snapshotContent.platform);
  // }

  // if (snapshotContent.link) {
  //   linkEl.current.value = snapshotContent.link;
  // }

  // if (snapshotContent.imageLoc != null) {
  //   getThumbURL(snapshotContent.imageLoc);
  //   setImageLoc(snapshotContent.imageLoc);
  // }

  // if (snapshotContent.description != null) {
  //   descriptionEl.current.value = snapshotContent.description;
  // }

  // if (snapshotContent.buildLoc != null) {
  //   getBuildURL(snapshotContent.buildLoc);
  //   setBuildLoc(snapshotContent.buildLoc);
  // }

  // Update the document title using the browser API

  //   auth.onAuthStateChanged((user) => {
  //     if (user) {
  //       setUser(user);
  //       console.log(user);
  //       setReady(true);
  //     }
  //       //  get the profile
  //       const thisSubmission = firebase
  //         .database()
  //         .ref("Users")
  //         .orderByChild("email")
  //         .equalTo(user.email);

  //       thisSubmission.on("value", (snapshot) => {
  //         if (snapshot.val() !== null) {
  //           console.log(snapshot.val());
  //           console.log(snapshot.val()[Object.keys(snapshot.val())[0]]);
  //           var snapshotContent = snapshot.val()[
  //             Object.keys(snapshot.val())[0]
  //           ];

  //           if (snapshot.val() != null) {
  //             setSubmission(snapshot.val()[Object.keys(snapshot.val())[0]]);
  //             setCurrentSubmissionRef([Object.keys(snapshot.val())[0]]);
  //           }

  //           if (snapshotContent.name) {
  //             titleEl.current.value = snapshotContent.name;
  //           }
  //           if (snapshotContent.id) {
  //             usernameEl.current.value = snapshotContent.id;
  //           }

  //           if (snapshotContent.platform) {
  //             setSelectedPlatform(snapshotContent.platform);
  //           }

  //           if (snapshotContent.link) {
  //             linkEl.current.value = snapshotContent.link;
  //           }

  //           if (snapshotContent.imageLoc != null) {
  //             getThumbURL(snapshotContent.imageLoc);
  //             setImageLoc(snapshotContent.imageLoc);
  //           }

  //           if (snapshotContent.description != null) {
  //             descriptionEl.current.value = snapshotContent.description;
  //           }

  //           if (snapshotContent.buildLoc != null) {
  //             getBuildURL(snapshotContent.buildLoc);
  //             setBuildLoc(snapshotContent.buildLoc);
  //           }
  //         }
  //       });
  //     } else {
  //       setUser(null);
  //       setReady(true);
  //     }
  //   });
  // }, [user]);

  const formatDate = (timestamp: number) => {
    var date = new Date(timestamp);
    console.log("DATE");
    console.log(date.getTime());
    var formattedDate =
      +date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();

    return formattedDate;
  };
  const getThumbURL = (imageLoc: string) => {
    const gsReference = storage.refFromURL(
      "gs://budnet-prototype.appspot.com/avatars/" + imageLoc
    );
    gsReference.getDownloadURL().then(function (url) {
      setThumbnailURL(url);
    });
  };

  // const handleImageAsFile = (event: any) => {
  //   const image = event.target.files[0];
  //   var filesize = (image.size / 1024 / 1024).toFixed(4);
  //   if (parseFloat(filesize) > 2) {
  //     alert(
  //       "Hey, that file is kinda big. Would you mind uploading an image under 2MB? Thanks!"
  //     );
  //     thumbnailEl.current.value = null;
  //     return;
  //   }
  //   setImageAsFile(image);
  //   const storageRef = storage.ref();
  //   const uploadLocRef = storageRef.child(
  //     "images/" + user.email + "/" + image.name
  //   );
  //   uploadLocRef.put(image).then(function (snapshot) {
  //     console.log("Uploaded a blob or file!");
  //     var newURL = getThumbURL(user.email + "/" + image.name);
  //     setThumbnailURL(newURL);
  //     setImageLoc(user.email + "/" + image.name);
  //   });
  // };
  let myApps = apps.filter((app) => app.Users[profile?.uuid] != null);
  return (
    <>
      <NavBar />
      {ready && (
        <ContentContainer>
          {profile ? (
            <>
              <InnerContainer>
                {thumbnailURL && <ThumbnailPreview src={thumbnailURL} />}
                <InfoPane>
                  <div>Name: {profile?.name}</div>
                  <div>UUID: {profile?.uuid}</div>
                  <div>
                    Member Since: {formatDate(parseInt(profile?.memberSince))}
                  </div>
                </InfoPane>
              </InnerContainer>
              <InnerContainer>
                <div>
                  {myApps.map(function (app: any, index: number) {
                    return <li key={index}>{app.displayName}</li>;
                  })}
                </div>
              </InnerContainer>
            </>
          ) : (
            <div>
              <LoginModule
                prevPage="/submit"
                title={
                  "Looks like you're not logged in! Log in to make a profile."
                }
              />
            </div>
          )}
        </ContentContainer>
      )}
    </>
  );
};

export default PublicProfilePage;
