import React, { Component } from "react";
import LogoIcon from "./logo.png";
import { Image, createStyles } from "@mantine/core";

const styles = {
  largeLogo: {
    width: "100%",
    height: "100%",
  },
  mediumLogo: {
    width: "50%",
    height: "50%",
  },
  smallLogo: {
    width: "25%",
    height: "25%",
  },
};

const LogoLarge = (props) => {
  return <Image src={LogoIcon} style={styles.largeLogo} alt="Logo" />;
};

const LogoMedium = (props) => {
  return <Image src={LogoIcon} style={styles.mediumLogo} alt="Logo" />;
};

const LogoSmall = (props) => {
  return <Image src={LogoIcon} style={styles.smallLogo} alt="Logo" />;
};

const CustomLogo = (props) => {
  const { width, height } = props;

  return (
    <Image src={LogoIcon} style={{ width: width, height: height }} alt="Logo" />
  );
};

export { LogoLarge, LogoMedium, LogoSmall, CustomLogo };
export default LogoLarge;
