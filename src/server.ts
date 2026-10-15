import { crearApp } from "./app.js";

const PORT = Number(process.env.PORT) || 3000;

crearApp().listen(PORT, () => {
  console.log(`Cafetería Origen escuchando en http://localhost:${PORT}`);
});
