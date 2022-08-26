### MERN Stack Ecommerce

### Features
- Login/Signup User Account
- Email verification ( only verified users can login )
- Update Profile/Password User Account
- Reset Password Mail using Nodemailer
- Cart Add/Remove Items | Update Quantities
- Wishlist Add/Remove Items
- Product Search
- Product Filters Based on Category/Ratings | Price Range | Exclude out of stock
- My Orders (With Filters)
- Order Details of All Ordered Item
- Review Products User Account
- Admin: Dashboard with Chart reports
- Admin: Dashboard access to only admin roles
- Admin: Update Order Status | Delete Order
- Admin: Add/Update Products
- Admin: Delete User
- Stock Management: Decrease stock of product when user place orders  
- Stock Management: Increese stock of product when user cancelled products

### Technology Used
- ReactJs
- Nodejs
- Express Js
- MongoDB Atlas
- Bootstrap

### Payment Gateways
- Razorpay

### Installation Process

```
git clone https://github.com/vishnuprasad404/MERN-Stack-Ecommerce.git
cd MERN-Stack-Ecommerce/
```
#### Install Dependencies

For Backend:
```
npm install
```
For Frontend:
```
cd frontend/
npm install
```
### Setup Env Variables

For Backend ( root folder )
```
ORIGIN = // origin url (eg:- http://localhost:3000)
BASE_URL = // base url (eg:- http://localhost:3001)
DATABASE_URI = // database url
DATABASE_NAME = // database name
ADMIN_COLLECTION = // collection name for admin login
USERS_COLLECTION = // collection name for user authentication
PRODUCTS_COLLECTION = // collection name for products
CART_COLLECTION = // collection name for cart
ORDERS_COLLECTION = // collection name for orders
FAVORITES_COLLECTION = // collection name for wishlist
ADDRESS_COLLECTION = // collection name for delivery address
VERIFICATION_COLLECTION = // collection name for verification tokens
PASSWORD_RESET_COLLECTION = // collection name for reset password token
RAZORPAY_KEY_ID = // your razorpay key id
RAZORPAY_KEY_SECRET = // your razorpay key secret
AUTH_EMAIL = // mail for email service
AUTH_PASS = // mail appPassword for mail service
```

For Frontend ( /frontend folder )
```
REACT_APP_BASE_URL = //Api base url ( eg:- http://localhost:3001 )
REACT_APP_RAZORPAY_KEY_ID = // your razorpay key id
```
### screenshots


![1](https://user-images.githubusercontent.com/109088129/186895071-abc1eee9-5e07-4ce1-a153-8294e9c6545a.png)
##
![Screenshot at 2022-08-20 19-11-26](https://user-images.githubusercontent.com/109088129/186895103-5babb99a-ce07-4e43-a95c-1cce883f0389.png)
##
![Screenshot at 2022-08-20 21-14-50](https://user-images.githubusercontent.com/109088129/186895244-4b343f7d-2a95-4cff-a189-708b69023911.png)
##
![Screenshot at 2022-08-20 19-16-42](https://user-images.githubusercontent.com/109088129/186895361-7881819a-fa7b-44e1-829a-2efdfb9903d0.png)
##
![Screenshot at 2022-08-20 19-12-04](https://user-images.githubusercontent.com/109088129/186895391-97ce7576-1241-458a-947e-4e2311eb69dd.png)
##
![Screenshot at 2022-08-20 19-18-38](https://user-images.githubusercontent.com/109088129/186895448-6228b96d-23b0-417c-aac2-1bf0de4ab4db.png)

#### Deployed on
[https://ecartonline.herokuapp.com/](https://ecartonline.herokuapp.com/)

