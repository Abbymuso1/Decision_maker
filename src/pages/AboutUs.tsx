import React, { useState } from "react";
import Header from "../components/Header";
import { ThemeProvider, useTheme } from "@mui/material/styles";
import theme from "../theme/theme";
import BackButton from "../components/BackButton";
import {
  Stack,
  Typography,
  Box,
  useMediaQuery,
  Avatar,
  Grid,
  Link,
  Modal,
  Backdrop,
  Fade
} from "@mui/material";
import Footer from "../components/Footer";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Layout from "../components/Layout";

// Importing images directly
import aichaImage from "../aicha.jpg";
import abiImage from "../abi.jpg";
import kendiImage from "../kendi.jpg";
import nateImage from "../nate.jpg";
import martinImage from "../martin.jpeg";

const teamMembers = [
  {
    name: "Myriam Aicha M'bongo-Zindamoyen",
    role: "Lead Project Manager and Developer",
    image: aichaImage,
    linkedIn:
      "https://www.linkedin.com/in/aicha-myriam-mbongo-zindamoyen-3ab1a9263/",
  },
  {
    name: "Abigail Muthoni Wairi",
    role: "UI/UX Designer and Front-End Developer",
    image: abiImage,
    linkedIn: "https://www.linkedin.com/in/abigail-muthoni-wairi/",
  },
  {
    name: "Kendi Njeru",
    role: "User Researcher and Front-End Developer",
    image: kendiImage,
    linkedIn: "https://www.linkedin.com/in/kendi-njeru/",
  },
  {
    name: "Nathan Mwangi Nderitu",
    role: "Lead Developer (Back-End)",
    image: nateImage,
    linkedIn: "https://www.linkedin.com/in/nathan-nderitu-98aa36247/",
  },
  {
    name: "Martin Sillaots",
    role: "Product Owner and Conceptual Designer",
    image: martinImage,
    linkedIn: "https://www.linkedin.com/in/martinsillaots/",
  },
];

function AboutUs() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [openImage, setOpenImage] = useState<string | null>(null);

  const handleOpenImage = (image: string) => {
    setOpenImage(image);
  };

  const handleCloseImage = () => {
    setOpenImage(null);
  };

  return (
    <Layout>
      <Stack
        direction="row"
        spacing={isMobile ? 2 : 5}
        style={{ margin: "2vh", alignItems: "center" }}
      >
        <div style={{ marginLeft: "10px" }}>
          <BackButton />
        </div>
        <Typography variant="h4" gutterBottom>
          About Us
        </Typography>
      </Stack>
      <Stack
        direction="column"
        spacing={2}
        alignItems="center"
        textAlign="center"
        style={{
          marginBottom: "50px",
          padding: isMobile ? 2 : 3,
          marginTop: "10px",
        }}
      >
        <Box className="stack-container" sx={{ maxWidth: "100%" }}>
          <Typography color="primary" variant="h5" gutterBottom>
            Decision Maker is an app that helps you to make decisions based on
            your objective preferences.
          </Typography>
          <Typography
            variant="body1"
            sx={{ textAlign: "justify", marginBottom: "20px" }}
          >
            It is based on a simplified Analytical Hierarchy Process model where
            you are asked to formulate your preferences by comparing alternative
            options pairwise. This tool can be used for professional or everyday
            life decisions like selecting a suitable investment, choosing the
            most attractive project idea, buying a new car, selecting a location
            for the holidays or choosing a date.
            <br />
            <br />
            This app was developed by:
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {teamMembers.map((member) => (
              <Grid
                item
                key={member.name}
                xs={12}
                sm={6}
                md={4}
                lg={3}
                sx={{ textAlign: "center" }}
              >
                <Box sx={{ textAlign: "center" }}>
                  <Avatar
                    alt={member.name}
                    src={member.image}
                    sx={{
                      width: 150,
                      height: 150,
                      margin: "auto",
                      marginBottom: "10px",
                      cursor: "pointer",
                      "&:hover": {
                        opacity: 0.8,
                      },
                    }}
                    onClick={() => handleOpenImage(member.image)}
                  />
                  <Typography variant="h6">{member.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {member.role}
                  </Typography>
                  <Link
                    href={member.linkedIn}
                    target="_blank"
                    rel="noopener"
                    color="primary"
                  >
                    LinkedIn Profile
                  </Link>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Typography
            variant="body1"
            sx={{ textAlign: "justify", marginTop: "20px" }}
          >
            This work was conducted in the framework of the Digital Explorers 2
            programme supervised by Mustafa Can Özdemir and Raimo Pregel and
            supported by the EdTech Talents EU project.
          </Typography>
        </Box>

        <Modal
          open={Boolean(openImage)}
          onClose={handleCloseImage}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{ timeout: 500 }}
        >
          <Fade in={Boolean(openImage)}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "80%",
                maxWidth: "600px",
                backgroundColor: "white",
                padding: 2,
                borderRadius: 2,
                boxShadow: 3,
                textAlign: "center",
              }}
            >
              <img
                src={openImage!}
                alt="Enlarged"
                style={{ width: "100%", height: "auto" }}
              />
            </Box>
          </Fade>
        </Modal>
      </Stack>
    </Layout>
  );
}

export default AboutUs;
