import Treeview from "./components/Treeview";
import { Box } from "@mui/material";
import "./App.css";

function App() {
  return (
    <Box
      sx={{
        bgcolor: "white",
        borderRadius: "10px",
        boxShadow: 4,
        minHeight: "90vh",
      }}
    >
      <Treeview />
    </Box>
  );
}

export default App;
