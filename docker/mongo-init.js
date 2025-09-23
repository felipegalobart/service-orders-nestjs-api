// MongoDB initialization script
db = db.getSiblingDB('service-orders');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'password', 'role'],
      properties: {
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
        },
        password: {
          bsonType: 'string',
          minLength: 6,
        },
        role: {
          bsonType: 'string',
          enum: ['admin', 'user', 'manager'],
        },
      },
    },
  },
});

db.createCollection('persons', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['firstName', 'lastName'],
      properties: {
        firstName: {
          bsonType: 'string',
          minLength: 1,
        },
        lastName: {
          bsonType: 'string',
          minLength: 1,
        },
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
        },
      },
    },
  },
});

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.persons.createIndex({ email: 1 }, { unique: true, sparse: true });
db.persons.createIndex({ firstName: 1, lastName: 1 });
db.persons.createIndex({ createdAt: -1 });

print('Database initialized successfully!');
