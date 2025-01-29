import React from "react"; 
import { Menu } from "@ui/Menu";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const Project = () => {
  return (
    <Grid container spacing={4} justifyContent="center">
      <Grid item xs={12}>
        <Menu />
      </Grid>

      <Grid item xs={12} style={{ marginTop: "5rem" }}>
        <Typography variant="h5" align="center">
          Créditos do Projeto
        </Typography>
        <Typography variant="body1" align="center">
          <br />
          Este projeto foi desenvolvido como parte de um desafio técnico da Klock.<br />
           Ele foi projetado para integrar com um backend em Spring, que gerencia um CRUD de clientes, itens e pedidos. 
          <br />
          <br />
          Para mais informações, consulte o README no repositório do GitHub através do link: 
          <a 
            href="https://github.com/KarolDiniz/klock-store-front.git" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            https://github.com/KarolDiniz/klock-store-front.git
          </a>
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Project;
