import { createTheme } from "@mui/material/styles";
import { ptBR } from "@mui/material/locale";

const TemaPadrao = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#6357F1",
    },
    secondary: {
      main: "#6357ff",
    },
    text: {
      hint: "#6357f1",
      primary: "#6357ff", 
      secondary: "#6357ff",
      disabled: "#6357ff", 
    },
  },
  typography: {
    fontFamily: [
      "Inter", 
      "Lato", 
      "sans-serif",
    ].join(","),
    allVariants: {
      color: "#6357ff",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: "#6357F1",
          color: "#fff",
        },
        outlined: {
          color: "#6357F1",
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
