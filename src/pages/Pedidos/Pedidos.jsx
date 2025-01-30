import React, { useState, useEffect, useRef } from "react";
import { Menu } from "@ui/Menu";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { Snackbar, FormControl, InputLabel } from "@mui/material";
import { CheckCircle, Error } from "@mui/icons-material";
import { Select, MenuItem } from "@mui/material";
import { jsPDF } from "jspdf";

const Pedidos = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [newOrder, setNewOrder] = useState({
    customerEmail: "",
    totalAmount: 0,
    paymentMethod: "PIX",
    items: [
      {
        productId: "",
        sku: "",
        quantity: 1,
        price: 0
      }
    ]
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("success");
  const [error, setError] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/orders");
      const data = await response.json();
      setOrders(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setIsLoading(false);
      setSnackbarMessage("Error fetching orders");
      setSnackbarType("error");
      setSnackbarOpen(true);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/orders/${orderId}`);
      const data = await response.json();
      setOrderDetails(data);
      setIsDetailsModalOpen(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
      setSnackbarMessage("Error fetching order details");
      setSnackbarType("error");
      setSnackbarOpen(true);
    }
  };

  const validateOrder = (order) => {
    if (!order.customerEmail) {
      setError("Customer email is required");
      return false;
    }
    if (!order.paymentMethod) {
      setError("Payment method is required");
      return false;
    }
    if (!order.items.length) {
      setError("At least one item is required");
      return false;
    }
    
    for (const item of order.items) {
      if (!item.productId || !item.sku || !item.quantity || !item.price) {
        setError("All item fields are required");
        return false;
      }
    }

    return true;
  };

  const calculateTotalAmount = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCreateOrder = async () => {
    try {
      if (!validateOrder(newOrder)) {
        return;
      }

      const orderToSend = {
        ...newOrder,
        totalAmount: calculateTotalAmount(newOrder.items),
        items: newOrder.items.map(item => ({
          ...item,
          productId: Number(item.productId),
          quantity: Number(item.quantity),
          price: Number(item.price)
        }))
      };

      const response = await fetch("http://localhost:8081/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderToSend),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const createdOrder = await response.json();
      setOrders((prevOrders) => [...prevOrders, createdOrder]);
      setIsCreateModalOpen(false);
      setError("");
      setNewOrder({
        customerEmail: "",
        totalAmount: 0,
        paymentMethod: "PIX",
        items: [{ productId: "", sku: "", quantity: 1, price: 0 }]
      });

      setSnackbarMessage("Order created successfully!");
      setSnackbarType("success");
      setSnackbarOpen(true);
      
      fetchOrders();

    } catch (error) {
      console.error("Error creating order:", error);
      setSnackbarMessage("Error creating order: " + error.message);
      setSnackbarType("error");
      setSnackbarOpen(true);
    }
  };

  const handleUpdateOrder = async () => {
    try {
      if (!validateOrder(newOrder)) {
        return;
      }

      const orderToUpdate = {
        ...newOrder,
        totalAmount: calculateTotalAmount(newOrder.items),
        items: newOrder.items.map(item => ({
          ...item,
          productId: Number(item.productId),
          quantity: Number(item.quantity),
          price: Number(item.price)
        }))
      };

      const response = await fetch(`http://localhost:8081/api/orders/${editingOrder.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderToUpdate),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedOrder = await response.json();
      setOrders((prevOrders) => prevOrders.map(order => order.id === updatedOrder.id ? updatedOrder : order));
      setIsCreateModalOpen(false);
      setEditingOrder(null);
      setError("");
      setNewOrder({
        customerEmail: "",
        totalAmount: 0,
        paymentMethod: "PIX",
        items: [{ productId: "", sku: "", quantity: 1, price: 0 }]
      });

      setSnackbarMessage("Order updated successfully!");
      setSnackbarType("success");
      setSnackbarOpen(true);
      
      fetchOrders();

    } catch (error) {
      console.error("Error updating order:", error);
      setSnackbarMessage("Error updating order: " + error.message);
      setSnackbarType("error");
      setSnackbarOpen(true);
    }
  };

  const handleRemoveOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        const response = await fetch(`http://localhost:8081/api/orders/${orderId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        setOrders((prevOrders) => prevOrders.filter(order => order.id !== orderId));
        setSnackbarMessage("Order deleted successfully!");
        setSnackbarType("success");
        setSnackbarOpen(true);
      } catch (error) {
        console.error("Error deleting order:", error);
        setSnackbarMessage("Error deleting order: " + error.message);
        setSnackbarType("error");
        setSnackbarOpen(true);
      }
    }
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...newOrder.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    
    setNewOrder({
      ...newOrder,
      items: updatedItems
    });
  };

  const addNewItem = () => {
    setNewOrder({
      ...newOrder,
      items: [
        ...newOrder.items,
        { productId: "", sku: "", quantity: 1, price: 0 }
      ]
    });
  };

  const removeItem = (index) => {
    if (newOrder.items.length > 1) {
      const updatedItems = newOrder.items.filter((_, i) => i !== index);
      setNewOrder({
        ...newOrder,
        items: updatedItems
      });
    }
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setNewOrder({
      customerEmail: order.customerEmail,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      items: order.items.map(item => ({
        productId: item.productId,
        sku: item.sku,
        quantity: item.quantity,
        price: item.price
      }))
    });
    setIsCreateModalOpen(true);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Add company logo or name
    doc.setFontSize(20);
    doc.setTextColor(97, 87, 187); // Purple color matching the UI
    doc.text("Order Receipt", pageWidth/2, 20, { align: "center" });
    
    // Add border line
    doc.setDrawColor(97, 87, 187);
    doc.setLineWidth(0.5);
    doc.line(20, 25, pageWidth - 20, 25);
    
    // Order information
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Order ID: #${orderDetails.id}`, 20, 40);
    doc.text(`Date: ${new Date(orderDetails.createdAt).toLocaleString()}`, 20, 50);
    doc.text(`Status: ${orderDetails.status}`, 20, 60);
    doc.text(`Customer: ${orderDetails.customerEmail}`, 20, 70);
    doc.text(`Payment Method: ${orderDetails.paymentMethod}`, 20, 80);
    
    // Items table
    let yPos = 100;
    doc.setFontSize(14);
    doc.setTextColor(97, 87, 187);
    doc.text("Order Details", pageWidth/2, yPos, { align: "center" });
    yPos += 10;
    
    // Table headers
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'bold');
    doc.text("Product ID", 20, yPos);
    doc.text("SKU", 70, yPos);
    doc.text("Quantity", 120, yPos);
    doc.text("Price", 160, yPos);
    doc.text("Total", 190, yPos);
    yPos += 5;
    
    // Line under headers
    doc.line(20, yPos, pageWidth - 20, yPos);
    yPos += 10;
    
    // Table content
    doc.setFont(undefined, 'normal');
    orderDetails.items.forEach(item => {
      const itemTotal = item.quantity * item.price;
      doc.text(item.productId.toString(), 20, yPos);
      doc.text(item.sku || "N/A", 70, yPos);
      doc.text(item.quantity.toString(), 120, yPos);
      doc.text(`$${item.price.toFixed(2)}`, 160, yPos);
      doc.text(`$${itemTotal.toFixed(2)}`, 190, yPos);
      yPos += 10;
    });
    
    // Total line
    yPos += 5;
    doc.line(20, yPos, pageWidth - 20, yPos);
    yPos += 10;
    
    // Total amount
    doc.setFont(undefined, 'bold');
    doc.text("Total Amount:", 150, yPos);
    doc.text(`$${orderDetails.totalAmount.toFixed(2)}`, 190, yPos);
    
    // Footer
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(128, 128, 128);
    yPos = doc.internal.pageSize.getHeight() - 20;
    doc.text("Thank you for your purchase!", pageWidth/2, yPos, { align: "center" });
    
    // Save the PDF
    doc.save(`order-${orderDetails.id}-receipt.pdf`);
  };

  const renderCreateModal = () => (
    <Modal open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
      <Paper sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "600px",
        maxHeight: "80vh",
        overflow: "auto",
        p: 4,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 24,
      }}>
        <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
          {editingOrder ? "Edit Order" : "Create New Order"}
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Customer Email"
              value={newOrder.customerEmail}
              onChange={(e) => setNewOrder({ ...newOrder, customerEmail: e.target.value })}
              error={error && !newOrder.customerEmail}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Payment Method</InputLabel>
              <Select
                value={newOrder.paymentMethod}
                label="Payment Method"
                onChange={(e) => setNewOrder({ ...newOrder, paymentMethod: e.target.value })}
              >
                <MenuItem value="PIX">PIX</MenuItem>
                <MenuItem value="CREDIT_CARD">Credit Card</MenuItem>
                <MenuItem value="BOLETO">Boleto</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Items
            </Typography>

            {newOrder.items.map((item, index) => (
              <Box key={index} sx={{ mb: 3, p: 2, border: "1px solid #e0e0e0", borderRadius: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Product ID"
                      type="number"
                      value={item.productId}
                      onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="SKU"
                      value={item.sku}
                      onChange={(e) => handleItemChange(index, 'sku', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Quantity"
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Price"
                      type="number"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                    />
                  </Grid>
                  {newOrder.items.length > 1 && (
                    <Grid item xs={12}>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => removeItem(index)}
                        size="small"
                      >
                        Remove Item
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </Box>
            ))}

            <Button
              variant="outlined"
              onClick={addNewItem}
              startIcon={<AddIcon />}
              sx={{ mb: 2 }}
            >
              Add Another Item
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1">
              Total Amount: ${calculateTotalAmount(newOrder.items).toFixed(2)}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={editingOrder ? handleUpdateOrder : handleCreateOrder}
                color="primary"
              >
                {editingOrder ? "Update Order" : "Create Order"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Modal>
  );

  const renderDetailsModal = () => (
    <Modal open={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)}>
      <Paper sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "600px",
        maxHeight: "80vh",
        overflow: "auto",
        p: 4,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 24,
      }}>
        <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
          Order Details
        </Typography>
  
        {orderDetails && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Customer Email:</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{orderDetails.customerEmail}</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Total Amount:</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>${orderDetails.totalAmount.toFixed(2)}</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Created At:</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{new Date(orderDetails.createdAt).toLocaleString()}</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Status:</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{orderDetails.status}</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Payment Method:</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{orderDetails.paymentMethod}</Typography>
            </Grid>
  
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>Items</Typography>
              {orderDetails.items.map((item) => (
                <Box key={item.id} sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, mb: 1 }}>
                  <Typography>Product ID: {item.productId}</Typography>
                  <Typography>SKU: {item.sku || "N/A"}</Typography>
                  <Typography>Quantity: {item.quantity}</Typography>
                  <Typography>Price: ${item.price.toFixed(2)}</Typography>
                </Box>
              ))}
            </Grid>
  
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>Order Status History</Typography>
              {orderDetails.orderStatusHistory.map((history) => (
                <Box key={history.id} sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, mb: 1 }}>
                  <Typography>Previous Status: {history.previousStatus || "N/A"}</Typography>
                  <Typography>Current Status: {history.currentStatus}</Typography>
                  <Typography>Change Date: {new Date(history.changeDate).toLocaleString()}</Typography>
                </Box>
              ))}
            </Grid>
          </Grid>
        )}
  
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          {orderDetails && orderDetails.status === "CONFIRMED" && (
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<PictureAsPdfIcon />}
              onClick={generatePDF}
              sx={{
                backgroundColor: "#6157bb",
                "&:hover": { backgroundColor: "#8889b1" },
              }}
            >
              Download Receipt
            </Button>
          )}
          <Button variant="outlined" onClick={() => setIsDetailsModalOpen(false)}>
            Close
          </Button>
        </Box>
      </Paper>
    </Modal>
  );

  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid item xs={12}>
        <Menu />
      </Grid>

      <Grid item xs={10.5} sx={{ textAlign: "right", marginBottom: "1rem" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setIsCreateModalOpen(true);
            setEditingOrder(null);
          }}
          sx={{
            backgroundColor: "#6157bb",
            "&:hover": { backgroundColor: "#8889b1" },
            padding: "10px 20px",
            fontSize: "16px",
            textTransform: "none",
          }}
        >
          <AddIcon sx={{ marginRight: "8px" }} /> Create Order
        </Button>
      </Grid>

      {isLoading ? (
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <CircularProgress />
        </Grid>
      ) : orders.length === 0 ? (
        <Grid item xs={12} sx={{ textAlign: "center" }}>
      <Typography variant="h5" style={{ marginBottom: "1rem", fontWeight: "bold" }}>
        There are no orders registered. <br/> Create a new order.
      </Typography>
        </Grid>
      ) : (
        <Grid item xs={10.5}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Customer Email</TableCell>
                  <TableCell>Payment Method</TableCell>
                  <TableCell>Total Amount</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.customerEmail}</TableCell>
                    <TableCell>{order.paymentMethod}</TableCell>
                    <TableCell>${order.totalAmount}</TableCell>
                    <TableCell>
                      {order.items.map((item, index) => (
                        <div key={index}>
                          {item.sku} (Qty: {item.quantity}) - ${item.price}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>
                      <EditIcon 
                        sx={{ cursor: 'pointer', color: "#9754e4", marginRight: "8px" }}
                        onClick={() => handleEditOrder(order)}
                      />
                      <DeleteIcon 
                        sx={{ cursor: 'pointer', color: "#9754e4", marginRight: "8px" }}
                        onClick={() => handleRemoveOrder(order.id)}
                      />
                      <InfoIcon 
                        sx={{ cursor: 'pointer', color: "#9754e4" }}
                        onClick={() => fetchOrderDetails(order.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      )}

      {renderCreateModal()}
      {renderDetailsModal()}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        message={
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {snackbarType === "success" ? (
              <CheckCircle sx={{ color: "#4caf50", marginRight: "10px" }} />
            ) : (
              <Error sx={{ color: "#f44336", marginRight: "10px" }} />
            )}
            <Typography variant="body1">
              {snackbarMessage}
            </Typography>
          </Box>
        }
      />
    </Grid>
  );
};

export default Pedidos;