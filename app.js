const prompt = require('prompt-sync')();
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const Customer = require('./models/customer.js')


const connect = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const userInput = menu();
    if(userInput === '1') await createCustomer();
    else if(userInput === '2') await viewAllCustomers();
    else if(userInput === '3') await updateCustomer();
    else if(userInput === '4') await deleteCustomer();
    else await mongoose.connection.close();

    console.log('Disconnected from MongoDB');
    process.exit();
};

const menu = () => {
    console.log('Welcome to the CRM!');
    console.log('1. Create a customer');
    console.log('2. View all customers');
    console.log('3. Update a customer');
    console.log('4. Delete a customer');
    console.log('5. quit');
    const numberResponse = prompt('What would you like to do?');
    console.clear();
    return numberResponse;
}

const createCustomer = async () => {
    const name = prompt('What is the customers name?');
    const age = prompt('What is the customers age?');

    const newCustomer = {
        name: name,
        age: age,
    }

    const customer = await Customer.create(newCustomer);
    console.log('Your new customer: ', customer);
}

const viewAllCustomers = async () => {
    const customers = await Customer.find({});
    for await(const cust of customers){
        console.log(`id: ${cust.id} -- Name: ${cust.name}, Age: ${cust.age}`);
    }
}

const updateCustomer = async () => {
    await viewAllCustomers();

    console.log('')
    const selectedID = prompt('Copy and paste the id of the customer you would like to update here: ');
    console.log('');
    const newName = prompt('What is the customers new name? ');
    const newAge = prompt('What is the customers new age? ');

    const updatedCustomer = await Customer.findByIdAndUpdate(
        selectedID,
        {
            name: newName,
            age: newAge,
        },
        {new: true},
    );

    console.log('Updated customer: ', updatedCustomer);
    
}

const deleteCustomer = async () => {
    await viewAllCustomers();

    const deletedID = prompt('Copy and paste the id of the customer you would like to delete here: ');
    const deleteDocument = await Customer.findByIdAndDelete(deletedID);
    console.log('The deleted customer: ', deleteDocument)


}

connect();