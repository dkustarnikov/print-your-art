"use client";
import { SetStateAction, useState } from "react";
import Image from "../../node_modules/next/image";

import FormData from "form-data";

import {
  TextField,
  Typography,
  Icon,
  Button,
  CircularProgress,
} from "@mui/material";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export default function Home() {
  const [enteredFirstPrompt, setEnteredFirstPrompt] = useState(false);
  const [finalImageIsCreated, setFinalImageIsCreated] =
    useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [imageBase64, setImageBase64] = useState<string>("");
  const [blobImage, setBlobImage] = useState<string>("");
  const [continueEditing, setContinueEditing] = useState<boolean>(false);
  const [promptEnteredByUser, setPromptEnteredByUser] = useState<string>("");
  const [previousPrompt, setPreviousPrompt] = useState<string>("");
  const [revisedPrompt, setRevisedPrompt] = useState<string>("");

  const handleCreateImage = async () => {
    setLoading(true);
    setEnteredFirstPrompt(true);

    // try {
    const resultAll = await handleFetchDalleCreate();
    const revisedPrompt = resultAll.revised_prompt;
    setRevisedPrompt(revisedPrompt);

    const result = resultAll.data;
    if (result && result.length > 0) {
      const b64_json = result[0].b64_json; //At this point we have a base64 image
      setImageBase64(b64_json);

      //To display this image, I will convert it to a Blob so it works as a src
      const blob = new Blob([Buffer.from(b64_json, "base64")], {
        type: "image/png",
      });
      setBlobImage(URL.createObjectURL(blob));
    } else {
      console.log("No image data received");
    }

    //   if (result && result.length > 0) {
    //     // Assuming result[0].b64_json contains the base64-encoded binary data of the image
    //     const b64Data = result[0].b64_json;
    //     const imageUrl = URL.createObjectURL(blob);
    //     console.log("imageUrl inside handleFirstArrowClick", imageUrl);
    //     setImageURL(imageUrl); // Use this imageUrl as the src for an <img> tag
    //   } else {
    //     console.log("No image data received");
    //   }
    // } catch (error) {
    //   console.error("Failed to talk to OpenAI", error);
    // }

    setLoading(false);
  };

  async function handleFetchDalleCreate() {
    try {
      const response = await fetch("/api/dalleCreate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: promptEnteredByUser }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      // console.log("result.data", result.data);
      // Assuming data is the object with a "data" property that's an array
      return result.data; // Make sure to return the data here
    } catch (error) {
      console.error("Error fetching data: ", error);
      // Optionally, return an empty array or some error indication as needed
      return []; // Return an empty array to signal no data could be retrieved
    }
  }

  async function mockFetchDalle() {
    try {
      setPromptEnteredByUser("something");
      // Simulate a delay to mimic network request
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Mock response data with base64 encoded JSON containing a PNG image URL
      const mockImageUrl =
        "https://img-c.udemycdn.com/user/200_H/24036764_d125_11.png"; // Assuming .png extension
      const mockJsonData = JSON.stringify({ url: mockImageUrl });
      const mockB64Data = Buffer.from(mockJsonData).toString("base64"); // Encode to base64

      const mockData = {
        data: [
          {
            b64_json: mockB64Data,
          },
        ],
      };

      console.log("mockData.data", mockData.data);

      return mockData.data;
    } catch (error) {
      console.error("Error in mock fetch: ", error);
    }
  }

  const finalizeTheImage = async () => {
    setLoading(true);
    setFinalImageIsCreated(true);
    setLoading(false);
  };

  const keepEditing = async () => {
    setContinueEditing(true);
    setPreviousPrompt(promptEnteredByUser);
  };

  const handleContinueEditingButton = async () => {
    setLoading(true);
    // console.log("The prompt we would've sent: ", promptEnteredByUser);

    // const result = await handleFetchDalleEdit();

    // console.log("result from handleFetchDalleEdit", result);
    setContinueEditing(false);
    setLoading(false);
  };

  async function handleFetchDalleEdit() {
    const formData = new FormData();
    const byteString = atob(imageBase64);
    const byteNumbers = new Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      byteNumbers[i] = byteString.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const imageBlob = new Blob([byteArray], { type: "image/png" });

    formData.append("image", imageBlob, "image.png");
    formData.append("prompt", promptEnteredByUser);

    const response = await fetch("/api/dalleEdit", {
      method: "POST",
      body: formData, // Send the FormData object directly
    });

    const data = await response.json();
    return data;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {!loading && !enteredFirstPrompt && (
        <div style={{ margin: "auto" }}>
          <Typography>Enter a prompt</Typography>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <TextField
              onChange={(e: { target: { value: SetStateAction<string> } }) => {
                setPromptEnteredByUser(e.target.value);
              }}
              inputProps={{ maxLength: 1000 }}
              sx={{}}
              id="outlined-basic"
              label=""
              variant="outlined"
            />
            <Button
              startIcon={<ChevronRightIcon />}
              onClick={handleCreateImage}
            />
          </div>
        </div>
      )}
      {!loading &&
        enteredFirstPrompt &&
        !finalImageIsCreated &&
        !continueEditing && (
          <>
            <div style={{ marginTop: "2rem" }}>Pressed it</div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Image
                src={blobImage}
                alt="Description of Image"
                width={200}
                height={200}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="outlined"
                  color="success"
                  style={{
                    marginRight: "2rem",
                    marginTop: "2rem",
                  }}
                  onClick={finalizeTheImage}
                >
                  I love it!
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  style={{
                    marginTop: "2rem",
                  }}
                  onClick={keepEditing}
                >
                  Enter another prompt
                </Button>
              </div>
            </div>
          </>
        )}
      {loading && (
        <div
          style={{
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography>Talking to the all-mighty OpenAI</Typography>
          <CircularProgress />
        </div>
      )}
      {!loading && finalImageIsCreated && (
        <Typography>
          Here a user will be able to put it on a shirt or a mug
        </Typography>
      )}
      {!loading && continueEditing && (
        <>
          <Typography>Previous image: </Typography>
          <Image
            src={blobImage}
            alt="Previous Image"
            width={200}
            height={200}
          />
          <Typography>Previous prompt: {previousPrompt} </Typography>
          <Typography>
            In the field below type what would you like to add to the image
          </Typography>
          <TextField
            onChange={(e: { target: { value: SetStateAction<string> } }) => {
              setPromptEnteredByUser(e.target.value);
            }}
            sx={{}}
            id="outlined-basic"
            label=""
            variant="outlined"
          />
          <Button
            startIcon={<ChevronRightIcon />}
            onClick={handleCreateImage}
          />
        </>
      )}
    </div>
  );
}
