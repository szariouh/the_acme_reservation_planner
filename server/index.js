
const {
    client,
    createTables,
    createCustomer,
    createRestaurant,
    fetchCustomers,
    fetchRestaurants,
    createReservation,
    fetchReservations,
    destroyReservation
  } = require('./db');
  const express = require('express'); 
  const app = express();
  app.use(express.json());
  
  app.get('/api/customers', async(req, res, next)=> {
    try {
      res.send(await fetchCustomers());
    }
    catch(ex){
      next(ex);
    }
  });
  
  app.get('/api/restaurants', async(req, res, next)=> {
    try {
      res.send(await fetchRestaurants());
    }
    catch(ex){
      next(ex);
    }
  });
  
  app.get('/api/reservations', async(req, res, next)=> {
    try {
      res.send(await fetchReservations());
    }
    catch(ex){
      next(ex);
    }
  });
  
  app.delete('/api/reservations/:id', async(req, res, next)=> {
    try {
      await destroyReservation(req.params.id);
      res.sendStatus(204);
    }
    catch(ex){
      next(ex);
    }
  });
  
  app.post('/api/reservations', async(req, res, next)=> {
    try {
      res.status(201).send(await createReservation(req.body));
    }
    catch(ex){
      next(ex);
    }
  });
  
  const init = async()=> {
    await client.connect();
    console.log('connected to database');
    await createTables();
    console.log('tables created');
    const [noah, john, mery, pizzaR, burgerP, tacoS, pizzaS] = await Promise.all([
      createCustomer('Noah'),
      createCustomer('John'),
      createCustomer('Mery'),
      createRestaurant('Pizza restaurant'),
      createRestaurant('Burger pro'),
      createRestaurant('Tacos S'),
      createRestaurant('Pizza Space')
    ]);
    console.log(`Sara has an id of ${noah.id}`);
    console.log(`pizza restaurant has an id of ${pizzaR.id}`);
    console.log(await fetchCustomers());
    console.log(await fetchRestaurants());
    await Promise.all([
      createReservation({ customer_id: noah.id, restaurant_id: burgerP.id, reservation_date: '04/03/2024'}),
      createReservation({ customer_id: noah.id, restaurant_id: tacoS.id, reservation_date: '04/12/2024'}),
      createReservation({ customer_id: mery.id, restaurant_id: pizzaR.id, reservation_date: '04/03/2024'}),
      createReservation({ customer_id: mery.id, restaurant_id: pizzaR.id, reservation_date: '1/09/2024'}),
    ]);
    const reservations = await fetchReservations();
    console.log(reservations);
    await destroyReservation(reservations[0].id);
    console.log(await fetchReservations());
    
    const port = process.env.PORT || 3000;
    app.listen(port, ()=> console.log(`listening on port ${port}`));
  
  };
  
  init();
  