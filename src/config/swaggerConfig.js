const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Flight Bookings Service API',
      version: '1.0.0',
      description: 'Comprehensive booking management service with payment processing and automated cleanup',
      contact: {
        name: 'Rethik',
        email: 'developer@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server'
      },
      {
        url: 'https://bookings.flightbooking.com',
        description: 'Production server'
      }
    ],
    components: {
      schemas: {
        Booking: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Booking ID',
              example: 1
            },
            userId: {
              type: 'integer',
              description: 'User who made the booking',
              example: 123
            },
            flightId: {
              type: 'integer',
              description: 'Booked flight ID',
              example: 456
            },
            status: {
              type: 'string',
              enum: ['INITIATED', 'PENDING', 'BOOKED', 'CANCELLED'],
              description: 'Current booking status',
              example: 'BOOKED'
            },
            noOfSeats: {
              type: 'integer',
              description: 'Number of seats booked',
              example: 2,
              default: 1
            },
            totalCost: {
              type: 'number',
              format: 'decimal',
              description: 'Total booking cost',
              example: 11000.00
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Booking creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        CreateBookingRequest: {
          type: 'object',
          required: ['flightId', 'userId', 'numberOfSeats'],
          properties: {
            flightId: {
              type: 'integer',
              description: 'ID of the flight to book',
              example: 456
            },
            userId: {
              type: 'integer',
              description: 'ID of the user making the booking',
              example: 123
            },
            numberOfSeats: {
              type: 'integer',
              description: 'Number of seats to book',
              minimum: 1,
              maximum: 10,
              example: 2
            }
          }
        },
        PaymentRequest: {
          type: 'object',
          required: ['bookingId', 'amount', 'userId'],
          properties: {
            bookingId: {
              type: 'integer',
              description: 'ID of the booking to pay for',
              example: 1
            },
            amount: {
              type: 'number',
              format: 'decimal',
              description: 'Payment amount',
              example: 11000.00
            },
            userId: {
              type: 'integer',
              description: 'ID of the user making payment',
              example: 123
            }
          }
        },
        PaymentResponse: {
          type: 'object',
          properties: {
            transactionId: {
              type: 'string',
              description: 'Payment transaction ID',
              example: 'txn_1234567890'
            },
            status: {
              type: 'string',
              enum: ['SUCCESS', 'FAILED', 'PENDING'],
              description: 'Payment status',
              example: 'SUCCESS'
            },
            amount: {
              type: 'number',
              format: 'decimal',
              example: 11000.00
            },
            bookingId: {
              type: 'integer',
              example: 1
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Operation completed successfully'
            },
            data: {
              type: 'object',
              description: 'Response data'
            },
            error: {
              type: 'object',
              example: {}
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Operation failed'
            },
            data: {
              type: 'object',
              example: {}
            },
            error: {
              type: 'object',
              properties: {
                explanation: {
                  type: 'array',
                  items: {
                    type: 'string'
                  },
                  example: ['Validation error', 'Resource not found']
                },
                statusCode: {
                  type: 'integer',
                  example: 400
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routers/*.js', './src/controllers/*.js'] // Path to the API files
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs
};
