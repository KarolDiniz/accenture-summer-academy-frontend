import React, { useState, useEffect } from "react"; 
import { Menu } from "@ui/Menu";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import AddIcon from "@mui/icons-material/Add";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    description: "",
    price: "",
    stockQuantity: "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8083/api/products");
        const data = await response.json();
        setProducts(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleRowClick = (product) => {
    setSelectedProduct(product);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
  };

  const handleRemoveProduct = async () => {
    if (!selectedProduct) return;
  
    try {
      const response = await fetch(`http://localhost:8083/api/products/${selectedProduct.id}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        setProducts((previousProducts) =>
          previousProducts.filter((product) => product.id !== selectedProduct.id)
        );
        alert("Product removed successfully!");
      } else {
        alert("Error removing the product. Please try again.");
      }
    } catch (error) {
      console.error("Error removing product:", error);
      alert("Error communicating with the server. Check the connection.");
    } finally {
      handleCloseDetailsModal();
    }
  };

  const handleCardMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleCardMouseLeave = () => {
    setHoveredIndex(null);
  };

  const filteredProducts = products.filter((product) =>
    (product.name || "").toLowerCase().includes(filterValue.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value,
    });
  };

  const handleCreateProduct = async () => {
    const response = await fetch("http://localhost:8083/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    });
  
    if (response.ok) {
      const createdProduct = await response.json();
      setProducts((previousProducts) => [...previousProducts, createdProduct]);
      setNewProduct({
        name: "",
        sku: "",
        description: "",
        price: "",
        stockQuantity: "",
      });
      alert("Product created successfully!");
      handleCloseCreateModal();
    } else {
      alert("Failed to create product.");
    }
  };

  const handleEditProduct = (product) => {
    setNewProduct(product);
    setIsEditModalOpen(true);
    setIsDetailsModalOpen(false);
  };

  const handleSaveEditProduct = async () => {
    const response = await fetch(`http://localhost:8083/api/products/${newProduct.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    });

    if (response.ok) {
      const updatedProduct = await response.json();
      setProducts((previousProducts) =>
        previousProducts.map((product) =>
          product.id === updatedProduct.id ? updatedProduct : product
        )
      );
      alert("Product updated successfully!");
      setIsEditModalOpen(false);
    } else {
      alert("Failed to update the product.");
    }
  };

  return (
    <Grid container spacing={4} justifyContent="center">
      <Grid item xs={12} mt={-5} ml={-0.5}>
        <Menu />
        <TextField
          label="Filter by Name"
          variant="outlined"
          value={filterValue}
          onChange={handleFilterChange}
          style={{
            marginBottom: "16px",
            marginLeft: "11.5rem", 
          }}
        />
        <Grid item xs={10.3} sx={{ textAlign: "right" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsCreateModalOpen(true)} 
            sx={{
              backgroundColor: "#6157bb", 
              "&:hover": { backgroundColor: "#8889b1" }, 
              marginTop: "-5rem",
            }}
          >
            <AddIcon sx={{ marginRight: "8px" }} /> Create Product
          </Button>
        </Grid>
      </Grid>

      {isLoading ? (
        <div style={{ textAlign: "center", marginTop: "10rem" }}>
          <Typography variant="h4" style={{ marginBottom: "10px" }}>
            Loading...
          </Typography>
          <CircularProgress />
        </div>
      ) : filteredProducts.length === 0 ? (
        <Typography
          variant="h5"
          style={{
            textAlign: "center",
            marginTop: "10rem",
            fontWeight: "bold",
            color: "#6357F1",
          }}
        >
          No products available. <br /> 
          Register a new product!
        </Typography>
      ) : (
        <Paper
          style={{
            marginTop: "3rem",
            width: "70rem",
            padding: "20px",
          }}
        >
          <Grid container spacing={5} justifyContent="center" alignItems="center">
            {filteredProducts.map((product, index) => (
              <Grid key={product.id} item xs={12} lg={3}>
                <Paper
                  onMouseEnter={() => handleCardMouseEnter(index)}
                  onMouseLeave={handleCardMouseLeave}
                  style={{
                    overflow: "hidden",
                    backgroundColor: "#edecf5",
                    transition:
                      "transform 0.3s ease-in-out, background-color 0.3s, color 0.3s",
                    transform: hoveredIndex === index ? "scale(1.15)" : "scale(1)",
                    color: hoveredIndex === index ? "#000" : "#6357F1",
                  }}
                >
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow></TableRow>
                      </TableHead>
                      <TableRow onClick={() => handleRowClick(product)}>
                        <TableCell
                          style={{
                            color: "#6357F1",
                            textAlign: "center",
                          }}
                        >
                          <Typography variant="body2" style={{ fontWeight: "bold" }}>
                            {product.name}
                          </Typography>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <img
                              src="src/assets/img/package-box_6046583.png"
                              alt={product.name}
                              style={{ maxWidth: "50%", maxHeight: "50%" }}
                            />
                          </div>
                          <Typography variant="body2" style={{ marginTop: "1rem" }}>
                            <strong>SKU:</strong> {product.sku}
                          </Typography>
                          <Typography variant="body2" style={{ marginTop: "1rem" }}>
                            <strong>Price:</strong> R$ {product.price}
                          </Typography>
                          <Typography variant="body2" style={{ marginTop: "1rem" }}>
                            <strong>Stock:</strong> {product.stockQuantity}
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

      <Modal open={isDetailsModalOpen} onClose={handleCloseDetailsModal}>
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
            Product Details
          </Typography>
          {selectedProduct && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>SKU</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Stock</TableCell>
                  </TableRow>
                </TableHead>
                <TableRow>
                  <TableCell>{selectedProduct.id}</TableCell>
                  <TableCell>{selectedProduct.name}</TableCell>
                  <TableCell>{selectedProduct.sku}</TableCell>
                  <TableCell>{selectedProduct.description}</TableCell>
                  <TableCell>R$ {selectedProduct.price}</TableCell>
                  <TableCell>{selectedProduct.stockQuantity}</TableCell>
                </TableRow>
              </Table>
            </TableContainer>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleCloseDetailsModal}
            style={{ marginTop: "1rem" }}
          >
            Close
          </Button>
          <Button
            variant="outlined"
            onClick={handleRemoveProduct}
            style={{
              marginTop: "1rem",
              color: "#ff0000",
              borderColor: "#ff0000",
              marginLeft: "20rem",
            }}
          >
            Remove
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleEditProduct(selectedProduct)}
            style={{
              marginTop: "1rem",
              marginLeft: "1rem",
            }}
          >
            Edit
          </Button>
        </Paper>
      </Modal>

      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
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
            style={{ marginBottom: "1rem", fontWeight: "bold" }}
          >
            Edit Product
          </Typography>
          <TextField
            label="Product Name"
            variant="outlined"
            name="name"
            value={newProduct.name}
            onChange={handleInputChange}
            fullWidth
            style={{ marginBottom: "1rem" }}
          />
          <TextField
            label="SKU"
            variant="outlined"
            name="sku"
            value={newProduct.sku}
            onChange={handleInputChange}
            fullWidth
            style={{ marginBottom: "1rem" }}
          />
          <TextField
            label="Description"
            variant="outlined"
            name="description"
            value={newProduct.description}
            onChange={handleInputChange}
            fullWidth
            style={{ marginBottom: "1rem" }}
          />
          <TextField
            label="Price"
            variant="outlined"
            name="price"
            type="number"
            value={newProduct.price}
            onChange={handleInputChange}
            fullWidth
            style={{ marginBottom: "1rem" }}
          />
          <TextField
            label="Stock Quantity"
            variant="outlined"
            name="stockQuantity"
            type="number"
            value={newProduct.stockQuantity}
            onChange={handleInputChange}
            fullWidth
            style={{ marginBottom: "1rem" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveEditProduct}
            fullWidth
          >
            Save Changes
          </Button>
          <Button
            variant="outlined"
            onClick={() => setIsEditModalOpen(false)}
            style={{ marginTop: "1rem", width: "100%" }}
          >
            Cancel
          </Button>
        </Paper>
      </Modal>

      <Modal open={isCreateModalOpen} onClose={handleCloseCreateModal}>
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
            style={{ marginBottom: "1rem", fontWeight: "bold" }}
          >
            Create Product
          </Typography>
          <TextField
            label="Product Name"
            variant="outlined"
            name="name"
            value={newProduct.name}
            onChange={handleInputChange}
            fullWidth
            style={{ marginBottom: "1rem" }}
          />
          <TextField
            label="SKU"
            variant="outlined"
            name="sku"
            value={newProduct.sku}
            onChange={handleInputChange}
            fullWidth
            style={{ marginBottom: "1rem" }}
          />
          <TextField
            label="Description"
            variant="outlined"
            name="description"
            value={newProduct.description}
            onChange={handleInputChange}
            fullWidth
            style={{ marginBottom: "1rem" }}
          />
          <TextField
            label="Price"
            variant="outlined"
            name="price"
            type="number"
            value={newProduct.price}
            onChange={handleInputChange}
            fullWidth
            style={{ marginBottom: "1rem" }}
          />
          <TextField
            label="Stock Quantity"
            variant="outlined"
            name="stockQuantity"
            type="number"
            value={newProduct.stockQuantity}
            onChange={handleInputChange}
            fullWidth
            style={{ marginBottom: "1rem" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateProduct}
            fullWidth
          >
            Create
          </Button>
          <Button
            variant="outlined"
            onClick={handleCloseCreateModal}
            style={{ marginTop: "1rem", width: "100%" }}
          >
            Cancel
          </Button>
        </Paper>
      </Modal>
    </Grid>
  );
};

export default Product;