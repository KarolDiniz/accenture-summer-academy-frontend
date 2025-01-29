import Box from "@mui/material/Box";
import noDataImage from "@img/attention_5973444.png";
import Typography from "@mui/material/Typography";

const AvisoSemEntidade = ({ mensagem }) => {
  return (
    <Box
      sx={{
        border: "2px dashed #ccc",
        borderRadius: "8px",
        padding: "16px",
        backgroundColor: "#F9F9F9",
        textAlign: "center",
      }}
    >
      <Box
        component="img"
        src={noDataImage}
        alt="Nenhum dado encontrado"
        sx={{ width: 100, height: 100, mb: 2 }}
      />
      <Typography
        variant={"h4"}
        textAlign={"center"}
        color={"text.secondary"}
        m={2}
      >
        {mensagem}
      </Typography>
    </Box>
  );
};

export default AvisoSemEntidade;
