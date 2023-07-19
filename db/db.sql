USE app_gastro;


CREATE TABLE users(
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(180) NOT NULL UNIQUE,
    name VARCHAR(90) NOT NULL,
    lastname VARCHAR(90) NOT NULL,
    phone VARCHAR(90) NOT NULL UNIQUE,
    image VARCHAR(255) NULL,
    password VARCHAR(90) NOT NULL,
    created_at TIMESTAMP(0) NOT NULL,
    updated_at TIMESTAMP(0) NOT NULL,
    notification_token VARCHAR(255) NULL
);
--ALTER TABLE gastro_db.users CHANGE token notification_token varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL;

CREATE TABLE roles(
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(90) NOT NULL UNIQUE,
    image VARCHAR(255) NULL,
    route VARCHAR(180) NOT NULL,
    created_at TIMESTAMP(0) NOT NULL,
    updated_at TIMESTAMP(0) NOT NULL
);

INSERT INTO roles(
	name,
    route,
    created_at,
    updated_at
)
VALUES(
	'RESTAURANTE',
    '/restaurant/orders/list',
    '2022-03-27',
    '2022-03-27'
);

INSERT INTO roles(
	name,
    route,
    created_at,
    updated_at
)
VALUES(
	'REPARTIDOR',
    '/delivery/orders/list',
    '2022-03-27',
    '2022-03-27'
);

INSERT INTO roles(
	name,
    route,
    created_at,
    updated_at
)
VALUES(
	'CLIENTE',
    '/client/products/list',
    '2022-03-27',
    '2022-03-27'
);

CREATE TABLE user_has_roles(
	id_user BIGINT NOT NULL,
    id_rol BIGINT NOT NULL,
    created_at TIMESTAMP(0) NOT NULL,
    updated_at TIMESTAMP(0) NOT NULL,
    FOREIGN KEY(id_user) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(id_rol) REFERENCES roles(id) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY(id_user, id_rol)
);
ALTER TABLE gastro_db.user_has_roles ADD id_local BIGINT NULL;

CREATE TABLE categories(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(180) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(255) NULL,
     created_at TIMESTAMP(0) NOT NULL,
    updated_at TIMESTAMP(0) NOT NULL
);

CREATE TABLE products(
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(180) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    image1 VARCHAR(255) NULL,
    image2 VARCHAR(255) NULL,
    image3 VARCHAR(255) NULL,
    id_category BIGINT NOT NULL,
    stock double NOT NULL,
    created_at TIMESTAMP(0) NOT NULL,
    updated_at TIMESTAMP(0) NOT NULL,
    FOREIGN KEY(id_category) REFERENCES categories(id) ON UPDATE CASCADE ON DELETE CASCADE
);
ALTER TABLE gastro_db.products ADD stock BIGINT NULL;

CREATE TABLE address(
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
    address VARCHAR(255) NOT NULL,
    neighborhood VARCHAR(180) NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMP(0) NOT NULL,
    updated_at TIMESTAMP(0) NOT NULL,
    id_user BIGINT NOT NULL,
    FOREIGN KEY(id_user) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- gastro_db.orders definition

CREATE TABLE `orders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_client` bigint NOT NULL,
  `id_delivery` bigint DEFAULT NULL,
  `id_address` bigint NOT NULL,
  `lat` double DEFAULT NULL,
  `lng` double DEFAULT NULL,
  `status` varchar(90) NOT NULL,
  `timestamp` bigint NOT NULL,
  `id_mesa` bigint NOT NULL,
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_client` (`id_client`),
  KEY `id_delivery` (`id_delivery`),
  KEY `id_address` (`id_address`),
  KEY `id_mesa` (`id_mesa`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`id_client`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`id_delivery`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`id_address`) REFERENCES `address` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_4` FOREIGN KEY (`id_mesa`) REFERENCES `mesas` (`id_mesa`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- gastro_db.order_has_products definition

CREATE TABLE `order_has_products` (
  `id_order` bigint NOT NULL,
  `id_product` bigint NOT NULL,
  `quantity` bigint NOT NULL,
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NOT NULL,
  PRIMARY KEY (`id_order`,`id_product`),
  KEY `id_product` (`id_product`),
  KEY `id_order` (`id_order`),
  CONSTRAINT `order_has_products_ibfk_1` FOREIGN KEY (`id_product`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_has_products_ibfk_2` FOREIGN KEY (`id_order`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE locales (
  id_local bigint NOT NULL AUTO_INCREMENT,
  loc_nombre varchar(50) NOT NULL,
  loc_descripcion varchar(50) NOT NULL,
  loc_imagen varchar(250) NOT NULL,
  loc_estado int NOT NULL,
  id_categoria bigint NOT NULL,
  loc_creado timestamp NOT NULL,
  loc_update timestamp NOT NULL,
  FOREIGN KEY(id_categoria) REFERENCES categories(id) ON UPDATE CASCADE ON DELETE CASCADE,
  PRIMARY KEY (id_local)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE mesas (
  id_mesa bigint NOT NULL AUTO_INCREMENT,
  codigoqr varchar(20) NOT NULL,
  mesa_ubicacion varchar(20) NOT NULL,
  mesa_estado int NOT NULL,
  total_cancelado double NOT NULL,
  propina double NOT NULL,
  pagado varchar(2) NOT NULL,
  id_staff bigint NOT NULL,
  mesa_fecha_crea timestamp NOT NULL,
  mesa_fecha_cierre timestamp NOT NULL,
  PRIMARY KEY (id_mesa)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE usuariosActivos (
  id_usuario bigint NOT NULL AUTO_INCREMENT,
  id_mesa bigint NOT NULL,
  id_local bigint NOT NULL,
  estado int NOT NULL,
  monto_pagado double NOT NULL,
  es_temporal varchar(2) NOT NULL,
  ingreso timestamp NOT NULL,
  salida timestamp NOT NULL,
  FOREIGN KEY(id_usuario) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY(id_mesa) REFERENCES mesas(id_mesa) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY(id_local) REFERENCES locales(id_local) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `promociones` (
  `id_promocion` bigint NOT NULL AUTO_INCREMENT,
  `pro_nombre` varchar(50) NOT NULL,
  `id_local` bigint NOT NULL,
  `pro_descripcion` varchar(50) NOT NULL,
  `pro_imagen` varchar(250) NOT NULL,
  `pro_estado` int NOT NULL,
  `pro_creado` timestamp NOT NULL,
  `pro_update` timestamp NOT NULL,
  PRIMARY KEY (`id_promocion`),
  KEY `id_local` (`id_local`),
  CONSTRAINT `promociones_ibfk_1` FOREIGN KEY(`id_local`) REFERENCES `locales`(`id_local`) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO gastro_db.users (id, email, name, lastname, phone, image, password, created_at, updated_at, notification_token) VALUES(1, 'abc@gmail.com', 'Sebasti�n', 'G�mez', '0981680039', 'https://firebasestorage.googleapis.com/v0/b/appgastro-9ee36.appspot.com/o/image_1684766413450?alt=media&token=ddca61b6-e84f-423d-b7f1-f2c5c1db7135', '$2a$10$gieYC7STwamPdgXqfGyGq.fnr7Yh/BdM73pCRJecce2aZ6qdrC8eK', '2023-05-22 10:40:24', '2023-05-22 10:40:24', NULL);
INSERT INTO gastro_db.users (id, email, name, lastname, phone, image, password, created_at, updated_at, notification_token) VALUES(2, 'asd@gmail.com', 'Ricardo', 'Braga', '0981999666', 'https://firebasestorage.googleapis.com/v0/b/appgastro-9ee36.appspot.com/o/image_1684882394590?alt=media&token=db7e5e14-0124-477c-94e1-dcd9f2edca91', '$2a$10$Wrl8XhO.BKHvvKFZxyDZ8./ZK7oDiy5ZJwpfCPm3xoooSnQFACQYi', '2023-05-23 18:53:16', '2023-05-23 18:53:16', NULL);
INSERT INTO gastro_db.users (id, email, name, lastname, phone, image, password, created_at, updated_at, notification_token) VALUES(3, 'sergio@gmail.com', 'Sergio', 'Rios', '0981333969', 'https://firebasestorage.googleapis.com/v0/b/appgastro-9ee36.appspot.com/o/image_1687391248846?alt=media&token=f4cce5cf-2e7a-40f1-9fc5-7298177773c3', '$2a$10$Wyn8pZ2bt6/n7NOWC6AN7u1s24Eei8G8gfOZ5VEhu7ncybTDXyfYK', '2023-06-21 19:47:30', '2023-06-21 19:47:30', NULL);
INSERT INTO gastro_db.users (id, email, name, lastname, phone, image, password, created_at, updated_at, notification_token) VALUES(4, 'jose@gmail.com', 'Jose', 'Perez', '0987123123', 'https://firebasestorage.googleapis.com/v0/b/appgastro-9ee36.appspot.com/o/image_1687394327640?alt=media&token=41da139d-d5cb-4f9c-afc1-0a6cfd60809c', '$2a$10$ujJ3bjQsyUpKCLTcg8Bwv.rNugMJ9CcKZOCtGfAlgcfN1KKKgWNo.', '2023-06-21 20:38:53', '2023-06-21 20:38:53', NULL);
INSERT INTO gastro_db.users (id, email, name, lastname, phone, image, password, created_at, updated_at, notification_token) VALUES(5, 'carlos@gmail.com', 'Carlos', 'Lopez', '0984123569', 'https://firebasestorage.googleapis.com/v0/b/appgastro-9ee36.appspot.com/o/image_1687396279989?alt=media&token=04a02c15-6e9c-485f-b99c-5b2a17c0e5f1', '$2a$10$paV.meYBlkOwlUzS1NwL9e6xbWGwlteVoTh6EkvoQBcJzT1l/ngzq', '2023-06-21 21:11:31', '2023-06-21 21:11:31', NULL);

INSERT INTO gastro_db.user_has_roles (id_user, id_rol, created_at, updated_at) VALUES(1, 1, '2023-05-22 10:40:24', '2023-05-22 10:40:24');
INSERT INTO gastro_db.user_has_roles (id_user, id_rol, created_at, updated_at) VALUES(1, 2, '2023-06-21 21:11:31', '2023-06-21 21:11:31');
INSERT INTO gastro_db.user_has_roles (id_user, id_rol, created_at, updated_at) VALUES(2, 3, '2023-05-23 18:53:16', '2023-05-23 18:53:16');
INSERT INTO gastro_db.user_has_roles (id_user, id_rol, created_at, updated_at) VALUES(3, 3, '2023-06-21 19:47:30', '2023-06-21 19:47:30');
INSERT INTO gastro_db.user_has_roles (id_user, id_rol, created_at, updated_at) VALUES(4, 3, '2023-06-21 20:38:53', '2023-06-21 20:38:53');
INSERT INTO gastro_db.user_has_roles (id_user, id_rol, created_at, updated_at) VALUES(5, 3, '2023-06-21 21:11:31', '2023-06-21 21:11:31');

INSERT INTO gastro_db.roles (id, name, image, route, created_at, updated_at) VALUES(1, 'ADMIN', 'https://firebasestorage.googleapis.com/v0/b/appgastro-9ee36.appspot.com/o/image_1684726242822?alt=media&token=5704d951-fdc6-4cfc-a89b-18ff07ad4fc4', '/restaurant/orders/list', '2022-03-27 00:00:00', '2022-03-27 00:00:00');
INSERT INTO gastro_db.roles (id, name, image, route, created_at, updated_at) VALUES(2, 'REPARTIDOR', 'https://firebasestorage.googleapis.com/v0/b/appgastro-9ee36.appspot.com/o/image_1684726242822?alt=media&token=5704d951-fdc6-4cfc-a89b-18ff07ad4fc4', '/delivery/orders/list', '2022-03-27 00:00:00', '2022-03-27 00:00:00');
INSERT INTO gastro_db.roles (id, name, image, route, created_at, updated_at) VALUES(3, 'CLIENTE', 'https://firebasestorage.googleapis.com/v0/b/appgastro-9ee36.appspot.com/o/image_1684726242822?alt=media&token=5704d951-fdc6-4cfc-a89b-18ff07ad4fc4', '/client/products/list', '2022-03-27 00:00:00', '2022-03-27 00:00:00');

INSERT INTO gastro_db.products (id, name, description, price, image1, image2, image3, id_category, created_at, updated_at) VALUES(1, 'CocaCola 500ml', 'CocaCola 500ml', 5000.0, 'https://firebasestorage.googleapis.com/v0/b/appgastro-9ee36.appspot.com/o/descarga.jpeg?alt=media&token=a050a508-dd55-4639-97be-e04a98c930ca', 'https://firebasestorage.googleapis.com/v0/b/appgastro-9ee36.appspot.com/o/descarga.jpeg?alt=media&token=a050a508-dd55-4639-97be-e04a98c930ca', NULL, 1, '2022-03-27 00:00:00', '2022-03-27 00:00:00');
INSERT INTO gastro_db.products (id, name, description, price, image1, image2, image3, id_category, created_at, updated_at) VALUES(2, 'Vino Santa Elena 1L', 'Vino Santa Elena 1L', 30000.0, 'https://firebasestorage.googleapis.com/v0/b/appgastro-9ee36.appspot.com/o/vinosantae.jpeg?alt=media&token=d1d9b082-ced2-4bc6-8a9b-6a745fe190e4', 'https://firebasestorage.googleapis.com/v0/b/appgastro-9ee36.appspot.com/o/vinosantae.jpeg?alt=media&token=d1d9b082-ced2-4bc6-8a9b-6a745fe190e4', 'https://firebasestorage.googleapis.com/v0/b/appgastro-9ee36.appspot.com/o/vinosantae.jpeg?alt=media&token=d1d9b082-ced2-4bc6-8a9b-6a745fe190e4', 1, '2022-03-27 00:00:00', '2022-03-27 00:00:00');
INSERT INTO gastro_db.products (id, name, description, price, image1, image2, image3, id_category, created_at, updated_at) VALUES(3, 'Pizza de Peperonni ', 'Pizza de Peperonni para 8 personas', 40000.0, 'https://firebasestorage.googleapis.com/v0/b/appgastro-9ee36.appspot.com/o/Pizza-con-pepperoni-640x480.webp?alt=media&token=34442a70-bc27-47a2-bb26-a4f6447cae3e', 'https://firebasestorage.googleapis.com/v0/b/appgastro-9ee36.appspot.com/o/Pizza-con-pepperoni-640x480.webp?alt=media&token=34442a70-bc27-47a2-bb26-a4f6447cae3e', 'https://firebasestorage.googleapis.com/v0/b/appgastro-9ee36.appspot.com/o/Pizza-con-pepperoni-640x480.webp?alt=media&token=34442a70-bc27-47a2-bb26-a4f6447cae3e', 2, '2022-03-27 00:00:00', '2022-03-27 00:00:00');
INSERT INTO gastro_db.products (id, name, description, price, image1, image2, image3, id_category, created_at, updated_at) VALUES(4, 'Pizza Napolitana', 'Pizza Napolitana para 8 personas', 35000.0, 'https://firebasestorage.googleapis.com/v0/b/appgastro-9ee36.appspot.com/o/margarita1.jpeg?alt=media&token=f171817f-2f46-48eb-97ee-932cd350cb5e', 'https://firebasestorage.googleapis.com/v0/b/appgastro-9ee36.appspot.com/o/margarita1.jpeg?alt=media&token=f171817f-2f46-48eb-97ee-932cd350cb5e', 'https://firebasestorage.googleapis.com/v0/b/appgastro-9ee36.appspot.com/o/margarita1.jpeg?alt=media&token=f171817f-2f46-48eb-97ee-932cd350cb5e', 2, '2022-03-27 00:00:00', '2022-03-27 00:00:00');
INSERT INTO gastro_db.products (id, name, description, price, image1, image2, image3, id_category, created_at, updated_at) VALUES(5, 'Pizza Margarita', 'Pizza Margarita para 8 personas', 40000.0, 'https://firebasestorage.googleapis.com/v0/b/appgastro-9ee36.appspot.com/o/margarita3.jpeg?alt=media&token=52a120b6-57e7-4d67-89cd-6d4e1a46bad0', 'https://firebasestorage.googleapis.com/v0/b/appgastro-9ee36.appspot.com/o/margarita3.jpeg?alt=media&token=52a120b6-57e7-4d67-89cd-6d4e1a46bad0', 'https://firebasestorage.googleapis.com/v0/b/appgastro-9ee36.appspot.com/o/margarita3.jpeg?alt=media&token=52a120b6-57e7-4d67-89cd-6d4e1a46bad0', 2, '2022-03-27 00:00:00', '2022-03-27 00:00:00');
INSERT INTO gastro_db.products (id, name, description, price, image1, image2, image3, id_category, created_at, updated_at) VALUES(6, 'Red Velvet Cake', 'Red Velvet Cake Porci�n 150gr', 20000.0, 'https://firebasestorage.googleapis.com/v0/b/appgastro-9ee36.appspot.com/o/red-velvet-cake.jpeg?alt=media&token=b044c6cd-a3ae-48b0-837e-8bb28d52815f', 'https://firebasestorage.googleapis.com/v0/b/appgastro-9ee36.appspot.com/o/red-velvet-cake-recipe-SQUARE.jpg?alt=media&token=ea833281-89df-4337-bfd4-3a63848161cf', 'https://firebasestorage.googleapis.com/v0/b/appgastro-9ee36.appspot.com/o/red-velvet-cake.jpeg?alt=media&token=b044c6cd-a3ae-48b0-837e-8bb28d52815f', 3, '2022-03-27 00:00:00', '2022-03-27 00:00:00');
INSERT INTO gastro_db.products (id, name, description, price, image1, image2, image3, id_category, created_at, updated_at) VALUES(7, 'Brownie Chocolate', 'Brownie Chocolate Porci�n 150gr', 15000.0, 'https://firebasestorage.googleapis.com/v0/b/appgastro-9ee36.appspot.com/o/Several_brownies.jpg?alt=media&token=1b81c322-8013-4ec7-bf91-ac370d9b2e9a', 'https://firebasestorage.googleapis.com/v0/b/appgastro-9ee36.appspot.com/o/brownies.webp?alt=media&token=19b5dc93-d586-4979-b86c-b187603e4459', 'https://firebasestorage.googleapis.com/v0/b/appgastro-9ee36.appspot.com/o/Several_brownies.jpg?alt=media&token=1b81c322-8013-4ec7-bf91-ac370d9b2e9a', 3, '2022-03-27 00:00:00', '2022-03-27 00:00:00');

INSERT INTO gastro_db.orders (id, id_client, id_delivery, id_address, lat, lng, status, `timestamp`, created_at, updated_at) VALUES(5, 2, 1, 1, 1684885223828, NULL, 'DESPACHADO', 1684885223828, '2023-05-23 19:40:24', '2023-05-23 19:40:24');
INSERT INTO gastro_db.orders (id, id_client, id_delivery, id_address, lat, lng, status, `timestamp`, created_at, updated_at) VALUES(6, 1, NULL, 1, NULL, NULL, 'PAGADO', 1687213279428, '2023-06-19 18:21:19', '2023-06-19 18:21:19');

INSERT INTO gastro_db.order_has_products (id_order, id_product, quantity, created_at, updated_at) VALUES(5, 1, 2, '2023-05-23 19:40:24', '2023-05-23 19:40:24');
INSERT INTO gastro_db.order_has_products (id_order, id_product, quantity, created_at, updated_at) VALUES(5, 2, 1, '2023-05-23 19:40:24', '2023-05-23 19:40:24');
INSERT INTO gastro_db.order_has_products (id_order, id_product, quantity, created_at, updated_at) VALUES(5, 3, 1, '2023-05-23 19:40:24', '2023-05-23 19:40:24');
INSERT INTO gastro_db.order_has_products (id_order, id_product, quantity, created_at, updated_at) VALUES(5, 6, 2, '2023-05-23 19:40:24', '2023-05-23 19:40:24');
INSERT INTO gastro_db.order_has_products (id_order, id_product, quantity, created_at, updated_at) VALUES(6, 1, 3, '2023-06-19 18:21:19', '2023-06-19 18:21:19');
INSERT INTO gastro_db.order_has_products (id_order, id_product, quantity, created_at, updated_at) VALUES(6, 2, 1, '2023-06-19 18:21:19', '2023-06-19 18:21:19');

INSERT INTO gastro_db.categories (id, name, description, image, created_at, updated_at, id_local) VALUES(1, 'Bebidas', 'Listado de bebidas', 'https://firebasestorage.googleapis.com/v0/b/appgastro-9ee36.appspot.com/o/bebidajajajaj.jpeg?alt=media&token=c9dfb45b-4357-4e51-ba21-4eceba5b2e91', '2022-03-27 00:00:00', '2022-03-27 00:00:00', 1);
INSERT INTO gastro_db.categories (id, name, description, image, created_at, updated_at, id_local) VALUES(2, 'Pizzas', 'Listado de pizzas', 'https://firebasestorage.googleapis.com/v0/b/appgastro-9ee36.appspot.com/o/slice-of-pizza-cartoon-cartoon-illustration-cartoon-clipart-free-vector.jpg?alt=media&token=93e17e9c-d766-4af0-8331-7c0627718acf', '2022-03-27 00:00:00', '2022-03-27 00:00:00', 1);
INSERT INTO gastro_db.categories (id, name, description, image, created_at, updated_at, id_local) VALUES(3, 'Postres', 'Listado de postres', 'https://firebasestorage.googleapis.com/v0/b/appgastro-9ee36.appspot.com/o/pngtree-food-elements-hand-drawn-cute-cartoon-dessert-cake-elementcartoon-foodhand-drawn-png-image_614857.jpg?alt=media&token=6ac9fcaf-77e2-4a52-85e0-2782ce34322f', '2022-03-27 00:00:00', '2022-03-27 00:00:00', 1);

INSERT INTO gastro_db.address (id, address, neighborhood, lat, lng, created_at, updated_at, id_user) VALUES(1, 'Mesa 1', 'Patio Trasero', 0.0, 0.0, '2023-05-22 20:34:45', '2023-05-22 20:34:45', 1);

INSERT INTO gastro_db.locales (id_local, loc_nombre, loc_descripcion, loc_imagen, loc_estado, id_categoria, loc_creado, loc_update) VALUES(1, 'Charles The Bar', 'Pub - Bar', 'https://firebasestorage.googleapis.com/v0/b/appgastro-9ee36.appspot.com/o/charles.png?alt=media&token=e9d85abf-11f6-4c21-88eb-9d8400c69bf1', 1, 1, '2023-05-22 10:40:24', '2023-05-22 10:40:24');
INSERT INTO gastro_db.locales (id_local, loc_nombre, loc_descripcion, loc_imagen, loc_estado, id_categoria, loc_creado, loc_update) VALUES(2, 'Baroga', 'Bar - DiscoPub', 'https://firebasestorage.googleapis.com/v0/b/appgastro-9ee36.appspot.com/o/baroga.jpeg?alt=media&token=5a44d776-de41-4b0f-976a-d810f2ed8ad2', 1, 1, '2023-05-22 10:40:24', '2023-05-22 10:40:24');
INSERT INTO gastro_db.locales (id_local, loc_nombre, loc_descripcion, loc_imagen, loc_estado, id_categoria, loc_creado, loc_update) VALUES(3, 'Negroni Downtown SkyBar', 'Bar - Bistro', 'https://firebasestorage.googleapis.com/v0/b/appgastro-9ee36.appspot.com/o/Negroni.png?alt=media&token=ebcf91fd-f006-4bb7-9661-957c25996207', 1, 1, '2023-05-22 10:40:24', '2023-05-22 10:40:24');
INSERT INTO gastro_db.locales (id_local, loc_nombre, loc_descripcion, loc_imagen, loc_estado, id_categoria, loc_creado, loc_update) VALUES(4, 'Pancia Piena Pizzeria', 'Restaurant', 'https://firebasestorage.googleapis.com/v0/b/appgastro-9ee36.appspot.com/o/PianciaPiena.jpeg?alt=media&token=cfc4a0f7-5e5f-487e-8683-a2e786d8f62a', 1, 1, '2023-05-22 10:40:24', '2023-05-22 10:40:24');

INSERT INTO gastro_db.mesas (id_mesa, codigoqr, mesa_ubicacion, mesa_estado, total_cancelado, propina, pagado, id_staff, mesa_fecha_crea, mesa_fecha_cierre) VALUES(1, 'JHSD65G4', '1', 1, 150000.0, 0.0, 'NO', 1, '2022-03-27 00:00:00', '2022-03-27 00:00:00');

INSERT INTO gastro_db.promociones (id_promocion, pro_nombre, id_local, pro_descripcion, pro_imagen, pro_estado, pro_creado, pro_update) VALUES(1, 'Promo charles', 1, 'Promo Semana 1 - Julio', 'https://firebasestorage.googleapis.com/v0/b/appgastro-9ee36.appspot.com/o/promo_charles4.jpeg?alt=media&token=2dc07911-0236-448d-b241-c919904629cb', 1, '2023-05-22 10:40:24', '2023-05-22 10:40:24');
INSERT INTO gastro_db.promociones (id_promocion, pro_nombre, id_local, pro_descripcion, pro_imagen, pro_estado, pro_creado, pro_update) VALUES(2, 'Promo Negroni', 3, 'Promo Semana 1 - Julio', 'https://firebasestorage.googleapis.com/v0/b/appgastro-9ee36.appspot.com/o/promo_negroni1.jpeg?alt=media&token=f6525ec7-03ae-4e42-beb4-f0e77324af32', 1, '2023-05-22 10:40:24', '2023-05-22 10:40:24');
INSERT INTO gastro_db.promociones (id_promocion, pro_nombre, id_local, pro_descripcion, pro_imagen, pro_estado, pro_creado, pro_update) VALUES(3, 'Promo Baroga', 2, 'Promo Semana 1 - Julio', 'https://firebasestorage.googleapis.com/v0/b/appgastro-9ee36.appspot.com/o/promo_baroga1.jpeg?alt=media&token=85c83600-3d53-4eaf-8ed7-858635830004', 1, '2023-05-22 10:40:24', '2023-05-22 10:40:24');

INSERT INTO gastro_db.usuariosActivos (id_usuario, id_mesa, id_local, estado, monto_pagado, es_temporal, ingreso, salida) VALUES(1, 1, 1, 1, 100000.0, 'NO', '2022-03-27 00:00:00', '2022-03-27 00:00:00');
INSERT INTO gastro_db.usuariosActivos (id_usuario, id_mesa, id_local, estado, monto_pagado, es_temporal, ingreso, salida) VALUES(3, 1, 1, 1, 50000.0, 'SI', '2022-03-27 00:00:00', '2022-03-27 00:00:00');
INSERT INTO gastro_db.usuariosActivos (id_usuario, id_mesa, id_local, estado, monto_pagado, es_temporal, ingreso, salida) VALUES(2, 1, 1, 1, 0.0, 'NO', '2022-03-27 00:00:00', '2022-03-27 00:00:00');
INSERT INTO gastro_db.usuariosActivos (id_usuario, id_mesa, id_local, estado, monto_pagado, es_temporal, ingreso, salida) VALUES(4, 1, 1, 1, 0.0, 'SI', '2022-03-27 00:00:00', '2022-03-27 00:00:00');


-- gastro_db.ordersCompart definition

CREATE TABLE `ordersCompart` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `OrdersID` bigint NOT NULL,
  `id_usuarioActivo` bigint NOT NULL,
  `id_mesa` bigint DEFAULT NULL,
  `estado` bigint NOT NULL,
  `subTotal` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `OrdersID` (`OrdersID`),
  KEY `id_usuarioActivo` (`id_usuarioActivo`),
  KEY `id_mesa` (`id_mesa`),
  CONSTRAINT `ordersCompart_ibfk_1` FOREIGN KEY (`OrdersID`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ordersCompart_ibfk_2` FOREIGN KEY (`id_usuarioActivo`) REFERENCES `usuariosActivos` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ordersCompart_ibfk_3` FOREIGN KEY (`id_mesa`) REFERENCES `mesas` (`id_mesa`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
ALTER TABLE gastro_db.ordersCompart ADD subTotal BIGINT NULL;
ALTER TABLE gastro_db.ordersCompart ADD id BIGINT auto_increment NOT NULL;
ALTER TABLE gastro_db.ordersCompart CHANGE id id BIGINT auto_increment NOT NULL FIRST;
ALTER TABLE gastro_db.ordersCompart ADD CONSTRAINT ordersCompart_PK PRIMARY KEY (id);

-- gastro_db.pedidoLog definition

CREATE TABLE `pedidoLog` (
  `id_log` bigint NOT NULL AUTO_INCREMENT,
  `id_mesa` bigint DEFAULT NULL,
  `id_orders` bigint NOT NULL,
  `estadoPedido` int NOT NULL,
  `costoTotal` bigint NOT NULL,
  `idProducto` bigint NOT NULL,
  `descripcion` varchar(250) NOT NULL,
  `cantidad` bigint NOT NULL,
  `subTotal` bigint NOT NULL,
  `fechaSolicitud` timestamp NOT NULL,
  `fechaEntrega` timestamp NOT NULL,
  PRIMARY KEY (`id_log`),
  KEY `id_mesa` (`id_mesa`),
  KEY `id_orders` (`id_orders`),
  KEY `idProducto` (`idProducto`),
  CONSTRAINT `pedido_log_ibfk_1` FOREIGN KEY (`id_mesa`) REFERENCES `mesas` (`id_mesa`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `pedido_log_ibfk_2` FOREIGN KEY (`id_orders`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `pedido_log_ibfk_3` FOREIGN KEY (`idProducto`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE gastro_db.orders ADD id_mesa BIGINT NULL;
ALTER TABLE gastro_db.orders ADD CONSTRAINT orders_FK FOREIGN KEY (id_mesa) REFERENCES gastro_db.mesas(id_mesa) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE gastro_db.locales DROP FOREIGN KEY locales_ibfk_1;
ALTER TABLE gastro_db.categories ADD id_local BIGINT NULL;
ALTER TABLE gastro_db.categories ADD CONSTRAINT id_local FOREIGN KEY (id_local) REFERENCES gastro_db.locales(id_local) ON DELETE CASCADE ON UPDATE CASCADE;


ALTER TABLE gastro_db.locales DROP FOREIGN KEY locales_ibfk_1;
ALTER TABLE gastro_db.categories ADD id_local BIGINT NULL;
ALTER TABLE gastro_db.categories ADD CONSTRAINT id_local FOREIGN KEY (id_local) REFERENCES gastro_db.locales(id_local) ON DELETE CASCADE ON UPDATE CASCADE;

-- Con la nueva columna: id_local - gastro_db.user_has_roles definition

CREATE TABLE `user_has_roles` (
  `id_user` bigint NOT NULL,
  `id_rol` bigint NOT NULL,
  `id_local` bigint DEFAULT NULL,
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NOT NULL,
  PRIMARY KEY (`id_user`,`id_rol`),
  KEY `id_rol` (`id_rol`),
  KEY `id_local` (`id_local`),
  CONSTRAINT `user_has_roles_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_has_roles_ibfk_2` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_has_roles_ibfk_3` FOREIGN KEY (`id_local`) REFERENCES `locales` (`id_local`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE gastro_db.users MODIFY COLUMN phone varchar(90) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL;
ALTER TABLE gastro_db.users MODIFY COLUMN password varchar(90) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL;
ALTER TABLE gastro_db.users MODIFY COLUMN created_at timestamp NULL;
ALTER TABLE gastro_db.users MODIFY COLUMN updated_at timestamp NULL;


