const db = require('../config/config');
const Reporte = {};

Reporte.getReporteUsuario = (id_user, fecha_desde, fecha_hasta, result) => {
    const sql = `
    SELECT  
        (SELECT 
                l.loc_nombre 
            FROM 
                mesas m, locales l
            WHERE 
                m.id_mesa = pl.id_mesa
            AND 
                m.id_local  = l.id_local) local,
        (SELECT 
                concat(u2.name, ' ', u2.lastname)
            FROM 
                users u2
            WHERE 
                u2.id = pl.id_mesero) mesero,
        pl.id_mesa mesa,
        pl.fechaPago,
        pl.montoPagado
    FROM 
        pagosLogs pl, users u
    WHERE 
        pl.id_cliente = u.id 
    AND
        pl.id_cliente = ?
    AND 
        date(pl.fechaPago) BETWEEN ? and ?
    `;

    db.query(
        sql,
        [id_user, fecha_desde, fecha_hasta],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Datos del reporte para usuarios:', res);
                result(null, res);
            }
        }
    );
}

Reporte.getReporteComercioOnline = (id_local, result) => {
    const sql = `
    SELECT 
	TABLA_1.total_mesas_cerradas,
	TABLA_1.total_ganancia,
	TABLA_2.total_mesas_abiertas, 
	TABLA_2.total_pendiente_cobro,
	TABLA_1.total_ganancia + TABLA_2.total_pendiente_cobro total,
	TABLA_3.mejor_cliente,	
	TABLA_4.mesas,
	TABLA_5.productos,
	TABLA_6.metodos_pago
FROM 
	(SELECT 
		COUNT(*) total_mesas_cerradas,
		SUM(m.total_cancelado) total_ganancia
	FROM
		mesas m
	WHERE
		 m.id_local = ?
	  AND 
		DATE(m.mesa_fecha_crea) = DATE(CONVERT_TZ(NOW(),'UTC','America/Asuncion'))
	  AND 	
	    m.pagado = 'SI') TABLA_1,
	(SELECT 
		COUNT(DISTINCT m.id_mesa) AS total_mesas_abiertas,
		SUM(oc.subTotal) total_pendiente_cobro
	FROM
		mesas m,
		ordersCompart oc
	WHERE
		m.id_mesa = oc.id_mesa
	  AND 
	    m.id_local = ?
	  AND 
		DATE(m.mesa_fecha_crea) = DATE(CONVERT_TZ(NOW(),'UTC','America/Asuncion'))
      AND 	
	    m.pagado = 'NO') TABLA_2,
	 (SELECT
		(SELECT
			concat(u.name, ' ', u.lastname, ' - correo: ', u.email)
		FROM
			users u
		WHERE
			u.id = TABLA_3.id_usuarioActivo) mejor_cliente
    	FROM 
			(SELECT 
				id_usuarioActivo, 
				SUM(subTotal) total_gastado
			  FROM 
			  	  mesas m, ordersCompart oc
			  WHERE
			  	  m.id_mesa  = oc.id_mesa
				AND
				  m.id_local = ?
			    AND 
			      DATE(m.mesa_fecha_crea) = DATE(CONVERT_TZ(NOW(), 'UTC', 'America/Asuncion'))
		   GROUP BY
				 id_usuarioActivo
		   ORDER BY 
				 total_gastado DESC
			  LIMIT 1) TABLA_3) TABLA_3,
	(SELECT 
	    CONCAT(
	        '[',
	        GROUP_CONCAT(
	            '{"id_mesa":', m.id_mesa, 
	            ',"mesero":"', REPLACE(CONCAT(u2.name, ' ', u2.lastname), '"', '\\"'), 
	            '","estado":"',
	            CASE WHEN m.mesa_estado = 1 THEN 'Activo' ELSE 'Cerrado' END,
	            '"}'
	            ORDER BY m.id_mesa
	            SEPARATOR ','
	        ),
	        ']'
	    ) mesas
	FROM 
		mesas m, users u2 
	WHERE 
	  	u2.id = m.id_staff
	AND 
		m.id_local = ?
	AND 
		DATE(m.mesa_fecha_crea) = DATE(CONVERT_TZ(NOW(), 'UTC', 'America/Asuncion'))) TABLA_4,
	(SELECT CONCAT(
			    '[',
			    GROUP_CONCAT(
			         '{"producto":"', producto,
			         '","cantidad":', cantidad,
			         ',"total_generado":', total_generado,
			         '}' SEPARATOR ','
			        ),
			    ']'
			) AS productos
			FROM (
			    SELECT 
			        p.name AS producto,
			        ohp.quantity AS cantidad,
			        SUM(p.price * ohp.quantity) AS total_generado
			    FROM
			        order_has_products ohp, ordersCompart oc, mesas m, products p
			    WHERE 
			    	oc.OrdersID = ohp.id_order
			      AND 
			        m.id_mesa = oc.id_mesa
			      AND 
					ohp.id_product = p.id
			      AND
			        m.id_local = ?
			      AND 
			      	DATE(m.mesa_fecha_crea) = DATE(CONVERT_TZ(NOW(), 'UTC', 'America/Asuncion'))
			    GROUP BY 
			        p.name, ohp.quantity
			) AS datos) TABLA_5,
	(SELECT CONCAT(
		    '[',
		    GROUP_CONCAT(
		         '{"metodo":"', metodo,
		         '","transacciones":', transacciones,
		         ',"total":', total,
		         '}' SEPARATOR ','
		        ),
		    ']'
		) AS metodos_pago
		FROM (
		    SELECT 
		        pl.metodoDePago metodo,
		        COUNT(pl.id) transacciones,
		        SUM(pl.montoPagado) total
		    FROM 
		        mesas m, pagosLogs pl 
		    WHERE 
		        m.id_mesa = pl.id_mesa
		    AND 
		        m.id_local = ?
		    AND 
		        DATE(m.mesa_fecha_crea) = DATE(CONVERT_TZ(NOW(), 'UTC', 'America/Asuncion'))
		    GROUP BY 
		        pl.metodoDePago
		) AS datos) TABLA_6
    `;

    db.query(
        sql,
        [id_local, id_local, id_local, id_local, id_local, id_local],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Datos del reporte online para comercio:', res);
                result(null, res);
            }
        }
    );
}  

Reporte.getReporteComercioRangoFecha = (id_local,fecha_desde, fecha_hasta, result) => {
    const sql = `
    SELECT 
	TABLA_1.total_mesas_cerradas,
	TABLA_1.total_ganancia,
	TABLA_2.total_mesas_abiertas, 
	TABLA_2.total_pendiente_cobro,
	TABLA_1.total_ganancia + TABLA_2.total_pendiente_cobro total,
	TABLA_3.mejor_cliente,	
	TABLA_4.mesas,
	TABLA_5.productos,
	TABLA_6.metodos_pago
FROM 
	(SELECT 
		COUNT(*) total_mesas_cerradas,
		SUM(m.total_cancelado) total_ganancia
	FROM
		mesas m
	WHERE
		 m.id_local = ?
	  AND 
		DATE(m.mesa_fecha_crea) BETWEEN ? and ?
	  AND 	
	    m.pagado = 'SI') TABLA_1,
	(SELECT 
		COUNT(DISTINCT m.id_mesa) AS total_mesas_abiertas,
		SUM(oc.subTotal) total_pendiente_cobro
	FROM
		mesas m,
		ordersCompart oc
	WHERE
		m.id_mesa = oc.id_mesa
	  AND 
	    m.id_local = ?
	  AND 
        DATE(m.mesa_fecha_crea) BETWEEN ? and ?
      AND 	
	    m.pagado = 'NO') TABLA_2,
	 (SELECT
		(SELECT
			concat(u.name, ' ', u.lastname, ' - correo: ', u.email)
		FROM
			users u
		WHERE
			u.id = TABLA_3.id_usuarioActivo) mejor_cliente
    	FROM 
			(SELECT 
				id_usuarioActivo, 
				SUM(subTotal) total_gastado
			  FROM 
			  	  mesas m, ordersCompart oc
			  WHERE
			  	  m.id_mesa  = oc.id_mesa
				AND
				  m.id_local = ?
			    AND 
			      DATE(m.mesa_fecha_crea) BETWEEN ? and ?
		   GROUP BY
				 id_usuarioActivo
		   ORDER BY 
				 total_gastado DESC
			  LIMIT 1) TABLA_3) TABLA_3,
	(SELECT 
	    CONCAT(
	        '[',
	        GROUP_CONCAT(
	            '{"id_mesa":', m.id_mesa, 
	            ',"mesero":"', REPLACE(CONCAT(u2.name, ' ', u2.lastname), '"', '\\"'), 
	            '","estado":"',
	            CASE WHEN m.mesa_estado = 1 THEN 'Activo' ELSE 'Cerrado' END,
	            '"}'
	            ORDER BY m.id_mesa
	            SEPARATOR ','
	        ),
	        ']'
	    ) mesas
	FROM 
		mesas m, users u2 
	WHERE 
	  	u2.id = m.id_staff
	AND 
		m.id_local = ?
	AND 
		DATE(m.mesa_fecha_crea) BETWEEN ? and ?) TABLA_4,
	(SELECT CONCAT(
			    '[',
			    GROUP_CONCAT(
			         '{"producto":"', producto,
			         '","cantidad":', cantidad,
			         ',"total_generado":', total_generado,
			         '}' SEPARATOR ','
			        ),
			    ']'
			) AS productos
			FROM (
			    SELECT 
			        p.name AS producto,
			        ohp.quantity AS cantidad,
			        SUM(p.price * ohp.quantity) AS total_generado
			    FROM
			        order_has_products ohp, ordersCompart oc, mesas m, products p
			    WHERE 
			    	oc.OrdersID = ohp.id_order
			      AND 
			        m.id_mesa = oc.id_mesa
			      AND 
					ohp.id_product = p.id
			      AND
			        m.id_local = ?
			      AND 
			      	DATE(m.mesa_fecha_crea) BETWEEN ? and ?
			    GROUP BY 
			        p.name, ohp.quantity
			) AS datos) TABLA_5,
	(SELECT CONCAT(
		    '[',
		    GROUP_CONCAT(
		         '{"metodo":"', metodo,
		         '","transacciones":', transacciones,
		         ',"total":', total,
		         '}' SEPARATOR ','
		        ),
		    ']'
		) AS metodos_pago
		FROM (
		    SELECT 
		        pl.metodoDePago metodo,
		        COUNT(pl.id) transacciones,
		        SUM(pl.montoPagado) total
		    FROM 
		        mesas m, pagosLogs pl 
		    WHERE 
		        m.id_mesa = pl.id_mesa
		    AND 
		        m.id_local = ?
		    AND 
		        DATE(m.mesa_fecha_crea) BETWEEN ? and ?
		    GROUP BY 
		        pl.metodoDePago
		) AS datos) TABLA_6
    `;

    db.query(
        sql,
        [id_local, fecha_desde, fecha_hasta, id_local, fecha_desde, fecha_hasta, id_local, fecha_desde, fecha_hasta, id_local, fecha_desde, fecha_hasta, id_local, fecha_desde, fecha_hasta, id_local, fecha_desde, fecha_hasta],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Datos del reporte por rango de fechas para comercio:', res);
                result(null, res);
            }
        }
    );
}

module.exports = Reporte;