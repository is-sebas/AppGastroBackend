class generadorFactura {
  constructor() {
    // Configuración inicial si es necesario
  }

  calcularTotales(productos) {
    let subtotal = 0;
    productos.forEach((producto) => {
      const totalPorProducto = producto.cantidad * producto.precioUnitario;
      subtotal += totalPorProducto;
    });

    const iva = subtotal * 0.1; // 10% de IVA
    const total = subtotal + iva;

    return { subtotal, iva, total };
  }

  generarDetalleProductos(productos) {
    let detalleHTML = '';

    productos.forEach((producto) => {
      const totalPorProducto = producto.cantidad * producto.precioUnitario;
      detalleHTML += `
        <tr>
            <td>${producto.nombre}</td>
            <td>${producto.cantidad}</td>
            <td>${producto.precioUnitario}</td>
            <td>${totalPorProducto}</td>
        </tr>
      `;
    });

    return detalleHTML;
  }

  generarFacturaHTML(cliente, ruc, direccion, telefono, productos) {
    const { subtotal, iva, total } = this.calcularTotales(productos);

    const facturaHTML = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Factura - AppGastro</title>
          <style>
              /* Estilos CSS para la factura */
              body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 20px;
              }

              .factura {
                  width: 80%;
                  margin: 0 auto;
                  border-collapse: collapse;
              }

              .factura td, .factura th {
                  border: 1px solid #ddd;
                  padding: 8px;
              }

              .factura th {
                  background-color: #f2f2f2;
              }

              .encabezado {
                  text-align: center;
              }

              .cliente {
                  margin-top: 20px;
              }
          </style>
      </head>
      <body>
          <div class="encabezado">
              <h1>Factura</h1>
              <p>Número de Factura: 12345</p>
              <p>Fecha: 23/08/2023</p>
          </div>

          <div class="cliente">
              <h2>Información del Cliente</h2>
              <p>RUC: ${ruc}</p>
              <p>Nombre: ${cliente}</p>
              <p>Dirección: ${direccion}</p>
              <p>Teléfono: ${telefono}</p>
          </div>

          <table class="factura">
              <thead>
                  <tr>
                      <th>Descripción</th>
                      <th>Cantidad</th>
                      <th>Precio Unitario (PYG)</th>
                      <th>Total (PYG)</th>
                  </tr>
              </thead>
              <tbody>
                  ${this.generarDetalleProductos(productos)}
              </tbody>
              <tfoot>
                  <tr>
                      <td colspan="3">Subtotal:</td>
                      <td>${subtotal}</td>
                  </tr>
                  <tr>
                      <td colspan="3">IVA (10%):</td>
                      <td>${iva}</td>
                  </tr>
                  <tr>
                      <td colspan="3">Total:</td>
                      <td>${total}</td>
                  </tr>
              </tfoot>
          </table>

          <div class="notas">
              <h2>Notas:</h2>
              <p>Gracias por su compra.</p>
          </div>
      </body>
      </html>
    `;

    return facturaHTML;
  }
}

module.exports = generadorFactura;
