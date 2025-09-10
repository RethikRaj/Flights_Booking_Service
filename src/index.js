const express = require('express');
const { ServerConfig , Logger, SwaggerConfig} = require('./config'); // ./config/index.js == ./config
const apiRoutes = require('./routers');
const CronJobs = require('./utils/common/cronJobs')

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : true}));

// Swagger Documentation
app.use('/api-docs', SwaggerConfig.swaggerUi.serve, SwaggerConfig.swaggerUi.setup(SwaggerConfig.specs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Flight Bookings Service API Documentation'
}));

app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, ()=>{
    console.log(`Server is running on port ${ServerConfig.PORT}`);
    CronJobs();
})