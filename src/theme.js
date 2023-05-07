import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Lato"
  },
  palette: {
    primary: {
      light: "#45c09f",
      main: "#283747",
      dark: "#566573",
      contrastText: "#fff",
    },
  },
});

export default theme;