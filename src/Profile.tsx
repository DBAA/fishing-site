import React, { useEffect, useState, useRef } from "react";
import firebase, { auth, provider, storage } from "./firebase.js";
import NavBar from "./NavBar";
import { ContentContainer } from "./App";
import LoginModule, { LoginContainer, Field, SubButton } from "./LoginModule";
import styled from "styled-components";
import { ModuleBackground, DarkTextColor } from "./colors";

const WebLink = styled(Field)`
  width: 400px;
`;

const SubmissionForm = styled.form`
  margin: auto;
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
width: 100%;
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


const StatusText = styled.div`
  text-align: center;
  p {
    margin: 10px 0;
  }
  margin-bottom: 40px;
`;
const ThumbnailPreview = styled.img`
  width: 150px;
  margin-bottom: 10px;
`;
const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [uploadInProgress, setUploadInProgress] = useState<boolean>(false);
  const [selectedPlatform, setSelectedPlatform] = useState<any>(null);
  const [currentSubmissionRef, setCurrentSubmissionRef] = useState<any>(null);
  const nameEl = useRef<any>(null);
  const descriptionEl = useRef<any>(null);
  const usernameEl = useRef<any>(null);
  const thumbnailEl = useRef<any>(null);
  const linkEl = useRef<any>(null);
  const buildEl = useRef<any>(null);
  const [imageAsFile, setImageAsFile] = useState<any>("");
  const [buildAsFile, setBuildAsFile] = useState<any>("");
  const [buildProgress, setBuildProgress] = useState<any>(null);
  const [thumbnailURL, setThumbnailURL] = useState<any>("");
  const [buildURL, setBuildURL] = useState<any>("");
  const [ready, setReady] = useState<boolean>(false);
  const [imageLoc, setImageLoc] = useState<any>(null);
  const [buildLoc, setBuildLoc] = useState<any>(null);

  useEffect(() => {
    // Update the document title using the browser API

    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        // console.log(user);
        setReady(true);
        setProfile(null);
        //  get the profile
        const thisSubmission = firebase
          .database()
          .ref("players")
          .orderByChild("email")
          .equalTo(user.email);

        thisSubmission.on("value", (snapshot) => {
          if (snapshot.val() != null) {
            console.log(snapshot.val());
            console.log(snapshot.val()[Object.keys(snapshot.val())[0]]);
            var snapshotContent = snapshot.val()[
              Object.keys(snapshot.val())[0]
            ];

            if (snapshot.val()[Object.keys(snapshot.val())[0]] != null) {
              setProfile(snapshot.val()[Object.keys(snapshot.val())[0]]);
              setCurrentSubmissionRef([Object.keys(snapshot.val())[0]]);
            } else {
              setProfile(null);
            }

            if (snapshotContent.name) {
              nameEl.current.value = snapshotContent.name;
            }
            if (snapshotContent.id) {
              usernameEl.current.value = snapshotContent.id;
            }

            // if (snapshotContent.platform) {
            //   setSelectedPlatform(snapshotContent.platform);
            // }

            // if (snapshotContent.link) {
            //   linkEl.current.value = snapshotContent.link;
            // }

            var newURL = getThumbURL(snapshotContent.uuid, false);
            setThumbnailURL(newURL);
            // getThumbURL(snapshotContent.imageLoc);
            // setImageLoc(snapshotContent.imageLoc);

            if (snapshotContent.description != null) {
              descriptionEl.current.value = snapshotContent.description;
            }

            if (snapshotContent.buildLoc != null) {
              getBuildURL(snapshotContent.buildLoc);
              setBuildLoc(snapshotContent.buildLoc);
            }
          }
        });
      } else {
        setProfile(null);
        setReady(true);
      }
    });
  }, [user]);

  const getThumbURL = (imageLoc: string, shouldGetMeta: boolean) => {
    const gsReference = storage.refFromURL(
      "gs://budnet-prototype.appspot.com/avatars/" + imageLoc
    );
    gsReference.getDownloadURL().then(function (url) {
      setThumbnailURL(url);
      if (shouldGetMeta) {
        getMeta(url);
      }
    });
  };

  const getBuildURL = (buildLoc: string) => {
    const gsReference = storage.refFromURL(
      "gs://quarantine-jam.appspot.com/builds/" + buildLoc
    );
    gsReference.getDownloadURL().then(function (url) {
      setBuildURL(url);
      setBuildLoc(buildLoc);
    });
  };

  const getMeta = (url: any) => {
    var img = new Image();
    img.src = url;

    img.onload = function () {
      if (img.width == img.height) {
      } else {
        alert("Please upload a square avatar");
        setThumbnailURL(null);
        const storageRef = storage.ref();

        const uploadLocRef = storageRef.child("avatars/" + profile?.uuid);
        uploadLocRef.delete().then(function (snapshot) {
          console.log("deleted a blob or file!");

          setThumbnailURL(null);
          // alert(newURL);

          setImageLoc(null);
        });
      }
    };
  };

  const handleImageAsFile = (event: any) => {
    const image = event.target.files[0];
    var filesize = (image.size / 1024 / 1024).toFixed(4);
    if (parseFloat(filesize) > 2) {
      alert(
        "Hey, that file is kinda big. Would you mind uploading an image under 2MB? Thanks!"
      );
      thumbnailEl.current.value = null;
      return;
    }
    setImageAsFile(image);
    const storageRef = storage.ref();
    console.log(profile);
    const uploadLocRef = storageRef.child("avatars/" + profile?.uuid);
    uploadLocRef.put(image).then(function (snapshot) {
      console.log("Uploaded a blob or file!");
      var newURL = getThumbURL(profile?.uuid, true);
      setThumbnailURL(newURL);
      // alert(newURL);

      setImageLoc(profile?.uuid);
    });
  };

  const handleBuildAsFile = (event: any) => {
    const build = event.target.files[0];
    var filesize = (build.size / 1024 / 1024).toFixed(4);
    if (parseFloat(filesize) > 500) {
      alert(
        "Hey... so your build is weighing in at a hefty " +
          filesize +
          "MB. Do you think you could reduce that to under 500MB? If not, please use the link field to link to your build hosted on Dropbox or another platform."
      );
      buildEl.current.value = null;
      return;
    }
    setBuildAsFile(build);
    const storageRef = storage.ref();
    const buildUploadLocRef = storageRef.child(
      "builds/" + user.email + "/" + build.name
    );
    var buildUploadTask = buildUploadLocRef.put(build);

    buildUploadTask.on(
      "state_changed",
      function (snapshot) {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setBuildProgress(Math.floor(progress) + "%");
        console.log("Upload is " + progress + "% done");
        setUploadInProgress(true);
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log("Upload is paused");
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log("Upload is running");
            break;
        }
      },
      function (error) {
        // Handle unsuccessful uploads
      },
      function () {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        setBuildLoc(user.email + "/" + build.name);
        buildUploadTask.snapshot.ref
          .getDownloadURL()
          .then(function (downloadURL) {
            console.log("File available at", downloadURL);
            setBuildProgress("Done");
            setUploadInProgress(false);
          });
      }
    );
  };

  const handlePlatformChange = (event: any) => {
    setSelectedPlatform(event.target.value);
  };
  const finishSubmission = (event: any) => {
    event.preventDefault();
    if (uploadInProgress) {
      //nTODO: change to image
      // DONT LET THE USER SAVE YET!
      alert("Please wait for your build upload to complete before saving!");
    }
    const profiles = firebase.database().ref("players");

    // var newURL = getBuildURL(user.email + "/" + buildAsFile.name);
    // setBuildURL(newURL);
    //TODO: Allot for no image or build
    const item = {
      key: profile.uuid,
      name: nameEl.current.value,
      email: user.email,
      uuid: profile.uuid,
      memberSince: profile.memberSince,
      //  buildLoc: buildLoc,
      // link: linkEl.current.value,
      // lastUpdated: Date.now(),
    };
    if (currentSubmissionRef !== null) {
      firebase
        .database()
        .ref("players/" + currentSubmissionRef)
        .set(item);
      alert("Thanks, your profile has been updated!");
    } else {
      // profiles.push(item);
      // alert("Thanks, your profile has been saved!");
      // document.location.href = "/";
      alert("ref was null");
    }
  };

  return (
    <>
      <NavBar />
      {ready && (
        <ContentContainer>
          {user ? (
            <>
              {profile ? (
                <>
                  <StatusText>
                    <h1>Welcome {profile.name}!</h1>
                    <p>
                      Feel free to make changes below to your profile at any
                      time.
                    </p>
                  </StatusText>

                  <SubmissionForm onSubmit={finishSubmission}>
                    <h2>{profile ? "Edit " : "View "}Your Profile</h2>
                    <p>
                      (Don't worry, you can return to make changes at any time)
                    </p>
                    <Field
                      maxLength={50}
                      ref={nameEl}
                      type="text"
                      name="title"
                      placeholder="Your name or handle"
                      required
                    />
                    <div>Email: {profile?.email}</div>
                    <div>UUID: {profile?.uuid}</div>
                    {/* <textarea
                  maxLength={300}
                  ref={descriptionEl}
                  name="description"
                  placeholder="Describe your game!"
                  required
                /> */}

                    <FileRow>
                      <i>(Optional)</i> Upload an (square, less than 500x500 is
                      ideal) avatar:{" "}
                      <input
                        ref={thumbnailEl}
                        type="file"
                        onChange={handleImageAsFile}
                        name="thumbnail"
                        accept="image/png, image/jpeg"
                      ></input>
                    </FileRow>
                    {thumbnailURL && <ThumbnailPreview src={thumbnailURL} />}

                    {/* <FileRow>
                      <i>(Optional)</i> Enter a link to a website or build:{" "}
                      <WebLink
                        ref={linkEl}
                        type="url"
                        name="title"
                        placeholder="http://www.yoursite.com"
                      />
                    </FileRow> */}
                    <SubButton type="submit">Save</SubButton>
                  </SubmissionForm>
                </>
              ) : (
                <div>No profile data found</div>
              )}
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

export default ProfilePage;
