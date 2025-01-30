import React, { useState, useEffect } from "react";
import { Menu } from "@ui/Menu";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField"; // Importe o TextField para o campo de filtro
import usuarioIcone from "@img/usuario-icone.png"; // Ícone de usuário

const Clientes = () => {
  const [orders, setOrders] = useState([]);
  const [orderSelecionado, setOrderSelecionado] = useState(null);
  const [isModalDetalhesAberto, setIsModalDetalhesAberto] = useState(false);
  const [isCarregando, setIsCarregando] = useState(true);
  const [indiceHovered, setIndiceHovered] = useState(null);
  const [filtroEmail, setFiltroEmail] = useState(""); // Estado para armazenar o valor do filtro

  useEffect(() => {
    const buscarOrders = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/orders");
        const data = await response.json();
        setOrders(data);
        setIsCarregando(false);
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        setIsCarregando(false);
      }
    };

    buscarOrders();
  }, []);

  const handleClickLinha = (order) => {
    setOrderSelecionado(order);
    setIsModalDetalhesAberto(true); // Abre o modal de detalhes ao clicar no pedido
  };

  const handleFecharModalDetalhes = () => {
    setIsModalDetalhesAberto(false);
  };

  // Função para filtrar os pedidos com base no email
  const filtrarPedidosPorEmail = (orders, filtroEmail) => {
    return orders.filter((order) =>
      order.customerEmail.toLowerCase().includes(filtroEmail.toLowerCase())
    );
  };

  const pedidosFiltrados = filtrarPedidosPorEmail(orders, filtroEmail);

  return (
    <Grid container spacing={4} justifyContent="center">
      <Grid item xs={12} mt={0} ml={0}>
        <Menu />
      </Grid>

      <Grid item xs={10} ml={9}>
        <TextField
          label="Filter by email"
          variant="outlined"
          value={filtroEmail}
          onChange={(e) => setFiltroEmail(e.target.value)}
          style={{ width: "200px"}}
        />
      </Grid>

      {isCarregando ? (
        <div style={{ textAlign: "center", marginTop: "10rem" }}>
          <Typography variant="h4" style={{ marginBottom: "10px" }}>
            Carregando...
          </Typography>
          <CircularProgress />
        </div>
      ) : pedidosFiltrados.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "10rem" }}>
          <Typography variant="h5" style={{ marginBottom: "1rem", fontWeight: "bold" }}>
          There are no clients available. <br />
          Please register a new client.
          </Typography>
        </div>
      ) : (
        <Paper
          style={{
            width: "70rem",
            padding: "20px",
            marginTop: "3rem",
          }}
        >
          <Grid container spacing={5} justifyContent="center">
            {pedidosFiltrados.map((order, index) => (
              <Grid key={order.id} item xs={10} sm={6} md={4} lg={4}>
                <Paper
                  onMouseEnter={() => setIndiceHovered(index)}
                  onMouseLeave={() => setIndiceHovered(null)}
                  style={{
                    borderRadius: "1rem",
                    backgroundColor: "#edecf5",
                    transition: "transform 0.3s ease-in-out",
                    transform: indiceHovered === index ? "scale(1.15)" : "scale(1)",
                    color: "#9f3ecc",
                  }}
                >
                  <TableContainer>
                    <Table>
                      <TableRow onClick={() => handleClickLinha(order)}>
                        <TableCell style={{ textAlign: "center" }}>
                          <img
                            src={usuarioIcone}
                            alt="Ícone do Usuário"
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              marginRight: "10px",
                            }}
                          />
                          <Typography variant="body2" style={{ fontWeight: "bold" }}>
                            {order.customerEmail}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      <Modal open={isModalDetalhesAberto} onClose={handleFecharModalDetalhes}>
        <Paper
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "40px",
            borderRadius: "1rem",
          }}
        >
          <Typography
            variant="h5"
            style={{ textAlign: "center", marginBottom: "2rem", fontWeight: "bold" }}
          >
            Detalhes do cliente
          </Typography>
          {orderSelecionado && (
            <>
              <TableContainer>
                <Table>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>{orderSelecionado.id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Email</TableCell>
                    <TableCell>{orderSelecionado.customerEmail}</TableCell>
                  </TableRow>
                </Table>
              </TableContainer>
            </>
          )}
        </Paper>
      </Modal>
    </Grid>
  );
};

export default Clientes;
