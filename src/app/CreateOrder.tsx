// CreateOrder.tsx
import React, { SetStateAction, useState } from "react";
import {
  Typography,
  Button,
  ButtonGroup,
  CircularProgress,
  TextField,
} from "@mui/material";
import Image from "next/image";
import axios from "axios";

interface CreateOrderProps {
  blobImage?: string; // Prop for the image source
  revised_prompt?: string;
}

enum ProductType {
  NONE = "NONE",
  MUGS = "MUGS",
  TSHIRTS = "TSHIRTS",
}

const CreateOrder: React.FC<CreateOrderProps> = ({
  blobImage = "https://cdn1.vectorstock.com/i/1000x1000/05/45/pirate-sailing-ship-with-square-rigged-masts-vector-37600545.jpg",
  revised_prompt = "revised_prompt",
}) => {
  const [selectedProduct, setSelectedProduct] = useState<ProductType>(
    ProductType.NONE
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<string>("");
  const [recipientName, setRecipientName] = useState<string>("");
  const [recipientAddress1, setRecipientAddress1] = useState<string>("");
  const [recipientAddress2, setRecipientAddress2] = useState<string>("");
  const [recipientCity, setRecipientCity] = useState<string>("");
  const [recipientStateCode, setRecipientStateCode] = useState<string>("");
  const [recipientCountryCode, setRecipientCountryCode] = useState<string>("");
  const [recipientZip, setRecipientZip] = useState<string>("");

  const handleMugsClicked = async () => {
    setLoading(true);
    setSelectedProduct(ProductType.MUGS);

    try {
      const body = {
        sync_product: {
          name: "White glossy mug for Website",
        },
        sync_variants: [
          {
            variant_id: 1320,
            retail_price: "12.99",
            files: [
              {
                url: "https://files.cdn.printful.com/files/68f/68fbbd6da26b6a48b0a6a5c9ee65b54e_preview.png",
                filename: "nyc.jpg",
                visible: true,
              },
            ],
          },
        ],
      };

      const response = await axios.post("/api/printfulPrepareMugs", body);
      setApiResponse(JSON.stringify(response.data.data.result));
    } catch (error) {
      setApiResponse("Error in handleMugsClicked: " + error);
    } finally {
      setLoading(false);
    }
  };

  const handleTShirtsClicked = async () => {
    setSelectedProduct(ProductType.TSHIRTS);
  };

  return (
    <>
      {/* The structure of the screen:
    Go back button on top left
    Here is the image you created:
    <Image>
    Choose mug or t shirt
    Show how it will look
    Show Price
    Show shipping costs
    Show tax costs
    Enter the address
    Show Shipping costs
    Payment processing with paypal
    Confirm button
    */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          history.back();
        }}
      >
        Go back
      </Button>
      <div
        style={{
          marginTop: "24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography style={{ marginBottom: "10px" }}>
          The image you created:{" "}
        </Typography>
        <Image src={blobImage} alt={revised_prompt} width={200} height={200} />
        <ButtonGroup variant="text" aria-label="text button group">
          <Button
            style={{
              height: "100px",
              width: "100px",
              borderStyle: "solid",
              borderWidth: "2px",
              borderColor: "black",
              marginRight: "10px",
              backgroundColor: "cyan",
            }}
            onClick={handleMugsClicked}
          >
            Mugs
          </Button>
          <Button
            style={{
              height: "100px",
              width: "100px",
              borderStyle: "solid",
              borderWidth: "2px",
              borderColor: "black",
              backgroundColor: "lightcoral",
            }}
            onClick={handleTShirtsClicked}
          >
            T-shirts
          </Button>
        </ButtonGroup>
        {selectedProduct === ProductType.MUGS && (
          <>
            {!loading && (
              <>
                {apiResponse}
                {/* Show how it will look
                Show how it will look: 
                  - Image
                  
                  Show shipping costs
                  Show tax costs
                  Enter the address
                  Show Shipping costs
                  Payment processing with paypal
                  Confirm button */}
                <div>
                  <Typography>Here is how it will look</Typography>
                  <Image src={""} alt="The mockup"></Image>
                  <div>
                    <TextField
                      onChange={(e: {
                        target: { value: SetStateAction<string> };
                      }) => {
                        setRecipientName(e.target.value);
                      }}
                      inputProps={{ maxLength: 1000 }}
                      sx={{}}
                      id="outlined-basic"
                      label="Recipient Name"
                      variant="outlined"
                    />
                    <TextField
                      onChange={(e) => setRecipientAddress1(e.target.value)}
                      id="outlined-basic"
                      label="Address Line 1"
                      variant="outlined"
                    />
                    <TextField
                      onChange={(e) => setRecipientAddress2(e.target.value)}
                      id="outlined-basic"
                      label="Address Line 2"
                      variant="outlined"
                    />
                    <TextField
                      onChange={(e) => setRecipientCity(e.target.value)}
                      id="outlined-basic"
                      label="City"
                      variant="outlined"
                    />
                    <TextField
                      onChange={(e) => setRecipientStateCode(e.target.value)}
                      id="outlined-basic"
                      label="State Code"
                      variant="outlined"
                    />
                    <TextField
                      onChange={(e) => setRecipientCountryCode(e.target.value)}
                      id="outlined-basic"
                      label="Country Code"
                      variant="outlined"
                    />
                    <TextField
                      onChange={(e) => setRecipientZip(e.target.value)}
                      id="outlined-basic"
                      label="ZIP/Postal Code"
                      variant="outlined"
                    />
                  </div>
                  <Typography></Typography>
                </div>
              </>
            )}
            <div>MUGS are clicked</div>
          </>
        )}
        {selectedProduct === ProductType.TSHIRTS && (
          <>
            <div>TSHIRTS are clicked</div>
          </>
        )}
        {loading && <CircularProgress />}

        <Button variant="contained" color="primary">
          Proceed to Customize
        </Button>
      </div>
    </>
  );
};

export default CreateOrder;
