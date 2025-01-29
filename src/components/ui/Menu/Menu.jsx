import React, { useState } from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Logo from "@img/store-logo-menu.png";
import products from "@img/box_6452366.png";
import home from "@img/store_6452554.png";
import like from "@img/like_6452430.png";
import notificacaoIcone from "@img/notificacao-icone.png";
import configuracoesIcone from "@img/configuracoes-icone.png";
import usuarioIcone from "@img/usuario-icone.png";

const MenuItem = ({ to, icon, label }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box
      component={Link}
      to={to}
      sx={{
        width: 106,
        height: 93.23,
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 1,
        display: "flex",
        textDecoration: "none",
        transition: "transform 0.3s ease-in-out, color 0.3s",
        transform: isHovered ? "scale(1.15)" : "scale(1)",
        color: isHovered ? "#000" : "#6357F1",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img style={{ width: 64, height: 64 }} src={icon} alt={label} />
      <Typography
        sx={{
          width: 106,
          height: 24.23,
          textAlign: "center",
          fontSize: 14,
          fontFamily: "Inter",
          fontWeight: "600",
          wordWrap: "break-word",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};

const Menu = () => {
  return (
    <div
      style={{
        width: "90%",
        height: "90%",
        justifyContent: "space-between",
        alignItems: "center",
        display: "inline-flex",
        marginLeft: "3%",
      }}
    >
      <Box
        component={Link}
        to={"/"}
        sx={{
          width: 200,
          height: 66.67,
        }}
      >
        <img style={{ width: 100, height: 100 }} src={Logo} alt="Logo" />
      </Box>
      <Box
        sx={{
          width: 400,
          marginLeft: -10,
          height: 95.33,
          justifyContent: "space-between",
          alignItems: "center",
          display: "inline-flex",
        }}
      >
        <MenuItem to={"/Home"} icon={home} label={"HOME"} />
        <MenuItem to={"/clientes"} icon={products} label={"CLIENTES"} />
        <MenuItem to={"/produtos"} icon={products} label={"PRODUTOS"} />
        <MenuItem to={"/pedidos"} icon={products} label={"PEDIDOS"} />
        <MenuItem to={"/project"} icon={like} label={"PROJETO"} />

      </Box>
      <Box
        sx={{
          width: 174,
          height: 40,
          justifyContent: "space-between",
          alignItems: "center",
          display: "inline-flex",
        }}
      >
        <img
          style={{ width: 40, height: 40 }}
          src={configuracoesIcone}
          alt="Ícone para configurações"
        />
        <img
          style={{ width: 40, height: 40 }}
          src={notificacaoIcone}
          alt="Ícone para notificações"
        />
        <img
          style={{ width: 40, height: 40 }}
          src={usuarioIcone}
          alt="Ícone para usuário"
        />
      </Box>
    </div>
  );
};

export default Menu;
