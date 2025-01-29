import { createTheme } from "@mui/material/styles";
import { ptBR } from "@mui/material/locale";

const TemaPadrao = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#9f3ecc",
    },
    secondary: {
      main: "#9f3ecc",
    },
    text: {
      hint: "#9f3ecc",
      primary: "#9f3ecc", 
      secondary: "#9f3ecc",
      disabled: "#9f3ecc", 
    },
  },
  typography: {
    fontFamily: [
      "Inter", 
      "Lato", 
      "sans-serif",
    ].join(","),
    allVariants: {
      color: "#9f3ecc",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: "#9f3ecc",
          color: "#fff",
        },
        outlined: {
          color: "#9f3ecc",
        },
        root: {
          borderRadius: "20px",
        },
      },
    },
    MuiStack: {
      defaultProps: {
        useFlexGap: true,
      },
    },
  },
  ptBR,
});

export default TemaPadrao;
