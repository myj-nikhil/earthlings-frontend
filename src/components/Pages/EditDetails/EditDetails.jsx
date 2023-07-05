import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "../../Buttons/LogoutButton/LogoutButton";
import HomeButton from "../../Buttons/HomeButton/HomeButton";
import "./EditDetails.css";
import axios from "axios";

import { IKContext, IKUpload } from 'imagekitio-react';

// Environment variables
const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
const urlEndpoint = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;
const dbApiUrl = import.meta.env.VITE_DB_API_URL;
const authenticationEndpoint = `${dbApiUrl}/imagekit-auth`;

export default function EditDetailsPage() {
  const { user, isAuthenticated } = useAuth0();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [isUploadInProgess, setIsUploadInProgess] = useState(false); //state to track image upload

  // Event handler for name input change
  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  // Event handler for email input change
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  // Event handler for form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Name:", name);
    console.log("Email:", email);
    let userId = user.sub;
    console.log(userId);
    const url = `${dbApiUrl}/update-auth0-user-data`;
    const postData = {
      data: { picture: pictureUrl, name: name, email: email },
      userId: `${userId}`,
    };
    axios
      .post(url, postData)
      .then((response) => {
        const responseData = response.data;
        console.log(responseData);
        alert("Details updated Successfully");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  let pictureUrl;

  // Error callback for file upload
  const onError = err => {
    setIsUploadInProgess(false);
    console.log("Error", err);
  };

  // Success callback for file upload
  const onSuccess = res => {
    setIsUploadInProgess(false);
    console.log("Success", res);
    pictureUrl = res.url;
    console.log(pictureUrl);
  };

  const onUploadProgress = progress => {
    setIsUploadInProgess(true);
    console.log("Progress", progress);
  };

  // Component for file upload
  function FileUpload() {
    return (
      <IKContext 
        publicKey={publicKey} 
        urlEndpoint={urlEndpoint} 
        authenticationEndpoint={authenticationEndpoint} 
      >
        <IKUpload
          fileName="test-upload.png"
          onError={onError}
          onSuccess={onSuccess}
          onUploadProgress={onUploadProgress}
        />
      </IKContext>
    );
  }

  return (
    <>
      {isAuthenticated && (
        <>
          <LogoutButton />
          <HomeButton />

          {/* Edit details form */}
          <form className="edit-details-form" onSubmit={handleSubmit}>
            <div className="edit-details-form-div" style={{display:"flex" , flexDirection:"row", alignItems:"center"}}>
              <div>
                {/* Display user picture */}
                <label
                  htmlFor="user-image"
                  style={{
                    display: "inline-block",
                    marginTop: "-25px",
                    marginLeft: "10px",
                  }}
                >
                  Picture:
                </label>
                <img
                  src={user.picture}
                  className="edit-details-form-inputs"
                  style={{
                    height: "60px",
                    width: "60px",
                    marginLeft: "10px",
                    marginTop: "100px",
                    padding: "0",
                    marginBottom: "-20px",
                  }}
                />
              </div>
              <div style={{marginTop:"120px" , marginLeft:"15px"}}>
                {/* File upload component */}
                <FileUpload />
              </div>
            </div>

            {/* Name input */}
            <div className="edit-details-form-div" style={{ marginTop: "15px" }}>
              <label htmlFor="name" className="edit-details-form-inputs">
                Name:
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={handleNameChange}
                style={{
                  height: "10px",
                  maxWidth: "250px",
                  marginLeft: "0px",
                  width: "220px",
                }}
              />
            </div>

            {/* Email input */}
            <div className="edit-details-form-div">
              <label htmlFor="email" className="edit-details-form-inputs">
                Email:
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                style={{ height: "25px", maxWidth: "250px" }}
              />
            </div>

            {/* User ID */}
            <div className="edit-details-form-div">
              <label
                htmlFor="uid"
                className="edit-details-form-inputs"
                style={{ marginRight: "10px" }}
              >
                UID:
              </label>
              <input
                type="text"
                id="uid"
                value={user.sub}
                readOnly={true}
                style={{
                  display: "inline-block",
                  height: "25px",
                  padding: "2px",
                  cursor: "not-allowed",
                }}
              />
            </div>

            {/* Submit button */}
            {/* Hide the submit button when image upload is in progress */}
            {!isUploadInProgess && <><button type="submit">Submit</button></>}
          </form>
        </>
      )}
    </>
  );
}
