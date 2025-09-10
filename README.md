# Flight Bookings Service

This microservice handles the complete booking lifecycle from initial reservation to payment processing. It orchestrates transactions across multiple services and ensures data consistency in a distributed system.

## What does this service do?

The Flight Bookings Service manages the entire booking process:

- **Booking Management**: Creates and manages flight bookings with state tracking
- **Distributed Transactions**: Handles complex multi-service operations with rollback capabilities
- **Payment Processing**: Integrates with payment systems using idempotency patterns
- **Automated Cleanup**: Prevents inventory leakage with scheduled cleanup jobs

## Key Features

### Booking State Machine
Implemented a robust booking lifecycle:
- **INITIATED**: Booking created, seats reserved
- **PENDING**: Payment in progress
- **BOOKED**: Successfully completed
- **CANCELLED**: Booking cancelled, seats released

### Distributed Transaction Handling
Solved the challenge of maintaining consistency across services:
- **Compensating Transactions**: If flight service fails after booking creation, automatically rollback
- **Two-Phase Operations**: Create booking locally, then reserve seats remotely
- **Failure Recovery**: Automatic seat restoration on booking failures
- **Saga Pattern**: Implements concepts from the Saga pattern for distributed transactions

### Payment Idempotency
Built safe payment processing:
- **Idempotency Keys**: Prevent duplicate payments using unique headers
- **Retry Safety**: Clients can safely retry failed payment requests
- **Transaction Tracking**: Links payments to specific bookings
- **Gateway Integration**: Ready for real payment gateway integration

### Automated Cleanup System
Prevents seat inventory leakage:
- **Cron Jobs**: Runs every 10 minutes to clean up stale bookings
- **Time-based Logic**: Cancels bookings stuck in INITIATED/PENDING for >10 minutes
- **Seat Recovery**: Automatically restores seats to flight inventory
- **System Reliability**: Ensures consistent state even after system failures

## Technical Challenges Solved

### Race Condition Prevention
Handled concurrent booking attempts using:
- Database transactions for atomic operations
- Row-level locking in the Flights service
- Proper error handling and retry logic

## Project Structure

```
src/
├── config/          # Server and database configuration
├── controllers/     # Booking and payment request handlers
├── middlewares/     # Request validation and processing
├── models/         # Booking model with status enums
├── repositories/   # Database operations with transactions
├── routers/        # API route definitions
├── services/       # Business logic and external service calls
└── utils/          # Cron jobs and helper functions
```

## Inter-Service Communication

This service communicates with:
- **Flights Service**: For availability checks and seat management
- **Notification Service**: For booking confirmations (planned)
- **Payment Gateway**: For transaction processing

Using RESTful APIs with proper error handling and retry mechanisms.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env`:
```
PORT=yout_port
FLIGHT_SERVICE_URL=your_flight_service_url_here
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=bookings_db
```

3. Run database setup:
```bash
npx sequelize-cli db:create
npx sequelize-cli db:migrate
```

4. Start the service:
```bash
npm run dev
```

## API Documentation

Interactive API documentation is available at:
http://localhost:yout_poort/api-docs

## Main Endpoints

- `POST /api/v1/bookings` - Create a new flight booking
- `POST /api/v1/payments` - Process payment for booking
- `GET /api/v1/bookings/:id` - Get booking details
- `PATCH /api/v1/bookings/:id/cancel` - Cancel a booking

## Example Booking Flow

1. **Create Booking**:
```bash
POST /api/v1/bookings
{
  "flightId": 123,
  "userId": 456,
  "numberOfSeats": 2
}
```

2. **Process Payment**:
```bash
POST /api/v1/payments
Headers: x-idempotency-key: unique-key-123
{
  "bookingId": 789,
  "amount": 11000.00,
  "userId": 456
}
```

## Monitoring and Reliability

- **Automated Jobs**: Cron jobs prevent system degradation
- **Error Tracking**: Comprehensive logging for debugging
- **Transaction Safety**: Database transactions ensure consistency

This service demonstrates advanced concepts in distributed systems, transaction management, and service reliability.
