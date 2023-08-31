class generadorFactura {
    constructor() {
      // Configuración inicial si es necesario
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
      const facturaHTML = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <!-- Encabezado y estilos CSS aquí -->
        </head>
        <body>
            <!-- Encabezado de la factura aquí -->
  
            <div class="cliente">
                <h2>Información del Cliente</h2>
                <p>RUC: ${ruc}</p>
                <p>Nombre: ${cliente}</p>
                <p>Dirección: ${direccion}</p>
                <p>Teléfono: ${telefono}</p>
            </div>
  
            <table class="factura">
                <!-- Encabezados de la tabla aquí -->
  
                <tbody>
                    ${this.generarDetalleProductos(productos)}
                </tbody>
                <tfoot>
                    <!-- Totales aquí -->
                </tfoot>
            </table>
  
            <div class="notas">
                <h2>Notas:</h2>
                <!-- Notas aquí -->
            </div>
        </body>
        </html>
      `;
  
      return facturaHTML;
    }
  }
  
  module.exports = generadorFactura;
  