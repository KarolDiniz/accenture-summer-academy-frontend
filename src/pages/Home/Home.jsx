import { Menu } from "@comp/ui/Menu"; 
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import imgHome from "@img/img-home.png";

const Home = () => {
  return (
    <Grid container spacing={4} justifyContent="center">
      <Grid item xs={12}>
        <Menu />
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h4" align="left" gutterBottom style={{ color: "#9f3ecc", marginLeft:"5rem", marginTop:"12rem" }}>
          Bem-vindo(a) a accenture-store
        </Typography>
        <Typography variant="body1" align="left" paragraph style={{ lineHeight: 1.6, marginLeft:"5rem" }}>
          Explore uma grande variedade de itens e gerencie pedidos online conosco.
        </Typography>

        <img
          src={imgHome}  
          alt="Imagem do Mercado"
          style={{ maxWidth: "50%", height: "auto", marginTop: "-20rem", justifyContent: "right", alignItems: "center", display: "flex", marginLeft: "48rem" }}
        />
      </Grid>
    </Grid>
  );
};

export default Home;
