class generadorFactura {
  constructor() {
    // Configuración inicial si es necesario
  }

  obtenerFechaActual() {
    const fechaActual = new Date();
    const dia = fechaActual.getDate().toString().padStart(2, '0');
    const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
    const anio = fechaActual.getFullYear();
    return `${dia}/${mes}/${anio}`;
  }

  generarNumeroFactura() {
    // Generar tres partes del número de factura: "060", "001", y un número aleatorio entre 1 y 9999999
    const parte1 = '001';
    const parte2 = '001';
    const parte3 = (Math.floor(Math.random() * 9999999) + 1).toString().padStart(7, '0'); // Número aleatorio entre 1 y 9999999 con relleno de ceros

    const numeroFactura = `${parte1}-${parte2}-${parte3}`;
    return numeroFactura;
  }

  formatearMonto(monto) {
    // Formatear el monto con separador de miles y dos decimales
    return monto.toLocaleString('es-PY', { style: 'currency', currency: 'PYG' });
  }

  calcularTotales(productos) {
    let subtotal = 0;
    productos.forEach((producto) => {
      const totalPorProducto = producto.cantidad * producto.precioUnitario;
      subtotal += totalPorProducto;
    });

    const iva = Math.round((subtotal / 11) * 1000) / 1000; // Redondear a 3 decimales (10% de IVA)
    const total = subtotal + iva;

    return {
        subtotal: this.formatearMonto(subtotal),
        iva: this.formatearMonto(iva),
        total: this.formatearMonto(total),
      };
  }

  generarDetalleProductos(productos) {
    let detalleHTML = '';

    productos.forEach((producto) => {
      const totalPorProducto = producto.cantidad * producto.precioUnitario;
      detalleHTML += `
        <tr>
            <td>${producto.nombre}</td>
            <td>${producto.cantidad}</td>
            <td>${this.formatearMonto(producto.precioUnitario)}</td>
            <td>${this.formatearMonto(totalPorProducto)}</td>
        </tr>
      `;
    });

    return detalleHTML;
  }

  generarFacturaHTML(local_nombre, cliente, ruc, direccion, telefono, productos) {
    const { subtotal, iva, total } = this.calcularTotales(productos);
    const fechaActual = this.obtenerFechaActual();
    const numeroFactura = this.generarNumeroFactura();

    const facturaHTML = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Factura - ${local_nombre}</title>
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
              <h1>Factura - ${local_nombre}</h1>
              <p>${direccion}</p>
              <p>Número de Factura: ${numeroFactura}</p>
              <p>Fecha: ${fechaActual}</p>
          </div>

          <div class="cliente">
              <h2>Información del Cliente</h2>
              <p>Nombre: ${cliente}</p>
              <p>RUC: ${ruc}</p>
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
                <td colspan="3"><strong>Subtotal:</strong></td>
                <td><strong>${subtotal}</strong></td>
              </tr>
              <tr>
                  <td colspan="3"><strong>IVA (10%):</strong></td>
                  <td><strong>${iva}</strong></td>
              </tr>
              <tr>
                  <td colspan="3"><strong>Total:</strong></td>
                  <td><strong>${total}</strong></td>
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
