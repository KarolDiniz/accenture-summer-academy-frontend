import React, { useState } from "react";
import { Grid, Typography, TextField, Button, Paper, List, ListItem, ListItemText, CircularProgress, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send";
import HelpIcon from "@mui/icons-material/Help";
import { Menu } from "@ui/Menu";

const ChatbotContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(8),
  borderRadius: "12px",
  backgroundColor: "#ffffff",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  maxWidth: "800px",
  margin: "auto",
  textAlign: "center",
}));

const MessageList = styled(List)({
  maxHeight: "300px",
  overflowY: "auto",
  padding: "10px",
});

const UserMessage = styled(ListItem)({
  justifyContent: "flex-end",
  textAlign: "right",
});

const BotMessage = styled(ListItem)({
  justifyContent: "flex-start",
  textAlign: "left",
});

const responses = {
  "Como ver clientes?": "Para visualizar a lista de clientes, vá até a página 'Clientes' no menu principal.",
  "Como cadastrar um item?": "Para cadastrar um item, vá até a página 'Itens', clique em 'Adicionar Item', preencha os dados e clique em 'Salvar'.",
  "Como editar um item?": "Para editar um item, vá até a página 'Itens', encontre o item desejado e clique em 'Editar'. Após as alterações, clique em 'Salvar'.",
  "Como remover um item?": "Para remover um item, vá até a página 'Itens', encontre o item desejado e clique em 'Excluir'. Confirme a ação e o item será removido.",
  "Como cadastrar um pedido?": "Para cadastrar um pedido, vá até a página 'Pedidos', clique em 'Novo Pedido', selecione o cliente, adicione os itens desejados e clique em 'Salvar'.",
  "Como editar um pedido?": "Para editar um pedido, vá até a página 'Pedidos', encontre o pedido desejado e clique em 'Editar'. Após as alterações, clique em 'Salvar'.",
  "Como remover um pedido?": "Para remover um pedido, vá até a página 'Pedidos', encontre o pedido desejado e clique em 'Excluir'. Confirme a ação e o pedido será removido.",
};

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", text: input };
    setConversation((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const botResponse = responses[input] || "Desculpe, não entendi sua pergunta. Você pode tentar reformular?";
      const botMessage = { role: "bot", text: botResponse };
      setConversation((prev) => [...prev, botMessage]);
      setLoading(false);
    }, 1000);
  };

  const handleQuickResponse = (question) => {
    setInput(question);
    handleSend();
  };

  return (
    <ChatbotContainer>
      <Typography variant="h5" gutterBottom>
        Chatbot
      </Typography>
      <MessageList>
        {conversation.map((msg, index) => (
          msg.role === "user" ? (
            <UserMessage key={index}>
              <ListItemText primary={msg.text} />
            </UserMessage>
          ) : (
            <BotMessage key={index}>
              <ListItemText primary={msg.text} />
            </BotMessage>
          )
        ))}
        {loading && (
          <ListItem sx={{ justifyContent: "center" }}>
            <CircularProgress size={24} />
          </ListItem>
        )}
      </MessageList>
      <Box display="flex" gap={1} alignItems="center">
        <TextField
          label="Digite sua pergunta"
          variant="outlined"
          fullWidth
          size="small"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleSend} endIcon={<SendIcon />}>Enviar</Button>
      </Box>
      <Box mt={2}>
        <Typography variant="subtitle1">Perguntas Frequentes</Typography>
        {Object.keys(responses).map((question) => (
          <Button
            key={question}
            variant="outlined"
            color="secondary"
            onClick={() => handleQuickResponse(question)}
            startIcon={<HelpIcon />}
            sx={{ m: 0.5 }}
          >
            {question}
          </Button>
        ))}
      </Box>
    </ChatbotContainer>
  );
};

const Project = () => (
  <Grid container justifyContent="center" alignItems="center" >
          <Grid item xs={12} mt={0} ml={0}>
            <Menu />
          </Grid>
      <Chatbot />
    </Grid>
);

export default Project;
